-- ColdCompare core schema (PostgreSQL 14+ / Supabase)
-- Design: stable, query-relevant attributes live in typed columns; evolving product
-- specifications live in a validated JSONB document (validated by zod in src/lib/schemas.ts).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Editorial: people
-- ---------------------------------------------------------------------------
CREATE TABLE authors (
  id            TEXT PRIMARY KEY,                 -- slug, e.g. "editorial-team"
  name          TEXT NOT NULL,
  role          JSONB NOT NULL DEFAULT '{}',       -- {"en": "...", "de": "..."}
  bio           JSONB NOT NULL DEFAULT '{}',       -- {"en": "...", "de": "..."}
  avatar_url    TEXT,
  links         JSONB NOT NULL DEFAULT '[]',       -- [{"label","url"}]
  is_placeholder BOOLEAN NOT NULL DEFAULT FALSE,   -- true until a real, named person replaces it
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Product database
-- ---------------------------------------------------------------------------
CREATE TABLE manufacturers (
  slug          TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  hq_country    TEXT NOT NULL,                     -- ISO 3166-1 alpha-2
  website       TEXT NOT NULL,
  description   JSONB NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');

CREATE TABLE products (
  slug              TEXT PRIMARY KEY,
  manufacturer_slug TEXT NOT NULL REFERENCES manufacturers(slug) ON UPDATE CASCADE,
  model             TEXT NOT NULL,
  status            content_status NOT NULL DEFAULT 'draft',
  data              JSONB NOT NULL,                -- ProductData (see src/lib/schemas.ts)
  last_verified_at  DATE,                          -- last date an editor checked specs against primary sources
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX products_status_idx ON products(status);
CREATE INDEX products_manufacturer_idx ON products(manufacturer_slug);

-- ---------------------------------------------------------------------------
-- Affiliate infrastructure
-- ---------------------------------------------------------------------------
CREATE TYPE link_status AS ENUM ('active', 'placeholder', 'paused');

CREATE TABLE affiliate_links (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug   TEXT NOT NULL REFERENCES products(slug) ON UPDATE CASCADE ON DELETE CASCADE,
  country        TEXT NOT NULL DEFAULT '*',        -- 'GB', 'DE', ... or '*' for fallback
  retailer       TEXT NOT NULL,                    -- e.g. "Official store"
  is_official    BOOLEAN NOT NULL DEFAULT TRUE,    -- manufacturer store vs authorised reseller
  network        TEXT NOT NULL DEFAULT 'none',     -- 'none','direct','awin','impact','partnerize','cj',...
  url            TEXT NOT NULL,
  is_affiliate   BOOLEAN NOT NULL DEFAULT FALSE,   -- only TRUE once a real agreement exists
  status         link_status NOT NULL DEFAULT 'placeholder',
  add_utm        BOOLEAN NOT NULL DEFAULT FALSE,
  priority       INTEGER NOT NULL DEFAULT 0,       -- higher wins within the same country
  commission_note TEXT,                            -- internal only; NEVER used for ranking
  last_checked_at TIMESTAMPTZ,
  last_status_code INTEGER,
  last_check_error TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX affiliate_links_product_idx ON affiliate_links(product_slug, country);

-- Outbound clicks. No IP addresses, no cookies identifiers, no user agents stored (GDPR data minimisation).
CREATE TABLE outbound_clicks (
  id            BIGSERIAL PRIMARY KEY,
  clicked_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_slug  TEXT NOT NULL,
  link_id       UUID REFERENCES affiliate_links(id) ON DELETE SET NULL,
  country       TEXT,
  locale        TEXT,
  page_path     TEXT,
  placement     TEXT,                              -- 'review-hero','compare-table','quiz',...
  device        TEXT,                              -- 'mobile' | 'desktop'
  is_affiliate  BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX outbound_clicks_time_idx ON outbound_clicks(clicked_at);
CREATE INDEX outbound_clicks_product_idx ON outbound_clicks(product_slug, clicked_at);

-- Conversions / revenue as reported by affiliate networks (manual entry or CSV import).
CREATE TABLE revenue_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  network       TEXT NOT NULL,
  product_slug  TEXT,
  country       TEXT,
  orders        INTEGER NOT NULL DEFAULT 0,
  revenue       NUMERIC(12,2) NOT NULL DEFAULT 0, -- commission earned
  currency      TEXT NOT NULL DEFAULT 'EUR',
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Editorial content (reviews, comparisons, guides, academy, legal pages)
-- ---------------------------------------------------------------------------
CREATE TYPE article_type AS ENUM ('review', 'comparison', 'guide', 'learn', 'page');

CREATE TABLE articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type             article_type NOT NULL,
  locale           TEXT NOT NULL CHECK (locale IN ('en', 'de')),
  slug             TEXT NOT NULL,
  translation_key  TEXT NOT NULL,                  -- groups translations of the same piece
  title            TEXT NOT NULL,
  meta_title       TEXT,
  meta_description TEXT,
  excerpt          TEXT,
  body             TEXT NOT NULL DEFAULT '',       -- Markdown + [[shortcodes]]
  status           content_status NOT NULL DEFAULT 'draft',
  author_id        TEXT REFERENCES authors(id) ON DELETE SET NULL,
  product_slugs    TEXT[] NOT NULL DEFAULT '{}',   -- review: [product]; comparison: [a, b]; guide: ranked picks
  data             JSONB NOT NULL DEFAULT '{}',    -- {faqs:[{q,a}], picks:[{product,label}], sources:[{label,url}], verdict, ...}
  published_at     TIMESTAMPTZ,
  reviewed_at      DATE,                           -- last editorial fact-check
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (type, locale, slug),
  UNIQUE (translation_key, locale)
);
CREATE INDEX articles_status_idx ON articles(type, locale, status);

-- ---------------------------------------------------------------------------
-- Administration
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'writer', 'analyst');

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  role            user_role NOT NULL DEFAULT 'writer',
  password_hash   TEXT NOT NULL,                   -- scrypt$N$r$p$salt$hash
  session_version INTEGER NOT NULL DEFAULT 1,      -- bump to revoke all sessions
  disabled        BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id          BIGSERIAL PRIMARY KEY,
  at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email  TEXT,
  action      TEXT NOT NULL,                       -- 'product.update', 'article.publish', ...
  entity      TEXT NOT NULL,
  entity_id   TEXT NOT NULL,
  detail      JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX audit_log_entity_idx ON audit_log(entity, entity_id);

CREATE TABLE settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Growth
-- ---------------------------------------------------------------------------
CREATE TABLE newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  locale        TEXT NOT NULL DEFAULT 'en',
  confirm_token TEXT NOT NULL,
  confirmed_at  TIMESTAMPTZ,                       -- double opt-in (required in Germany)
  unsubscribed_at TIMESTAMPTZ,
  consent_text  TEXT NOT NULL,                     -- exact consent wording shown at signup
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Imported search/analytics metrics (Google Search Console / GA4 / privacy analytics CSV exports).
CREATE TABLE traffic_metrics (
  id          BIGSERIAL PRIMARY KEY,
  day         DATE NOT NULL,
  source      TEXT NOT NULL,                       -- 'gsc' | 'ga4' | 'plausible' | 'manual'
  page_path   TEXT NOT NULL DEFAULT '*',
  query       TEXT NOT NULL DEFAULT '',            -- GSC query ('' = page-level aggregate)
  sessions    INTEGER,
  impressions INTEGER,
  clicks      INTEGER,
  position    NUMERIC(6,2),
  UNIQUE (day, source, page_path, query)
);
CREATE INDEX traffic_metrics_day_idx ON traffic_metrics(day);
