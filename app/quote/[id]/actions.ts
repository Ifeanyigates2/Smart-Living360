"use server";

import { redirect } from "next/navigation";
import { respondToQuote } from "@/lib/quotes";

export async function approveQuoteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await respondToQuote(id, "approved");
  redirect(`/quote/${id}`);
}

export async function declineQuoteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await respondToQuote(id, "declined");
  redirect(`/quote/${id}`);
}
