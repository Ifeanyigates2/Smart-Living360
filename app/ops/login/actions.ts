"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, MAX_AGE_SECONDS, createSessionToken } from "@/lib/session";
import { verifyStaff } from "@/lib/staff";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const staff = await verifyStaff(email, password);
  if (!staff) return { error: "Email or password is not correct." };

  const token = await createSessionToken(staff.id);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/ops",
    maxAge: MAX_AGE_SECONDS,
  });
  redirect("/ops/inbox");
}
