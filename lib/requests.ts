import { getDb } from "@/lib/db";
import type { RequestInput } from "@/lib/request-schema";

export type SavedRequest = RequestInput & { id: string; createdAt: string; status: "submitted" };

// In-memory fallback, used only when MONGODB_URI is not set (local development).
const memoryStore: SavedRequest[] = [];

function newId(): string {
  return `REQ-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export async function saveRequest(input: RequestInput): Promise<SavedRequest> {
  const id = newId();
  const createdAt = new Date();
  const conn = await getDb();

  if (!conn) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is not set; refusing to keep requests in memory in production.");
    }
    const record: SavedRequest = { ...input, id, createdAt: createdAt.toISOString(), status: "submitted" };
    memoryStore.push(record);
    return record;
  }

  const { client, db } = conn;
  const session = client.startSession();
  try {
    // One transaction: customer, request and audit entry succeed or fail together.
    await session.withTransaction(async () => {
      await db.collection("customers").updateOne(
        { phone: input.phone },
        { $set: { name: input.name }, $setOnInsert: { phone: input.phone, createdAt: createdAt } },
        { upsert: true, session },
      );
      const customer = await db.collection("customers").findOne({ phone: input.phone }, { session, projection: { _id: 1 } });
      const category = await db.collection("service_categories").findOne({ name: input.category }, { session, projection: { _id: 1 } });

      await db.collection<{ _id: string } & Record<string, unknown>>("requests").insertOne(
        {
          _id: id,
          customerId: customer?._id ?? null,
          categoryId: category?._id ?? null,
          category: input.category,
          address: input.address,
          details: input.details,
          preferredWindow: input.window ?? null,
          name: input.name,
          phone: input.phone,
          status: "submitted",
          createdAt,
        },
        { session },
      );

      await db.collection("audit_logs").insertOne(
        {
          actorId: "customer",
          action: "request.created",
          entity: "request",
          entityId: id,
          after: { category: input.category },
          createdAt,
        },
        { session },
      );
    });
  } finally {
    await session.endSession();
  }

  return { ...input, id, createdAt: createdAt.toISOString(), status: "submitted" };
}
