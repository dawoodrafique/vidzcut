# vidzcuts Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portfolio site for video editor Moizza Fatima with hover-play YouTube videos and an admin dashboard, deployable free on Vercel from GitHub.

**Architecture:** One Next.js App Router app. Public single page reads videos/settings from Neon Postgres (falling back to code defaults). `/admin` is a session-protected dashboard using server actions that write to the DB and revalidate the public page.

**Tech Stack:** Next.js (App Router, TS), Tailwind, Drizzle + `@neondatabase/serverless`, `bcryptjs`, `jose`, `nodemailer`, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-06-vidzcuts-portfolio-design.md`

## Global Constraints
- Project/package name `vidzcuts`; editor name **Moizza Fatima**.
- Categories exactly: `motion` ("Motion graphics"), `broll` ("B-roll"), `ads` ("Ads"). Orientation: `vertical` | `landscape`.
- Colors: teal background, gold accent (`--gold: #f9bf4b`, `--teal-900: #0b2a35`). Fonts: Bricolage Grotesque (headings), DM Sans (body).
- Env vars: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`.
- No GitHub pushes by the agent; commits are local only (user pushes to `origin`).
- Videos are YouTube-only; no uploads. About photo is a URL.
- Responsive down to 360px; no horizontal scroll.

## Review Focus
- Garbage / non-YouTube / empty URL pasted in dashboard → rejected with a clear message, nothing saved.
- `DATABASE_URL` missing or DB empty → public site still renders using defaults (no crash).
- Category with zero visible videos → friendly empty state, not a blank grid.
- Wrong password repeatedly → rate-limited; unauthenticated calls to any admin action are refused.
- Contact form: empty fields, 10k-char message, honeypot filled → rejected; form disabled → no endpoint use.

## File Structure
- `src/lib/youtube.ts` — `parseYouTubeId`, `thumbnailUrl`, `embedUrl`
- `src/lib/defaults.ts` — default settings content + `Category` / `Settings` types
- `src/db/schema.ts`, `src/db/index.ts` — Drizzle tables and client
- `src/lib/data.ts` — `getSettings`, `getVideos` (with fallbacks)
- `src/lib/auth.ts` — hashing, session sign/verify, `requireAdmin`, rate limit
- `src/middleware.ts` — protect `/admin/*`
- `src/app/actions/*.ts` — admin server actions (videos, content, account, login)
- `src/app/api/contact/route.ts` — contact email
- `src/components/*` — Nav, Hero, Work, VideoCard, Lightbox, Services, About, Contact, Footer
- `src/app/page.tsx`, `src/app/admin/**` — pages
- `tests/*.test.ts`, `DEPLOY.md`

---

### Task 1: Scaffold project
**Files:** Create Next.js app in `D:\react\vidzcuts` (keep `docs/`), `vitest.config.ts`, `.env.example`, `README.md`; modify `.gitignore`.
**Interfaces:** Produces: `npm run dev|build|test`.

- [ ] **Step 1:** Run `npx create-next-app@latest . --ts --tailwind --app --src-dir --eslint --use-npm --no-turbopack --import-alias "@/*"` (accept existing `docs/`); name the package `vidzcuts`.
- [ ] **Step 2:** `npm i drizzle-orm @neondatabase/serverless bcryptjs jose nodemailer zod` and `npm i -D drizzle-kit vitest @types/bcryptjs @types/nodemailer`; add `"test": "vitest run"` script and `vitest.config.ts` with `@` alias.
- [ ] **Step 3:** Add `.env.example` listing all env vars; `.env*.local` stays gitignored.
- [ ] **Step 4:** Verify `npm run build` passes. Commit locally: `git add -A && git commit -m "chore: scaffold next app"`.

### Task 2: YouTube helpers (TDD)
**Files:** Create `src/lib/youtube.ts`, `tests/youtube.test.ts`.
**Interfaces:** Produces: `parseYouTubeId(input: string): string | null`, `thumbnailUrl(id: string): string` (`https://img.youtube.com/vi/${id}/hqdefault.jpg`), `embedUrl(id: string, opts: {autoplay?: boolean; muted?: boolean; loop?: boolean}): string` (youtube-nocookie, `playsinline=1`, `controls` off when muted, loop uses `playlist=id`).

- [ ] **Step 1:** Write failing tests: `parseYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")`, `youtu.be/dQw4w9WgXcQ?t=5`, `youtube.com/shorts/dQw4w9WgXcQ`, `youtube.com/embed/dQw4w9WgXcQ`, bare 11-char id all → `"dQw4w9WgXcQ"`; `""`, `"hello"`, `"https://vimeo.com/123"`, `"https://evil.com/watch?v=dQw4w9WgXcQ"` → `null`. `embedUrl("abc12345678",{autoplay:true,muted:true,loop:true})` contains `autoplay=1`, `mute=1`, `loop=1`, `playlist=abc12345678`.
- [ ] **Step 2:** Run `npx vitest run tests/youtube.test.ts` → FAIL.
- [ ] **Step 3:** Implement with `URL` parsing, host allowlist (`youtube.com`, `www.`, `m.`, `youtu.be`), id regex `^[A-Za-z0-9_-]{11}$`.
- [ ] **Step 4:** Run tests → PASS. Commit `feat: youtube helpers`.

### Task 3: Defaults, schema, data layer
**Files:** Create `src/lib/defaults.ts`, `src/db/schema.ts`, `src/db/index.ts`, `src/lib/data.ts`, `drizzle.config.ts`, `tests/data.test.ts`.
**Interfaces:** Produces:
- `type Category = "motion"|"broll"|"ads"`; `type Settings = { hero:{headline,subline}; about:{title,body,photoUrl}; services:{title,body,icon}[]; categories:Record<Category,{label,description}>; contact:{email,phone,whatsapp,instagram,formEnabled:boolean} }`; `defaultSettings: Settings` (copy from the screenshots: "Edits that hold attention from the first second.", service cards Cutting and pacing / Captions / Motion graphics and B-roll / Audio cleanup, category descriptions as shown).
- Tables `admins`, `videos` (columns per spec), `settings`.
- `getSettings(): Promise<Settings>` (DB merged over defaults; defaults on any error/missing `DATABASE_URL`), `getVideos(category?: Category, opts?: {includeHidden?: boolean}): Promise<Video[]>` ordered by `sort_order` (returns `[]` on error), `saveSettingsKey(key, value)`.

- [ ] **Step 1:** Failing test: with `DATABASE_URL` unset, `getSettings()` equals `defaultSettings` and `getVideos()` returns `[]`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement; Drizzle neon-http client created lazily only if `DATABASE_URL` set. **Step 4:** Run → PASS.
- [ ] **Step 5:** Add npm script `db:push` (`drizzle-kit push`). Commit `feat: schema and data layer`.

### Task 4: Auth (TDD)
**Files:** Create `src/lib/auth.ts`, `src/middleware.ts`, `tests/auth.test.ts`.
**Interfaces:** Produces: `hashPassword(p: string): Promise<string>`, `verifyPassword(p: string, hash: string): Promise<boolean>`, `signSession(username: string): Promise<string>` (HS256 JWT, 7 days, key `AUTH_SECRET`), `verifySession(token: string): Promise<{username:string}|null>`, `requireAdmin(): Promise<{username:string}>` (reads cookie `vz_session`, throws/redirects to `/admin/login`), `checkRateLimit(key: string, max: number, windowMs: number): boolean`.

- [ ] **Step 1:** Failing tests: hash≠plain and verifies true/false correctly; `verifySession(await signSession("moizza"))` → `{username:"moizza"}`; tampered token → `null`; `checkRateLimit("ip",5,60000)` true five times then false.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement (bcryptjs cost 10; in-memory Map limiter). **Step 4:** Run → PASS.
- [ ] **Step 5:** Middleware: matcher `/admin/:path*`, allow `/admin/login`, redirect others without a valid session cookie. Commit `feat: auth`.

### Task 5: Admin server actions
**Files:** Create `src/app/actions/auth.ts`, `videos.ts`, `content.ts`, `account.ts`; test `tests/actions.test.ts` for validation helpers.
**Interfaces:** Consumes Task 2–4. Produces (all `"use server"`, all but `login` call `requireAdmin()` first, all call `revalidatePath("/")`):
- `login(prev, formData)`: rate-limited by IP; if no admin row exists and creds equal `ADMIN_USERNAME`/`ADMIN_PASSWORD`, create row; verify; set `vz_session` httpOnly, sameSite lax, secure in prod.
- `logout()`.
- `addVideo(prev, formData)` / `updateVideo(id, prev, formData)` / `deleteVideo(id)` / `moveVideo(id, dir:"up"|"down")` / `toggleVideo(id)`: `url` parsed via `parseYouTubeId`, invalid → `{error:"Paste a valid YouTube link"}`.
- `saveContent(prev, formData)` (hero/about/services/categories), `saveContact(prev, formData)`.
- `changeCredentials(prev, formData)`: requires current password; new username ≥3 chars, new password ≥8 chars.

- [ ] **Step 1:** Failing tests for exported zod schemas (`videoSchema`, `credentialsSchema`): invalid URL, short password, username <3 rejected; valid accepted.
- [ ] **Step 2–4:** Run FAIL → implement → PASS. **Step 5:** Commit `feat: admin actions`.

### Task 6: Theme, layout, Nav, Hero
**Files:** Create `src/app/globals.css` (tokens, grain/gradient background), `src/app/layout.tsx` (fonts via `next/font/google`, metadata title "Moizza Fatima — Video Editor"), `src/components/Nav.tsx`, `Hero.tsx`, `TimelineGraphic.tsx`, `src/app/page.tsx` (async, `export const revalidate = 3600`).
**Interfaces:** Produces `<Hero hero={Settings["hero"]}/>`, `<Nav/>` with anchors `#work #services #about #contact` and gold "Get a quote" button → `#contact`.

- [ ] **Step 1:** Implement per screenshot 1 (headline, subline, two CTAs, timeline strip "Raw footage 14:32 / Final edit 8:10" with gold clips, playhead and waveform bars, CSS-animated).
- [ ] **Step 2:** `npm run dev`, load `/` in the browser pane, confirm renders at desktop and 375px. Commit `feat: theme and hero`.

### Task 7: Work section with hover-play
**Files:** Create `src/components/Work.tsx` (client, category tabs), `VideoCard.tsx`, `Lightbox.tsx`.
**Interfaces:** Consumes `getVideos`, `embedUrl`, `thumbnailUrl`. Produces `<Work categories={Settings["categories"]} videos={Video[]}/>`.

- [ ] **Step 1:** Tabs (gold active pill) + category description; grid with 9:16 cards for `vertical`, 16:9 for `landscape`; title/subtitle under card.
- [ ] **Step 2:** `VideoCard`: thumbnail + gold play button; on `mouseenter` (hover-capable devices) render muted autoplay looping iframe after 250ms, remove on `mouseleave`; on touch devices tap opens lightbox. Click opens `Lightbox` (unmuted, autoplay, Esc closes, focus trapped).
- [ ] **Step 3:** Empty-state message when a category has no visible videos.
- [ ] **Step 4:** Insert a test video through DB or temporarily via defaults; verify hover plays, lightbox opens/closes, empty state shows. Commit `feat: work section`.

### Task 8: Services, About, Contact, Footer, contact API
**Files:** Create `Services.tsx` (bento grid, icons scissors/captions/grid/waveform), `About.tsx` (photo or styled placeholder), `Contact.tsx`, `Footer.tsx`, `src/app/api/contact/route.ts`, `tests/contact.test.ts`.
**Interfaces:** Produces `contactSchema` (name 1–100, email valid, message 1–2000, `website` honeypot must be empty) and `POST /api/contact` → `{ok:true}` | `{error:string}` with status 400/429/500.

- [ ] **Step 1:** Failing tests on `contactSchema`: empty name/message, bad email, 10,000-char message, filled honeypot rejected; valid accepted.
- [ ] **Step 2–3:** Run FAIL → implement schema + route (rate limit 3/10min per IP; Nodemailer Gmail SMTP to `contact.email`; 500 with friendly error if env missing; 404-style error if `formEnabled` is false). PASS.
- [ ] **Step 4:** `Contact.tsx`: buttons for email (`mailto:`), call (`tel:`), WhatsApp (`https://wa.me/<digits>`), Instagram; form shown only when `formEnabled`, inline success/error state. Commit `feat: remaining sections and contact`.

### Task 9: Dashboard UI
**Files:** Create `src/app/admin/login/page.tsx`, `admin/layout.tsx` (sidebar: Videos, Content, Contact, Account, Logout), `admin/page.tsx` (Videos), `admin/content/page.tsx`, `admin/contact/page.tsx`, `admin/account/page.tsx`.
**Interfaces:** Consumes Task 5 actions via `useActionState`.

- [ ] **Step 1:** Login page with error state. **Step 2:** Videos page: tabs per category, add form (URL, title, subtitle, orientation, thumbnail preview), list with edit/delete (confirm)/up/down/hide. **Step 3:** Content, Contact (incl. form on/off), Account pages.
- [ ] **Step 4:** In the browser: log in with env creds, add/edit/reorder/delete a video, edit hero text and confirm the public page updates, change password and log in again, confirm `/admin` redirects when logged out. Commit `feat: admin dashboard`.

### Task 10: Deploy docs and final verification
**Files:** Create `DEPLOY.md`; update `README.md`.

- [ ] **Step 1:** `DEPLOY.md`: Neon via Vercel integration, `npm run db:push`, setting env vars, Gmail App Password steps (enable 2-step verification → App passwords), first login, limits (Neon free tier, Gmail ~500/day, Vercel Hobby non-commercial note), custom domain note, and "push to GitHub yourself" instructions.
- [ ] **Step 2:** Run `npm test` (all pass), `npm run lint`, `npm run build` (success).
- [ ] **Step 3:** Browser pass at 1440px and 375px for public site and dashboard; fix issues. Final local commit `docs: deploy guide`.
