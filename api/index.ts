import express, { type Request, Response } from "express";
import { storage } from "../server/storage";
import { insertEquipmentSchema, insertEquipmentTypesSchema, fieldConfigSchema, searchEquipmentSchema, type FieldConfig } from "../shared/schema";
import { z } from "zod";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for Vercel deployment
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// Validate dynamic fields based on equipment type field configuration
async function validateDynamicFields(equipmentType: string, typeSpecificData: any): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    const types = await storage.getAllEquipmentTypes();
    const type = types.find((t) => t.name === equipmentType);
    
    if (!type) {
      errors.push(`Equipment type "${equipmentType}" not found`);
      return { valid: false, errors };
    }
    
    const fieldConfigs = (type.fieldsConfig as FieldConfig[] | null) ?? [];
    
    for (const field of fieldConfigs) {
      if (field.isRequired) {
        const value = typeSpecificData?.[field.dataKey];
        if (value === null || value === undefined || value === "") {
          errors.push(`${field.label} is required`);
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  } catch (error) {
    console.error("Error validating dynamic fields:", error);
    return { valid: false, errors: ["Failed to validate dynamic fields"] };
  }
}

// Equipment Routes

// Search equipment - MUST be before /:id route
app.get("/api/equipment/search", async (req, res) => {
  try {
    // Validate search parameters
    const searchParams = {
      query: req.query.query as string | undefined,
      searchType: req.query.searchType as string | undefined,
      latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
      longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
      radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
    };

    // Validate with schema
    const validatedParams = searchEquipmentSchema.parse(searchParams);

    if (validatedParams.latitude !== undefined && validatedParams.longitude !== undefined) {
      const lat = validatedParams.latitude;
      const lng = validatedParams.longitude;
      const rad = validatedParams.radius ?? 10;

      const equipment = await storage.searchByCoordinates(lat, lng, rad);
      return res.json(equipment);
    }

    const equipment = await storage.searchEquipment(
      validatedParams.query || "",
      (validatedParams.searchType as string) || "all"
    );
    res.json(equipment);
  } catch (error) {
    console.error("Error searching equipment:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid search parameters", details: error });
    }
    res.status(500).json({ error: "Failed to search equipment" });
  }
});

// Get all equipment
app.get("/api/equipment", async (_req, res) => {
  try {
    const equipment = await storage.getAllEquipment();
    res.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// Get equipment by ID
app.get("/api/equipment/:id", async (req, res) => {
  try {
    const equipment = await storage.getEquipmentById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// Create equipment
app.post("/api/equipment", async (req, res) => {
  try {
    const bodyWithDates = { ...req.body };
    if (bodyWithDates.installationDate && typeof bodyWithDates.installationDate !== 'object') {
      bodyWithDates.installationDate = new Date(bodyWithDates.installationDate);
    }
    if (bodyWithDates.lastMaintenance && typeof bodyWithDates.lastMaintenance !== 'object') {
      bodyWithDates.lastMaintenance = new Date(bodyWithDates.lastMaintenance);
    }
    
    const validatedData = insertEquipmentSchema.parse(bodyWithDates);
    
    const dynamicValidation = await validateDynamicFields(
      validatedData.type,
      validatedData.typeSpecificData
    );
    
    if (!dynamicValidation.valid) {
      return res.status(400).json({ 
        error: "Dynamic field validation failed", 
        details: dynamicValidation.errors 
      });
    }
    
    const equipment = await storage.createEquipment(validatedData);
    res.status(201).json(equipment);
  } catch (error) {
    console.error("Error creating equipment:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid equipment data", details: error });
    }
    res.status(500).json({ error: "Failed to create equipment" });
  }
});

// Update equipment
app.patch("/api/equipment/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.installationDate && typeof updates.installationDate !== 'object') {
      updates.installationDate = new Date(updates.installationDate);
    }
    if (updates.lastMaintenance && typeof updates.lastMaintenance !== 'object') {
      updates.lastMaintenance = new Date(updates.lastMaintenance);
    }
    
    const validatedUpdates = insertEquipmentSchema.partial().parse(updates);
    
    if (validatedUpdates.type !== undefined || validatedUpdates.typeSpecificData !== undefined) {
      const currentEquipment = await storage.getEquipmentById(req.params.id);
      if (!currentEquipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      
      const equipmentType = validatedUpdates.type ?? currentEquipment.type;
      const existingData = (currentEquipment.typeSpecificData as Record<string, any>) || {};
      const updatedData = (validatedUpdates.typeSpecificData as Record<string, any>) || {};
      const mergedTypeSpecificData = { ...existingData, ...updatedData };
      
      const dynamicValidation = await validateDynamicFields(equipmentType, mergedTypeSpecificData);
      
      if (!dynamicValidation.valid) {
        return res.status(400).json({ 
          error: "Dynamic field validation failed", 
          details: dynamicValidation.errors 
        });
      }
      
      if (validatedUpdates.typeSpecificData !== undefined) {
        validatedUpdates.typeSpecificData = mergedTypeSpecificData;
      }
    }
    
    const equipment = await storage.updateEquipment(req.params.id, validatedUpdates);
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.json(equipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid equipment data", details: error });
    }
    res.status(500).json({ error: "Failed to update equipment" });
  }
});

// Delete equipment
app.delete("/api/equipment/:id", async (req, res) => {
  try {
    const success = await storage.deleteEquipment(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({ error: "Failed to delete equipment" });
  }
});

// Equipment Types Routes

app.get("/api/equipment-types", async (_req, res) => {
  try {
    const types = await storage.getAllEquipmentTypes();
    res.json(types);
  } catch (error) {
    console.error("Error fetching equipment types:", error);
    res.status(500).json({ error: "Failed to fetch equipment types" });
  }
});

app.get("/api/equipment-types/:id", async (req, res) => {
  try {
    const type = await storage.getEquipmentTypeById(req.params.id);
    if (!type) {
      return res.status(404).json({ error: "Equipment type not found" });
    }
    res.json(type);
  } catch (error) {
    console.error("Error fetching equipment type:", error);
    res.status(500).json({ error: "Failed to fetch equipment type" });
  }
});

app.post("/api/equipment-types", async (req, res) => {
  try {
    const validatedData = insertEquipmentTypesSchema.parse(req.body);
    const type = await storage.createEquipmentType(validatedData);
    res.status(201).json(type);
  } catch (error) {
    console.error("Error creating equipment type:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid equipment type data", details: error });
    }
    res.status(500).json({ error: "Failed to create equipment type" });
  }
});

app.patch("/api/equipment-types/:id", async (req, res) => {
  try {
    const validatedUpdates = insertEquipmentTypesSchema.partial().parse(req.body);
    const type = await storage.updateEquipmentType(req.params.id, validatedUpdates);
    if (!type) {
      return res.status(404).json({ error: "Equipment type not found" });
    }
    res.json(type);
  } catch (error) {
    console.error("Error updating equipment type:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid equipment type data", details: error });
    }
    res.status(500).json({ error: "Failed to update equipment type" });
  }
});

app.delete("/api/equipment-types/:id", async (req, res) => {
  try {
    const success = await storage.deleteEquipmentType(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Equipment type not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting equipment type:", error);
    res.status(500).json({ error: "Failed to delete equipment type" });
  }
});

app.patch("/api/equipment-types/:id/fields", async (req, res) => {
  try {
    const fieldsConfigSchema = z.array(fieldConfigSchema);
    const validatedFields = fieldsConfigSchema.parse(req.body.fieldsConfig);
    
    const type = await storage.updateEquipmentTypeFields(req.params.id, validatedFields);
    if (!type) {
      return res.status(404).json({ error: "Equipment type not found" });
    }
    res.json(type);
  } catch (error) {
    console.error("Error updating field configurations:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid field configuration data", details: error });
    }
    res.status(500).json({ error: "Failed to update field configurations" });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel serverless
export default app;
