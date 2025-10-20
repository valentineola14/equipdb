import { 
  type Equipment, 
  type InsertEquipment, 
  type EquipmentType,
  type InsertEquipmentType,
  equipment as equipmentTable,
  equipmentTypes as equipmentTypesTable
} from "../shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  // Equipment operations
  getAllEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: string): Promise<Equipment | undefined>;
  getEquipmentByEquipmentId(equipmentId: string): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: string): Promise<boolean>;
  
  // Search operations
  searchEquipment(query: string, searchType?: string): Promise<Equipment[]>;
  searchByCoordinates(latitude: number, longitude: number, radius?: number): Promise<Equipment[]>;
  
  // Equipment Types operations
  getAllEquipmentTypes(): Promise<EquipmentType[]>;
  getEquipmentTypeById(id: string): Promise<EquipmentType | undefined>;
  createEquipmentType(type: InsertEquipmentType): Promise<EquipmentType>;
  updateEquipmentType(id: string, type: Partial<InsertEquipmentType>): Promise<EquipmentType | undefined>;
  deleteEquipmentType(id: string): Promise<boolean>;
  updateEquipmentTypeFields(id: string, fieldsConfig: any): Promise<EquipmentType | undefined>;
}

export class PostgresStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const sqlClient = neon(process.env.DATABASE_URL);
    this.db = drizzle(sqlClient);
  }

  async getAllEquipment(): Promise<Equipment[]> {
    const result = await this.db.select().from(equipmentTable);
    return result;
  }

  async getEquipmentById(id: string): Promise<Equipment | undefined> {
    const result = await this.db
      .select()
      .from(equipmentTable)
      .where(eq(equipmentTable.id, id));
    return result[0];
  }

  async getEquipmentByEquipmentId(equipmentId: string): Promise<Equipment | undefined> {
    const result = await this.db
      .select()
      .from(equipmentTable)
      .where(eq(equipmentTable.equipmentId, equipmentId));
    return result[0];
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const result = await this.db
      .insert(equipmentTable)
      .values(insertEquipment)
      .returning();
    return result[0];
  }

  async updateEquipment(
    id: string,
    updates: Partial<InsertEquipment>
  ): Promise<Equipment | undefined> {
    const result = await this.db
      .update(equipmentTable)
      .set(updates)
      .where(eq(equipmentTable.id, id))
      .returning();
    return result[0];
  }

  async deleteEquipment(id: string): Promise<boolean> {
    const result = await this.db
      .delete(equipmentTable)
      .where(eq(equipmentTable.id, id))
      .returning();
    return result.length > 0;
  }

  async searchEquipment(query: string, searchType: string = "all"): Promise<Equipment[]> {
    if (!query || query.trim() === "") {
      return this.getAllEquipment();
    }

    const lowerQuery = `%${query.toLowerCase()}%`;

    switch (searchType) {
      case "id":
        return await this.db
          .select()
          .from(equipmentTable)
          .where(ilike(equipmentTable.equipmentId, lowerQuery));
      
      case "address":
        return await this.db
          .select()
          .from(equipmentTable)
          .where(
            or(
              ilike(equipmentTable.address, lowerQuery),
              ilike(equipmentTable.location, lowerQuery)
            )
          );
      
      default: // "all"
        return await this.db
          .select()
          .from(equipmentTable)
          .where(
            or(
              ilike(equipmentTable.equipmentId, lowerQuery),
              ilike(equipmentTable.name, lowerQuery),
              ilike(equipmentTable.type, lowerQuery),
              ilike(equipmentTable.address, lowerQuery),
              ilike(equipmentTable.location, lowerQuery)
            )
          );
    }
  }

  async searchByCoordinates(
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<Equipment[]> {
    // Haversine formula using SQL
    const result = await this.db
      .select()
      .from(equipmentTable)
      .where(
        sql`(
          6371 * acos(
            cos(radians(${latitude})) * 
            cos(radians(CAST(${equipmentTable.latitude} AS DECIMAL))) * 
            cos(radians(CAST(${equipmentTable.longitude} AS DECIMAL)) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(CAST(${equipmentTable.latitude} AS DECIMAL)))
          )
        ) <= ${radius}`
      );
    
    return result;
  }

  async getAllEquipmentTypes(): Promise<EquipmentType[]> {
    const result = await this.db.select().from(equipmentTypesTable);
    return result;
  }

  async getEquipmentTypeById(id: string): Promise<EquipmentType | undefined> {
    const result = await this.db
      .select()
      .from(equipmentTypesTable)
      .where(eq(equipmentTypesTable.id, id));
    return result[0];
  }

  async createEquipmentType(insertType: InsertEquipmentType): Promise<EquipmentType> {
    const result = await this.db
      .insert(equipmentTypesTable)
      .values(insertType)
      .returning();
    return result[0];
  }

  async updateEquipmentType(
    id: string,
    updates: Partial<InsertEquipmentType>
  ): Promise<EquipmentType | undefined> {
    const result = await this.db
      .update(equipmentTypesTable)
      .set(updates)
      .where(eq(equipmentTypesTable.id, id))
      .returning();
    return result[0];
  }

  async deleteEquipmentType(id: string): Promise<boolean> {
    const result = await this.db
      .delete(equipmentTypesTable)
      .where(eq(equipmentTypesTable.id, id))
      .returning();
    return result.length > 0;
  }

  async updateEquipmentTypeFields(id: string, fieldsConfig: any): Promise<EquipmentType | undefined> {
    const result = await this.db
      .update(equipmentTypesTable)
      .set({ fieldsConfig })
      .where(eq(equipmentTypesTable.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new PostgresStorage();
