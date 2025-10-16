import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEquipmentSchema, searchEquipmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Search equipment
  app.get("/api/equipment/search", async (req, res) => {
    try {
      const { query, searchType, latitude, longitude, radius } = req.query;

      // If searching by coordinates
      if (latitude && longitude) {
        const lat = parseFloat(latitude as string);
        const lng = parseFloat(longitude as string);
        const rad = radius ? parseFloat(radius as string) : 10;

        if (isNaN(lat) || isNaN(lng)) {
          return res.status(400).json({ error: "Invalid coordinates" });
        }

        const equipment = await storage.searchByCoordinates(lat, lng, rad);
        return res.json(equipment);
      }

      // Regular text search
      const equipment = await storage.searchEquipment(
        (query as string) || "",
        (searchType as string) || "all"
      );
      res.json(equipment);
    } catch (error) {
      console.error("Error searching equipment:", error);
      res.status(500).json({ error: "Failed to search equipment" });
    }
  });

  // Create equipment
  app.post("/api/equipment", async (req, res) => {
    try {
      const validatedData = insertEquipmentSchema.parse(req.body);
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
      const equipment = await storage.updateEquipment(req.params.id, req.body);
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      console.error("Error updating equipment:", error);
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

  const httpServer = createServer(app);

  return httpServer;
}
