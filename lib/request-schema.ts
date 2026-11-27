// Shared by the browser form and the API route. Must not import server-only code (e.g. the database).

export const CATEGORIES = ["Home care", "Repairs", "Build & materials"] as const;
export type Category = (typeof CATEGORIES)[number];

export type RequestInput = {
  category: Category;
  address: string;
  details: string;
  window?: string;
  name: string;
  phone: string;
};

export type ValidationResult =
  | { ok: true; value: RequestInput }
  | { ok: false; errors: Record<string, string> };

const NIGERIAN_PHONE = /^(\+?234|0)[789]\d{9}$/;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function validateRequest(body: unknown): ValidationResult {
  const b = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const category = clean(b.category, 60);
  if (!(CATEGORIES as readonly string[]).includes(category)) {
    errors.category = "Choose a service category.";
  }

  const address = clean(b.address, 200);
  if (address.length < 5) errors.address = "Enter the property address or area.";

  const details = clean(b.details, 2000);
  if (details.length < 10) errors.details = "Describe what you need done (at least 10 characters).";

  const name = clean(b.name, 100);
  if (name.length < 2) errors.name = "Enter your name.";

  const phone = clean(b.phone, 20).replace(/[\s-]/g, "");
  if (!NIGERIAN_PHONE.test(phone)) errors.phone = "Enter a valid Nigerian mobile number.";

  const preferred = clean(b.window, 100) || undefined;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: { category: category as Category, address, details, window: preferred, name, phone },
  };
}
