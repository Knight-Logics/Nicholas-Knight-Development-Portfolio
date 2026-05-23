-- Knight Logics Referral CRM Schema
-- Run once in your Neon project console (SQL Editor tab)
-- https://console.neon.tech → your project → SQL Editor

CREATE TABLE IF NOT EXISTS kl_referral_events (
    id             BIGSERIAL PRIMARY KEY,
    event_type     VARCHAR(40)  NOT NULL,   -- pageview | form_submit | checkout_start | payment_completed
    referral_partner VARCHAR(80),           -- ?ref= value  (e.g. "signshop-safety-harbor")
    referral_offer   VARCHAR(80),           -- ?offer= value (e.g. "SUMMER25")
    utm_medium       VARCHAR(80),
    utm_campaign     VARCHAR(80),
    first_url        TEXT,                  -- full URL of first attributed landing
    page_path        VARCHAR(300),          -- pathname at time of event
    contact_email    VARCHAR(160),          -- from form/checkout when available
    contact_name     VARCHAR(120),
    package_name     VARCHAR(120),          -- for checkout_start events
    amount_cents     INTEGER,               -- price in cents for checkout_start
    event_source     VARCHAR(40),           -- starter_package | invoice_payment | formspree | website
    external_event_id VARCHAR(160),         -- Stripe session ID or other external dedupe key
    session_id       VARCHAR(64),           -- client-generated random ID (for dedup)
    ip_hash          VARCHAR(64),           -- SHA-256 of IP (privacy-safe)
    user_agent_short VARCHAR(120),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kl_referral_events ADD COLUMN IF NOT EXISTS event_source VARCHAR(40);
ALTER TABLE kl_referral_events ADD COLUMN IF NOT EXISTS external_event_id VARCHAR(160);

CREATE INDEX IF NOT EXISTS idx_klre_partner  ON kl_referral_events (referral_partner);
CREATE INDEX IF NOT EXISTS idx_klre_offer    ON kl_referral_events (referral_offer);
CREATE INDEX IF NOT EXISTS idx_klre_type     ON kl_referral_events (event_type);
CREATE INDEX IF NOT EXISTS idx_klre_created  ON kl_referral_events (created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_klre_external_event_id ON kl_referral_events (external_event_id);

CREATE TABLE IF NOT EXISTS kl_referral_partner_terms (
    partner_slug        VARCHAR(80) PRIMARY KEY,
    partner_name        VARCHAR(120),
    commission_percent  NUMERIC(6,3) NOT NULL DEFAULT 0,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kl_referral_payouts (
    id                      BIGSERIAL PRIMARY KEY,
    referral_event_id       BIGINT NOT NULL UNIQUE REFERENCES kl_referral_events(id) ON DELETE CASCADE,
    partner_slug            VARCHAR(80) NOT NULL,
    gross_amount_cents      INTEGER NOT NULL,
    commission_percent      NUMERIC(6,3) NOT NULL,
    commission_amount_cents INTEGER NOT NULL,
    payout_status           VARCHAR(20) NOT NULL DEFAULT 'owed',
    paid_at                 TIMESTAMPTZ,
    payout_note             TEXT,
    payout_method           VARCHAR(40),
    payout_reference        VARCHAR(120),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE kl_referral_payouts ADD COLUMN IF NOT EXISTS payout_method VARCHAR(40);
ALTER TABLE kl_referral_payouts ADD COLUMN IF NOT EXISTS payout_reference VARCHAR(120);

CREATE INDEX IF NOT EXISTS idx_klrp_partner_status ON kl_referral_payouts (partner_slug, payout_status);
CREATE INDEX IF NOT EXISTS idx_klrp_created ON kl_referral_payouts (created_at DESC);
