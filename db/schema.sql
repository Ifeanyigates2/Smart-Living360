-- Smart-Living360 V1 schema (subset: customers, requests, categories, audit log).
-- Source: claude/smartliving360-v1-spec.md, section 5. Extend in later migrations.

CREATE TABLE IF NOT EXISTS service_categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  service_area TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO service_categories (name, service_area) VALUES
  ('Home care', 'A'),
  ('Repairs', 'B'),
  ('Build & materials', 'C')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS customers (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL UNIQUE,
  email       TEXT,
  verified_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS requests (
  id              TEXT PRIMARY KEY,
  customer_id     INTEGER REFERENCES customers(id),
  category_id     INTEGER REFERENCES service_categories(id),
  address         TEXT NOT NULL,
  details         TEXT NOT NULL,
  preferred_window TEXT,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'submitted'
                  CHECK (status IN ('submitted','triaged','matched','quoted','quote_approved',
                                    'paid','scheduled','in_progress','completed_pending_review',
                                    'completed','closed','declined','cancelled','disputed',
                                    'refund_pending','refunded')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS requests_status_created_idx ON requests (status, created_at);

CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  actor_id    TEXT,
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   TEXT NOT NULL,
  before      JSONB,
  after       JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
