import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { equipment } from "../shared/schema";

const sampleEquipment = [
  {
    equipmentId: "TRF-001-NYC",
    name: "Central Park Transformer",
    type: "Transformer",
    status: "operational",
    location: "Manhattan",
    address: "Central Park West, New York, NY 10024",
    latitude: "40.7829",
    longitude: "-73.9654",
    manufacturer: "ABB",
    model: "TXP-500",
    capacity: "500 MVA",
    voltage: "345 kV",
    installationDate: new Date("2018-03-15"),
    lastMaintenance: new Date("2024-09-01"),
  },
  {
    equipmentId: "SUB-002-NYC",
    name: "Times Square Substation",
    type: "Substation",
    status: "operational",
    location: "Manhattan",
    address: "Broadway & 42nd St, New York, NY 10036",
    latitude: "40.7580",
    longitude: "-73.9855",
    manufacturer: "Siemens",
    model: "SS-750",
    capacity: "750 MVA",
    voltage: "138 kV",
    installationDate: new Date("2015-06-20"),
    lastMaintenance: new Date("2024-08-15"),
  },
  {
    equipmentId: "GEN-003-BRK",
    name: "Brooklyn Generator Station",
    type: "Generator",
    status: "maintenance",
    location: "Brooklyn",
    address: "Brooklyn Navy Yard, Brooklyn, NY 11205",
    latitude: "40.7034",
    longitude: "-73.9708",
    manufacturer: "General Electric",
    model: "GEN-1000",
    capacity: "1000 MW",
    voltage: "230 kV",
    installationDate: new Date("2016-11-10"),
    lastMaintenance: new Date("2024-10-01"),
  },
  {
    equipmentId: "CB-004-QNS",
    name: "Queens Circuit Breaker",
    type: "Circuit Breaker",
    status: "operational",
    location: "Queens",
    address: "Long Island City, Queens, NY 11101",
    latitude: "40.7447",
    longitude: "-73.9485",
    manufacturer: "Schneider Electric",
    model: "CB-500",
    capacity: "500 MVA",
    voltage: "138 kV",
    installationDate: new Date("2019-02-28"),
    lastMaintenance: new Date("2024-09-20"),
  },
  {
    equipmentId: "CAP-005-BRX",
    name: "Bronx Capacitor Bank",
    type: "Capacitor Bank",
    status: "operational",
    location: "Bronx",
    address: "Yankee Stadium Area, Bronx, NY 10451",
    latitude: "40.8296",
    longitude: "-73.9262",
    manufacturer: "Eaton",
    model: "CAP-300",
    capacity: "300 MVAR",
    voltage: "138 kV",
    installationDate: new Date("2017-08-05"),
    lastMaintenance: new Date("2024-07-10"),
  },
  {
    equipmentId: "VR-006-SI",
    name: "Staten Island Voltage Regulator",
    type: "Voltage Regulator",
    status: "offline",
    location: "Staten Island",
    address: "Richmond Terrace, Staten Island, NY 10301",
    latitude: "40.6437",
    longitude: "-74.0776",
    manufacturer: "Cooper Power Systems",
    model: "VR-250",
    capacity: "250 MVA",
    voltage: "69 kV",
    installationDate: new Date("2014-05-12"),
    lastMaintenance: new Date("2024-06-01"),
  },
  {
    equipmentId: "TRF-007-NYC",
    name: "Wall Street Transformer",
    type: "Transformer",
    status: "operational",
    location: "Manhattan",
    address: "Wall Street, New York, NY 10005",
    latitude: "40.7074",
    longitude: "-74.0113",
    manufacturer: "ABB",
    model: "TXP-600",
    capacity: "600 MVA",
    voltage: "345 kV",
    installationDate: new Date("2019-09-15"),
    lastMaintenance: new Date("2024-09-25"),
  },
  {
    equipmentId: "SUB-008-BRK",
    name: "Williamsburg Substation",
    type: "Substation",
    status: "maintenance",
    location: "Brooklyn",
    address: "Bedford Ave, Brooklyn, NY 11249",
    latitude: "40.7081",
    longitude: "-73.9571",
    manufacturer: "Siemens",
    model: "SS-850",
    capacity: "850 MVA",
    voltage: "138 kV",
    installationDate: new Date("2016-04-18"),
    lastMaintenance: new Date("2024-10-10"),
  },
  {
    equipmentId: "GEN-009-QNS",
    name: "Astoria Power Plant",
    type: "Generator",
    status: "operational",
    location: "Queens",
    address: "Astoria Blvd, Queens, NY 11105",
    latitude: "40.7769",
    longitude: "-73.9301",
    manufacturer: "General Electric",
    model: "GEN-1200",
    capacity: "1200 MW",
    voltage: "345 kV",
    installationDate: new Date("2015-12-01"),
    lastMaintenance: new Date("2024-08-30"),
  },
  {
    equipmentId: "CB-010-MAN",
    name: "Upper West Side Circuit Breaker",
    type: "Circuit Breaker",
    status: "operational",
    location: "Manhattan",
    address: "Amsterdam Ave, New York, NY 10023",
    latitude: "40.7767",
    longitude: "-73.9815",
    manufacturer: "Schneider Electric",
    model: "CB-450",
    capacity: "450 MVA",
    voltage: "138 kV",
    installationDate: new Date("2018-07-22"),
    lastMaintenance: new Date("2024-09-05"),
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Seeding database...");

  // Check if data already exists
  const existing = await db.select().from(equipment);
  if (existing.length > 0) {
    console.log("Database already seeded with", existing.length, "equipment items");
    return;
  }

  // Insert sample data
  await db.insert(equipment).values(sampleEquipment);
  
  console.log("Successfully seeded", sampleEquipment.length, "equipment items");
}

seed().catch(console.error);
