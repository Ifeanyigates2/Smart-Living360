import type { Metadata } from "next";

// Design preview of the customer job page (Figma: "Customer / Job page").
// TODO: load the real job by id from the database once jobs exist.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1 className="page-title">Job in progress</h1>
      <p className="muted">Status: Scheduled for Tuesday, 9:00 to 11:00 · Ref {id}</p>
      <p className="notice">Preview with placeholder details. Not a real job.</p>

      <div className="panel" style={{ marginTop: "1.5rem" }}>
        <div>
          <div className="muted" style={{ fontSize: "0.9rem", fontWeight: 600 }}>Provider</div>
          <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>Verified plumber, Ikeja</div>
        </div>
        <div>
          <div className="muted" style={{ fontSize: "0.9rem", fontWeight: 600 }}>Completion evidence</div>
          <div>Photos appear here once the provider marks the job complete.</div>
        </div>
      </div>
    </>
  );
}
