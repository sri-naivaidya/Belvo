import { MongoClient, ObjectId } from "mongodb";

// Lazy initialization — process.env is populated by dotenv AFTER ESM imports resolve,
// so we must read env vars at call time, not at module load time.
let _client = undefined;
let _db = undefined;

function getClient() {
  if (_client === undefined) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("Missing MongoDB credentials. Set MONGODB_URI.");
      _client = null;
    } else {
      _client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
    }
  }
  return _client;
}

export async function getDb() {
  const client = getClient();
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
  const client = getClient();
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
