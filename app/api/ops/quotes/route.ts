import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";
import { createQuote, validateQuoteInput } from "@/lib/quotes";

// Staff only. The middleware also blocks /api/ops without a session; this checks again.
export async function POST(req: Request) {
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const input = validateQuoteInput(body);
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 422 });

  const result = await createQuote(input.value, session.sub);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });

  return NextResponse.json(
    { link: `/quote/${result.value.token}`, total: result.value.total },
    { status: 201 },
  );
}
