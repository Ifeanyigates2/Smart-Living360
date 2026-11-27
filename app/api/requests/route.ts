import { NextResponse } from "next/server";
import { saveRequest } from "@/lib/requests";
import { validateRequest } from "@/lib/request-schema";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const result = validateRequest(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  try {
    const saved = await saveRequest(result.value);
    return NextResponse.json({ id: saved.id, status: saved.status }, { status: 201 });
  } catch (err) {
    console.error("saveRequest failed", err);
    return NextResponse.json({ error: "Could not save the request." }, { status: 500 });
  }
}
