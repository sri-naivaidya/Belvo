import { MongoClient, ObjectId } from "mongodb";

import { MongoMemoryServer } from 'mongodb-memory-server';

let _client = undefined;
let _db = undefined;
let clientPromise = null;

async function getClient() {
  if (clientPromise) return clientPromise;

  clientPromise = (async () => {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log("No MONGODB_URI provided. Starting in-memory MongoDB...");
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log("In-memory MongoDB started at:", uri);
    }

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    return client;
  })();

  _client = await clientPromise;
  return _client;
}

export async function getDb() {
  const client = await getClient();
  if (!client) throw new Error("Database not configured — set MONGODB_URI");
  if (!_db) {
    await client.connect();
    _db = client.db(process.env.MONGODB_DB || "belvo");
  }
  return _db;
}

export async function collection(name) {
  const db = await getDb();
  return db.collection(name);
}

export async function isDbReady() {
  const client = await getClient();
  if (!client) return false;
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return true;
  } catch (err) {
    console.error("MongoDB connection failed:", err?.message);
    return false;
  }
}

export { ObjectId };
