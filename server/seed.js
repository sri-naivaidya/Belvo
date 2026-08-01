// MongoDB setup + seed — equivalent of server/schema.sql
// Run with: node seed.js   (from the server/ directory, after setting .env)

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "belvo";

if (!uri) {
  console.error("Missing MONGODB_URI. Set it in server/.env");
  process.exit(1);
}

const DEPARTMENT_SEEDS = [
  { id: "web", name: "Web Development", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 1 },
  { id: "app", name: "App Development", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 2 },
  { id: "cyber", name: "Cyber Security", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 3 },
  { id: "software", name: "Software Development", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 4 },
  { id: "analytics", name: "Business & Data Analytics", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 5 },
  { id: "graphic", name: "Graphic Designing", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 6 },
  { id: "social", name: "Social Media Management", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 7 },
  { id: "content", name: "Content Writer", color: "#7B2FBE", light_color: "#9D4EDD", sort_order: 8 },
  { id: "admin", name: "Administration", color: "#007BFF", light_color: "#0056b3", sort_order: 9 },
];

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const now = new Date().toISOString();

    // Ensure core collections exist
    const collections = [
      "departments",
      "team_members",
      "tool_orders",
      "book_calls",
      "profiles",
      "payments",
      "timeline_events",
    ];
    for (const name of collections) {
      await db.createCollection(name);
    }

    // Indexes
    await db.collection("team_members").createIndex({ team_id: 1 });
    await db.collection("team_members").createIndex({ sort_order: 1 });
    await db.collection("tool_orders").createIndex({ customer_email: 1 });
    await db.collection("book_calls").createIndex({ created_at: -1 });
    await db.collection("profiles").createIndex({ email: 1 }, { unique: true });
    await db.collection("payments").createIndex({ client_id: 1 });
    await db.collection("timeline_events").createIndex({ client_id: 1, event_date: -1 });

    // Seed departments (skip existing ids)
    const departments = db.collection("departments");
    let seeded = 0;
    for (const dept of DEPARTMENT_SEEDS) {
      const existing = await departments.findOne({ _id: dept.id });
      if (!existing) {
        await departments.insertOne({ _id: dept.id, ...dept, created_at: now, updated_at: now });
        seeded++;
      }
    }

    console.log(`✅ Connected to MongoDB (db: ${dbName})`);
    console.log(`   Collections ready: ${collections.join(", ")}`);
    console.log(`   Departments seeded: ${seeded} (existing kept)`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
