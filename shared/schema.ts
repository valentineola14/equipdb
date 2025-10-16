import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
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
  typeSpecificData: jsonb("type_specific_data"),
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

// Type-specific data schemas for different equipment types
export const transformerDataSchema = z.object({
  primaryVoltage: z.string().optional(),
  secondaryVoltage: z.string().optional(),
  kvaRating: z.string().optional(),
  coolingType: z.string().optional(),
  tapChangerType: z.string().optional(),
});

export const substationDataSchema = z.object({
  voltageLevel: z.string().optional(),
  numberOfTransformers: z.string().optional(),
  switchgearType: z.string().optional(),
  controlSystem: z.string().optional(),
  busConfiguration: z.string().optional(),
});

export const generatorDataSchema = z.object({
  fuelType: z.string().optional(),
  ratedPowerMW: z.string().optional(),
  efficiency: z.string().optional(),
  startType: z.string().optional(),
  coolantType: z.string().optional(),
});

export const circuitBreakerDataSchema = z.object({
  breakingCapacity: z.string().optional(),
  ratedCurrent: z.string().optional(),
  numberOfPoles: z.string().optional(),
  mechanismType: z.string().optional(),
  insulatingMedium: z.string().optional(),
});

export const switchDataSchema = z.object({
  switchType: z.string().optional(),
  ratedCurrent: z.string().optional(),
  numberOfPoles: z.string().optional(),
  operatingMechanism: z.string().optional(),
  insulationType: z.string().optional(),
});

export type TransformerData = z.infer<typeof transformerDataSchema>;
export type SubstationData = z.infer<typeof substationDataSchema>;
export type GeneratorData = z.infer<typeof generatorDataSchema>;
export type CircuitBreakerData = z.infer<typeof circuitBreakerDataSchema>;
export type SwitchData = z.infer<typeof switchDataSchema>;
