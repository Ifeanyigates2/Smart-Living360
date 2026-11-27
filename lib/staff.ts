import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

// Used when the email is unknown, so a failed login takes about as long as a real one.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function verifyStaff(email: string, password: string): Promise<{ id: string; email: string; name: string } | null> {
  const conn = await getDb();
  if (!conn) return null;

  const user = await conn.db.collection("staff").findOne({ email: email.trim().toLowerCase() });
  const ok = await bcrypt.compare(password, (user?.passwordHash as string | undefined) ?? DUMMY_HASH);
  if (!user || !ok || user.active === false) return null;

  return { id: String(user._id), email: String(user.email), name: String(user.name) };
}
