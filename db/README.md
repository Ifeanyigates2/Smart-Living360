# Database (MongoDB)

Collections created automatically on first connection by `lib/db.ts`:

- `customers`: unique on `phone`. Name, verified_at, created_at.
- `requests`: `_id` is the request reference (e.g. REQ-...). Indexed on status and createdAt.
- `service_categories`: unique on `name`. Seeded with the three V1 categories.
- `audit_logs`: every status change and money movement. Indexed on entityId and createdAt.

Money-related writes (payments, ledger entries, refunds) must run inside a transaction,
as `saveRequest` does. This needs a replica set (MongoDB Atlas is one by default).

`db/schema.sql` is from the PostgreSQL plan and is no longer used. Delete it.
