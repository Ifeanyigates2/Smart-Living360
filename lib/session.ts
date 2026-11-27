// Signed staff session cookie. Uses Web Crypto only, so it also runs in Next.js middleware.

export const COOKIE_NAME = "sl360_staff";
export const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const enc = new TextEncoder();
function utf8(s: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(enc.encode(s));
}
const dec = new TextDecoder();

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to at least 32 characters in production.");
  }
  return "development-only-secret-do-not-use-in-production";
}

function toB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=");
  const bin = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", utf8(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSessionToken(staffId: string): Promise<string> {
  const payload = toB64url(utf8(JSON.stringify({ sub: staffId, exp: Date.now() + MAX_AGE_SECONDS * 1000 })));
  const sig = await crypto.subtle.sign("HMAC", await key(), utf8(payload));
  return `${payload}.${toB64url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<{ sub: string } | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const ok = await crypto.subtle.verify("HMAC", await key(), fromB64url(sig), utf8(payload));
  if (!ok) return null;
  const data = JSON.parse(dec.decode(fromB64url(payload))) as { sub: string; exp: number };
  if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
  return { sub: data.sub };
}
