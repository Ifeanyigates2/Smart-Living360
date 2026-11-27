// Create a staff login. Usage:
//   read -s STAFF_PASSWORD && export STAFF_PASSWORD
//   node scripts/create-staff.mjs admin@example.com "Full Name"
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const [email, name] = process.argv.slice(2);
const password = process.env.STAFF_PASSWORD ?? "";
const uri = process.env.MONGODB_URI;

if (!email || !name || password.length < 12 || !uri) {
  console.error("Need email, name, STAFF_PASSWORD (12+ chars) and MONGODB_URI.");
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
try {
  const db = client.db(process.env.MONGODB_DB ?? "smartliving360");
  await db.collection("staff").createIndex({ email: 1 }, { unique: true });
  await db.collection("staff").insertOne({
    email: email.trim().toLowerCase(),
    name,
    passwordHash: await bcrypt.hash(password, 12),
    active: true,
    createdAt: new Date(),
  });
  console.log(`Staff user created: ${email}`);
} finally {
  await client.close();
}
