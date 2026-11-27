import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/db";

export const LINE_TYPES = ["service", "materials", "fee"] as const;
export type LineType = (typeof LINE_TYPES)[number];
export type QuoteLine = { description: string; amount: number; type: LineType };
export type QuoteInput = { requestId: string; lines: QuoteLine[]; validDays: number };
export type QuoteView = {
  id: string;
  requestId: string;
  lines: QuoteLine[];
  total: number;
  status: string;
  validUntil: Date;
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const TOKEN_FORMAT = /^[A-Za-z0-9_-]{20,64}$/;
const REQUEST_FORMAT = /^REQ-[A-Z0-9]{4,20}$/;
const OPEN_REQUEST_STATUSES = ["submitted", "triaged", "matched"];

export function validateQuoteInput(body: unknown): Result<QuoteInput> {
  const b = (body ?? {}) as Record<string, unknown>;
  if (typeof b.requestId !== "string" || !REQUEST_FORMAT.test(b.requestId)) {
    return { ok: false, error: "Invalid request id." };
  }
  const validDays = b.validDays === undefined ? 7 : Number(b.validDays);
  if (!Number.isInteger(validDays) || validDays < 1 || validDays > 30) {
    return { ok: false, error: "validDays must be a whole number from 1 to 30." };
  }
  if (!Array.isArray(b.lines) || b.lines.length < 1 || b.lines.length > 20) {
    return { ok: false, error: "Provide between 1 and 20 quote lines." };
  }

  const lines: QuoteLine[] = [];
  for (const raw of b.lines) {
    const l = (raw ?? {}) as Record<string, unknown>;
    const description = typeof l.description === "string" ? l.description.trim() : "";
    const amount = Number(l.amount);
    if (description.length < 2 || description.length > 200) {
      return { ok: false, error: "Each line needs a description of 2 to 200 characters." };
    }
    if (!Number.isInteger(amount) || amount < 1 || amount > 10_000_000) {
      return { ok: false, error: "Each amount must be a whole number of naira." };
    }
    if (!(LINE_TYPES as readonly string[]).includes(l.type as string)) {
      return { ok: false, error: "Each line needs a type: service, materials or fee." };
    }
    lines.push({ description, amount, type: l.type as LineType });
  }
  return { ok: true, value: { requestId: b.requestId, lines, validDays } };
}

export function totalOf(lines: QuoteLine[]): number {
  return lines.reduce((sum, l) => sum + l.amount, 0);
}

// Creates a quote and moves the request to "quoted", in one transaction.
export async function createQuote(input: QuoteInput, staffId: string): Promise<Result<{ token: string; total: number }>> {
  const conn = await getDb();
  if (!conn) return { ok: false, error: "Database is not connected." };

  const token = randomBytes(24).toString("base64url");
  const now = new Date();
  const validUntil = new Date(now.getTime() + input.validDays * 86_400_000);
  const total = totalOf(input.lines);

  const requests = conn.db.collection<{ _id: string; status: string }>("requests");
  const quotes = conn.db.collection("quotes");
  const session = conn.client.startSession();
  let failure: string | null = null;
  try {
    await session.withTransaction(async () => {
      failure = null;
      const req = await requests.findOne({ _id: input.requestId }, { session });
      if (!req) {
        failure = "Request not found.";
        return;
      }
      if (!OPEN_REQUEST_STATUSES.includes(req.status)) {
        failure = `A quote cannot be created while the request is ${req.status}.`;
        return;
      }
      await quotes.insertOne(
        {
          _id: token,
          requestId: input.requestId,
          version: 1,
          status: "sent",
          lines: input.lines,
          total,
          createdBy: staffId,
          createdAt: now,
          validUntil,
        } as never,
        { session },
      );
      await requests.updateOne({ _id: input.requestId }, { $set: { status: "quoted" } }, { session });
      await conn.db.collection("audit_logs").insertOne(
        {
          actorId: staffId,
          action: "quote.created",
          entity: "quote",
          entityId: token,
          after: { requestId: input.requestId, total },
          createdAt: now,
        },
        { session },
      );
    });
  } finally {
    await session.endSession();
  }

  if (failure) return { ok: false, error: failure };
  return { ok: true, value: { token, total } };
}

export async function getQuoteView(id: string): Promise<QuoteView | null> {
  if (!TOKEN_FORMAT.test(id)) return null;
  const conn = await getDb();
  if (!conn) return null;
  const doc = await conn.db.collection("quotes").findOne({ _id: id as never });
  if (!doc) return null;
  return {
    id,
    requestId: String(doc.requestId),
    lines: doc.lines as QuoteLine[],
    total: Number(doc.total),
    status: String(doc.status),
    validUntil: doc.validUntil as Date,
  };
}

// Customer decision on a quote. Only an open, unexpired quote can be answered, once.
export async function respondToQuote(id: string, decision: "approved" | "declined"): Promise<Result<"ok">> {
  if (!TOKEN_FORMAT.test(id)) return { ok: false, error: "Quote not found." };
  const conn = await getDb();
  if (!conn) return { ok: false, error: "Database is not connected." };

  const now = new Date();
  const quotes = conn.db.collection("quotes");
  const requests = conn.db.collection<{ _id: string; status: string }>("requests");
  const session = conn.client.startSession();
  let failure: string | null = null;
  try {
    await session.withTransaction(async () => {
      failure = null;
      const quote = await quotes.findOne({ _id: id as never }, { session });
      if (!quote) {
        failure = "Quote not found.";
        return;
      }
      if (quote.status !== "sent") {
        failure = "This quote has already been answered.";
        return;
      }
      if ((quote.validUntil as Date) < now) {
        await quotes.updateOne({ _id: id as never }, { $set: { status: "expired" } }, { session });
        failure = "This quote has expired. Ask us for a new one.";
        return;
      }
      await quotes.updateOne(
        { _id: id as never },
        { $set: { status: decision, respondedAt: now } },
        { session },
      );
      await requests.updateOne(
        { _id: String(quote.requestId) },
        { $set: { status: decision === "approved" ? "quote_approved" : "declined" } },
        { session },
      );
      await conn.db.collection("audit_logs").insertOne(
        {
          actorId: "customer",
          action: `quote.${decision}`,
          entity: "quote",
          entityId: id,
          createdAt: now,
        },
        { session },
      );
    });
  } finally {
    await session.endSession();
  }

  if (failure) return { ok: false, error: failure };
  return { ok: true, value: "ok" };
}
