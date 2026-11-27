"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/request-schema";

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <div className="container page">
          <p className="muted">Loading…</p>
        </div>
      }
    >
      <RequestForm />
    </Suspense>
  );
}

function RequestForm() {
  const params = useSearchParams();
  const raw = params.get("category") ?? "";
  const preset = (CATEGORIES as readonly string[]).includes(raw) ? raw : "";
  const cleaning = preset === "Home care";

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestId, setRequestId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setErrors({});
    setSubmitting(true);

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.status === 201) {
        setRequestId(json.id);
      } else if (res.status === 422) {
        setErrors(json.errors ?? {});
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Network problem. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (requestId) {
    return (
      <div className="container page">
        <div className="confirm">
          <p className="eyebrow">Request received</p>
          <h1 className="page-title">Thank you. Your request is in.</h1>
          <p className="lead">
            Our team will review it and send you a written quote. Payment starts only after you
            approve that quote.
          </p>
          <p className="ref">
            Reference <strong>{requestId}</strong>
          </p>
          <Link href="/" className="btn btn-outline">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="split">
        <div>
          <p className="eyebrow">{cleaning ? "Cleaning" : "New request"}</p>
          <h1 className="page-title">{cleaning ? "Request cleaning" : "Request a service"}</h1>
          <p className="lead">
            {cleaning
              ? "Tell us the rooms and how often. We reply with a written quote before the visit is booked."
              : "Tell us what you need. We will reply with a written quote before anything is booked."}
          </p>
          <form className="request form-card" onSubmit={onSubmit} noValidate>
            <Field label="Service category" name="category" error={errors.category}>
              <select name="category" defaultValue={preset}>
                <option value="" disabled>
                  Choose one
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "Home care" ? "Cleaning" : c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Property address or area" name="address" error={errors.address}>
              <input type="text" name="address" autoComplete="street-address" />
            </Field>
            <Field label="What do you need done?" name="details" error={errors.details}>
              <textarea name="details" />
            </Field>
            <Field label="Preferred time" name="window" error={errors.window}>
              <input type="text" name="window" placeholder="e.g. weekday mornings" />
            </Field>
            <Field label="Your name" name="name" error={errors.name}>
              <input type="text" name="name" autoComplete="name" />
            </Field>
            <Field label="Phone number" name="phone" error={errors.phone}>
              <input type="tel" name="phone" autoComplete="tel" placeholder="080 1234 5678" />
            </Field>
            {serverError && (
              <p className="alert" role="alert">
                {serverError}
              </p>
            )}
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send request"}
            </button>
          </form>
        </div>
        <aside className="aside">
          <h2>What happens next</h2>
          <ol>
            <li>{cleaning ? "We match the clean to a verified cleaner." : "We read the request and match it to a provider."}</li>
            <li>You get a written quote. Payment waits until you approve it.</li>
            <li>After you approve, the job is booked and you can follow it.</li>
          </ol>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={error ? "field field-invalid" : "field"}>
      <span>{label}</span>
      {children}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
