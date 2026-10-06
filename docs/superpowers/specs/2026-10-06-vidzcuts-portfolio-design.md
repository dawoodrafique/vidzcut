# vidzcuts — Portfolio Site for Moizza Fatima (Design Spec)

Date: 2026-10-06

## Goal
A professional portfolio website for **Moizza Fatima**, a video editor (project/folder name: **vidzcuts**), with an admin dashboard so she can manage everything without code. Low traffic; must run at no cost. Deployed from GitHub to Vercel.

## Stack
- Next.js (App Router, TypeScript), Tailwind CSS
- Neon Postgres via Drizzle ORM (Vercel integration)
- Auth: bcrypt + signed httpOnly JWT cookie (`jose`), middleware-protected `/admin`
- Email: Nodemailer with Gmail App Password
- Tests: Vitest (YouTube URL parser, auth helpers)
- Hosting: GitHub -> Vercel (Hobby is free; note it is officially non-commercial, Pro ~$20/mo if she wants to be strictly compliant)

## Public site (single page)
Sections: Nav, Hero, Work, Services, About, Contact, Footer. All content read from the DB; saving in the dashboard revalidates the page immediately.

- **Hero:** headline, subline, CTAs, animated timeline/waveform graphic (SVG + CSS).
- **Work:** tabs Motion graphics / B-roll / Ads, each with a short description and a grid of videos. Vertical items use 9:16 cards, landscape use 16:9.
  - Thumbnail from `img.youtube.com`.
  - Desktop hover: muted looping YouTube embed plays in the card. Mobile: tap to play.
  - Click opens a lightbox with sound.
- **Services:** bento cards (cutting & pacing, captions, motion graphics & B-roll, audio cleanup), editable.
- **About:** text + photo (styled placeholder until a photo URL is set).
- **Contact:** email, phone, WhatsApp (`wa.me`), Instagram buttons. Optional contact form (toggle) sending to her Gmail; honeypot + rate limit.
- **Look:** deep teal background, gold accent, editing-timeline motif; Bricolage Grotesque + DM Sans; no stock photos; responsive down to phone width.

## Data model
- `admins(id, username, password_hash)`
- `videos(id, category enum[motion|broll|ads], youtube_id, title, subtitle, orientation enum[vertical|landscape], sort_order, visible, created_at)`
- `settings(key, value jsonb)` — keys: `hero`, `about`, `services`, `categories` (descriptions), `contact` (email, phone, whatsapp, instagram, formEnabled)
- Defaults seeded from code on first request so the site is complete on day one.

## Dashboard (`/admin`)
- **Login:** first login uses `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars to create the admin row; afterwards the DB row is authoritative.
- **Videos:** add (paste any YouTube link incl. Shorts / watch / youtu.be), edit, delete, reorder, hide, per category; orientation selectable.
- **Content:** edit hero, about, services, category descriptions.
- **Contact settings:** email, phone, WhatsApp, Instagram, form on/off.
- **Account:** change username and password (requires current password).
- **Security:** bcrypt hashes, login rate limit, SameSite cookie, all `/admin` routes and mutation endpoints require a valid session.

## Contact form
POST `/api/contact` -> validates, honeypot check, per-IP rate limit, sends via Gmail SMTP (`GMAIL_USER`, `GMAIL_APP_PASSWORD`; requires 2-step verification on the account). If the form is disabled, only direct-contact buttons show.

## Deployment
Push to GitHub, import into Vercel, add Neon integration. Env vars: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`. A `DEPLOY.md` documents the steps, limits (Neon free tier, Gmail ~500/day, Vercel Hobby terms).

## Verification
Vitest unit tests for the YouTube parser and auth helpers; manual browser check of the public site and dashboard at desktop and mobile widths; production build passes.

## Out of scope
Multiple admin users, analytics, blog, video uploads (videos live on YouTube), image upload (about photo is a URL).
