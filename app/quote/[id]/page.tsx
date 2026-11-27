import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuoteView } from "@/lib/quotes";
import { approveQuoteAction, declineQuoteAction } from "./actions";

// Private link: anyone with the link can see it, so keep it out of search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const typeLabel: Record<string, string> = { service: "Service", materials: "Materials", fee: "Platform fee (disclosed)" };

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await getQuoteView(id);
  if (!quote) notFound();

  const expired = quote.validUntil.getTime() < Date.now();
  const open = quote.status === "sent" && !expired;
  const validText = quote.validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  return (
    <>
      <h1 className="page-title">Your quote</h1>
      <p className="muted">Reference {quote.requestId} · Valid until {validText}</p>

      {quote.status === "approved" && <p className="notice">You approved this quote. Payment is the next step.</p>}
      {quote.status === "declined" && <p className="notice">You declined this quote.</p>}
      {quote.status === "expired" || (quote.status === "sent" && expired) ? (
        <p className="notice">This quote has expired. Ask us for a new one.</p>
      ) : null}

      <div className="panel" style={{ marginTop: "1.5rem" }}>
        {quote.lines.map((l, i) => (
          <div className="line-row" key={i}>
            <span>
              {l.description} <span className="muted">· {typeLabel[l.type] ?? l.type}</span>
            </span>
            <span style={{ fontWeight: 600 }}>{naira(l.amount)}</span>
          </div>
        ))}
        <div className="line-row line-total">
          <span>Total</span>
          <span>{naira(quote.total)}</span>
        </div>
      </div>

      {open && (
        <div className="actions-row">
          <form action={approveQuoteAction}>
            <input type="hidden" name="id" value={id} />
            <button className="btn" type="submit">Approve quote</button>
          </form>
          <form action={declineQuoteAction}>
            <input type="hidden" name="id" value={id} />
            <button className="btn btn-outline" type="submit">Decline</button>
          </form>
        </div>
      )}
    </>
  );
}
