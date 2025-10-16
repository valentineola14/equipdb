import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: text("equipment_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  manufacturer: text("manufacturer"),
  model: text("model"),
  capacity: text("capacity"),
  voltage: text("voltage"),
  installationDate: timestamp("installation_date"),
  lastMaintenance: timestamp("last_maintenance"),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
});

export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

// Search parameters schema
export const searchEquipmentSchema = z.object({
  query: z.string().optional(),
  searchType: z.enum(["all", "id", "address", "coordinates"]).optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional(),
});

export type SearchEquipment = z.infer<typeof searchEquipmentSchema>;
