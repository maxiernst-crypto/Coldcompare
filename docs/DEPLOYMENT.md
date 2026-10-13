# Deployment (Vercel + Supabase)

1. **Database.** Create a Supabase project (EU region recommended for GDPR — e.g. Frankfurt). Copy the connection strings (Project Settings → Database). Use the **pooled (transaction) URL** for `DATABASE_URL` on Vercel.
2. **Migrate & seed** from your machine:
   ```bash
   DATABASE_URL="postgres://…" ADMIN_EMAIL=you@domain ADMIN_PASSWORD='long-unique-password' npm run db:setup
   ```
3. **Vercel project.** Import the repository. Set environment variables (Production *and* Preview):
   | Variable | Production | Preview |
   |---|---|---|
   | `DATABASE_URL` | Supabase pooled URL | separate staging DB recommended |
   | `AUTH_SECRET` | `openssl rand -base64 48` | different value |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.yourdomain.com` | preview URL |
   | `CONTENT_PREVIEW` | `false` | `true` (preview is noindexed automatically) |
   | `CRON_SECRET` | random string | — |
   | `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_GSC_VERIFICATION` | optional | leave empty |
   | `RESEND_API_KEY`, `NEWSLETTER_FROM` | optional (double opt-in emails) | — |
4. **Build** runs against the database (static generation). Deploy.
5. **Cron.** `vercel.json` schedules `/api/cron/link-health` daily (link checks + click-retention purge). Vercel sends `Authorization: Bearer $CRON_SECRET`.
6. **Domain & Search Console.** Add the domain, verify it in Google Search Console (HTML tag via `NEXT_PUBLIC_GSC_VERIFICATION` or DNS), submit `/sitemap.xml`. Set up Bing Webmaster Tools too.
7. **Before going public:** complete the dashboard's "Before launch" list (legal details, contact email, real authors), have the legal pages reviewed by a lawyer, then fact-check and publish content item by item.

Other hosts: any Node 22 host works (`npm run build && npm start`); schedule the cron URL with your platform's scheduler.

## Backups

Enable Supabase point-in-time recovery or daily backups. The `content/` seed is a starting point only — the database is the source of truth after launch.
