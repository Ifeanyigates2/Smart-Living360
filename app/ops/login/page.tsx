"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function OpsLoginPage() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <>
      <h1 className="page-title">Staff sign in</h1>
      <p className="muted">For Smart-Living360 team members only.</p>
      <form className="request" action={formAction}>
        <label>
          Email
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" autoComplete="current-password" required />
        </label>
        {state.error && <p role="alert" style={{ color: "var(--brand-red)" }}>{state.error}</p>}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </>
  );
}
