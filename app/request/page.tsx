"use client";

import { useState, type FormEvent } from "react";
import { CATEGORIES } from "@/lib/request-schema";

export default function RequestPage() {
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
      <>
        <h1>Thank you. Your request is in.</h1>
        <p className="lead">
          Reference <strong>{requestId}</strong>. Our team will review it and send you a written
          quote. No payment is taken yet.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Request a service</h1>
      <p className="lead">Tell us what you need. We will reply with a written quote before anything is booked.</p>
      <form className="request" onSubmit={onSubmit} noValidate>
        <Field label="Service category" name="category" error={errors.category}>
          <select name="category" defaultValue="">
            <option value="" disabled>Choose one</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Property address or area" name="address" error={errors.address}>
          <input type="text" name="address" />
        </Field>
        <Field label="What do you need done?" name="details" error={errors.details}>
          <textarea name="details" />
        </Field>
        <Field label="Preferred time" name="window" error={errors.window}>
          <input type="text" name="window" placeholder="e.g. weekday mornings" />
        </Field>
        <Field label="Your name" name="name" error={errors.name}>
          <input type="text" name="name" />
        </Field>
        <Field label="Phone number" name="phone" error={errors.phone}>
          <input type="tel" name="phone" placeholder="080 1234 5678" />
        </Field>
        {serverError && <p role="alert">{serverError}</p>}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send request"}
        </button>
      </form>
    </>
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
    <label>
      {label}
      {children}
      {error && <span role="alert" style={{ color: "var(--brand-red)", fontWeight: 400 }}>{error}</span>}
    </label>
  );
}
