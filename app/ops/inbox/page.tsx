import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/db";

// Staff only: middleware redirects anonymous visitors to /ops/login.
export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function age(createdAt: Date): string {
  const mins = Math.max(0, Math.round((Date.now() - createdAt.getTime()) / 60000));
  if (mins < 60) return `${mins}m`;
  if (mins < 60 * 48) return `${Math.round(mins / 60)}h`;
  return `${Math.round(mins / 1440)}d`;
}

export default async function OpsInboxPage() {
  const conn = await getDb();
  const requests = conn
    ? await conn.db
        .collection("requests")
        .find({}, { projection: { name: 1, category: 1, status: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()
    : [];

  return (
    <>
      <h1 className="page-title">Request inbox</h1>
      {!conn && <p className="notice">The database is not connected, so there are no requests to show.</p>}
      {conn && requests.length === 0 && <p className="muted">No requests yet.</p>}
      {requests.length > 0 && (
        <table className="table" style={{ marginTop: "1.5rem" }}>
          <thead>
            <tr>
              <th>Request</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Status</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={String(r._id)}>
                <td><Link href={`/ops/quotes/new?requestId=${encodeURIComponent(String(r._id))}`}>{String(r._id)}</Link></td>
                <td>{String(r.name ?? "")}</td>
                <td>{String(r.category ?? "")}</td>
                <td><span className="badge">{String(r.status ?? "submitted")}</span></td>
                <td>{r.createdAt instanceof Date ? age(r.createdAt) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
