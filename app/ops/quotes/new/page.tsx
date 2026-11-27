"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Line = { description: string; amount: string; type: "service" | "materials" | "fee" };

const blankLine = (): Line => ({ description: "", amount: "", type: "service" });

function QuoteForm() {
  const params = useSearchParams();
  const [requestId, setRequestId] = useState("");
  const [validDays, setValidDays] = useState("7");
  const [lines, setLines] = useState<Line[]>([blankLine()]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    const id = params.get("requestId");
    if (id) setRequestId(id);
  }, [params]);

  function update(i: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setLink(null);
    try {
      const res = await fetch("/api/ops/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.trim(),
          validDays: Number(validDays),
          lines: lines.map((l) => ({ description: l.description, amount: Number(l.amount), type: l.type })),
        }),
      });
      const json = await res.json();
      if (res.status === 201) setLink(json.link);
      else if (res.status === 401) setError("Your staff session has ended. Sign in again.");
      else setError(json.error ?? "The quote could not be created.");
    } catch {
      setError("Network problem. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const total = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  return (
    <>
      <h1 className="page-title">New quote</h1>
      <form className="request" onSubmit={submit}>
        <label>
          Request reference
          <input required value={requestId} onChange={(e) => setRequestId(e.target.value)} placeholder="REQ-XXXX" />
        </label>
        <label>
          Valid for (days, 1 to 30)
          <input type="number" min={1} max={30} value={validDays} onChange={(e) => setValidDays(e.target.value)} />
        </label>

        <div className="panel">
          {lines.map((l, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "0.5rem", alignItems: "end" }}>
              <label>
                Description
                <input required minLength={2} maxLength={200} value={l.description} onChange={(e) => update(i, { description: e.target.value })} />
              </label>
              <label>
                Amount (₦)
                <input required type="number" min={1} step={1} value={l.amount} onChange={(e) => update(i, { amount: e.target.value })} />
              </label>
              <label>
                Type
                <select value={l.type} onChange={(e) => update(i, { type: e.target.value as Line["type"] })}>
                  <option value="service">Service</option>
                  <option value="materials">Materials</option>
                  <option value="fee">Platform fee</option>
                </select>
              </label>
              <button type="button" className="btn btn-outline" disabled={lines.length === 1} onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))}>
                Remove
              </button>
            </div>
          ))}
          <div className="line-row">
            <button type="button" className="btn btn-outline" disabled={lines.length >= 20} onClick={() => setLines((p) => [...p, blankLine()])}>
              Add line
            </button>
            <strong>Total: ₦{total.toLocaleString("en-NG")}</strong>
          </div>
        </div>

        {error && <p role="alert" style={{ color: "var(--brand-red)" }}>{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Creating…" : "Create quote"}</button>
      </form>

      {link && (
        <p className="notice">
          Quote created. Send the customer this link: <a href={link}>{link}</a>
        </p>
      )}
    </>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <QuoteForm />
    </Suspense>
  );
}
