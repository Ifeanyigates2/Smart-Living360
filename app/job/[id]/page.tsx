import type { Metadata } from "next";

// Design preview of the customer job page (Figma: "Customer / Job page").
// TODO: load the real job by id from the database once jobs exist.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container page">
      <p className="eyebrow">Your job</p>
      <h1 className="page-title">Job in progress</h1>
      <p className="muted">Scheduled for Tuesday, 9:00 to 11:00 · Ref {id}</p>
      <p className="notice">Preview with placeholder details. Not a real job.</p>

      <div className="job-grid">
        <section className="panel">
          <div className="provider">
            <img src="/images/trade-04.jpg" alt="" />
            <div>
              <div className="muted" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                Provider
              </div>
              <strong>Verified plumber, Ikeja</strong>
            </div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              Completion evidence
            </div>
            <div className="evidence">Photos appear here once the provider marks the job complete.</div>
          </div>
        </section>

        <section className="panel">
          <h2 style={{ fontSize: "1.15rem" }}>Status</h2>
          <ol className="timeline">
            <li className="done">
              <div>
                <strong>Request received</strong>
                <span>We have the details.</span>
              </div>
            </li>
            <li className="done">
              <div>
                <strong>Quote approved</strong>
                <span>The price was agreed in writing.</span>
              </div>
            </li>
            <li className="current">
              <div>
                <strong>Scheduled</strong>
                <span>Tuesday, 9:00 to 11:00.</span>
              </div>
            </li>
            <li>
              <div>
                <strong>On site</strong>
                <span>The provider has not started yet.</span>
              </div>
            </li>
            <li>
              <div>
                <strong>Photos of the finished work</strong>
                <span>Added when the job is marked complete.</span>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
