"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function OpsLoginPage() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <div className="container">
      <div className="auth-shell">
        <form className="auth-card" action={formAction}>
          <p className="eyebrow">Staff</p>
          <h1 className="page-title">Sign in</h1>
          <p className="muted">For the Smart-Living360 team.</p>
          <label className="field">
            Email
            <input type="email" name="email" autoComplete="username" required />
          </label>
          <label className="field">
            Password
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          {state.error && (
            <p className="alert" role="alert">
              {state.error}
            </p>
          )}
          <button className="btn" type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
