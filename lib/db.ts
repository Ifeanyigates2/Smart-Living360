import { MongoClient, type Db } from "mongodb";

// Connection string from MONGODB_URI (.env.local in dev, Vercel env vars in prod).
// Use a replica set (MongoDB Atlas is one by default): multi-document transactions need it.
const globalForMongo = globalThis as unknown as { mongoPromise?: Promise<{ client: MongoClient; db: Db }> };

export async function getDb(): Promise<{ client: MongoClient; db: Db } | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (!globalForMongo.mongoPromise) {
    globalForMongo.mongoPromise = (async () => {
      const client = new MongoClient(uri, { maxPoolSize: 5 });
      await client.connect();
      const db = client.db(process.env.MONGODB_DB ?? "smartliving360");
      await ensureSchema(db);
      return { client, db };
    })();
  }
  return globalForMongo.mongoPromise;
}

// Indexes and seed data. Safe to run on every cold start (idempotent).
async function ensureSchema(db: Db) {
  await db.collection("customers").createIndex({ phone: 1 }, { unique: true });
  await db.collection("requests").createIndex({ status: 1, createdAt: 1 });
  await db.collection("service_categories").createIndex({ name: 1 }, { unique: true });
  await db.collection("audit_logs").createIndex({ entityId: 1, createdAt: 1 });
  await db.collection("staff").createIndex({ email: 1 }, { unique: true });

  const categories = [
    { name: "Home care", serviceArea: "A", active: true },
    { name: "Repairs", serviceArea: "B", active: true },
    { name: "Build & materials", serviceArea: "C", active: true },
  ];
  for (const c of categories) {
    await db.collection("service_categories").updateOne({ name: c.name }, { $setOnInsert: c }, { upsert: true });
  }
}
