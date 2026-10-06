# Deploying vidzcuts

Stack: Next.js on **Vercel** (free Hobby plan) + **Neon** Postgres (free tier). Code lives on GitHub; Vercel redeploys on every push.

## 1. Push the code
```bash
git push -u origin main
```

## 2. Create the Vercel project
1. vercel.com → **Add New → Project** → import the GitHub repo `vidzcut`.
2. Framework preset: Next.js (auto-detected). Don't deploy yet.

## 3. Add the database (Neon)
In the Vercel project: **Storage → Create → Neon (Postgres)** → connect it to the project. This adds `DATABASE_URL` automatically. Tables are created automatically on first request, no migration step needed.

## 4. Environment variables
Vercel project → **Settings → Environment Variables** (Production):

| Name | Value |
|---|---|
| `AUTH_SECRET` | long random string, e.g. run `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `ADMIN_USERNAME` | first login username |
| `ADMIN_PASSWORD` | first login password (min 8 chars, make it strong) |
| `GMAIL_USER` | Gmail address that sends and receives messages (optional) |
| `GMAIL_APP_PASSWORD` | Gmail App Password (optional, see below) |

Then **Deploy**.

## 5. First login
Open `https://<your-site>/admin` and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Go to **Account** and set your own username and password. After the first login the database copy is used, and the `ADMIN_*` variables are no longer needed (you can delete them).

Then:
- **Contact** tab: add email, phone, WhatsApp, Instagram.
- **Videos** tab: paste YouTube links per category (Shorts and normal links both work). Choose *Vertical* for reels and *Landscape* for wide videos.
- **Content** tab: edit hero, services, about text.

## Contact form via Gmail (optional)
1. Google Account → Security → turn on **2-Step Verification**.
2. Google Account → Security → **App passwords** → create one named "vidzcuts".
3. Put the 16-character code into `GMAIL_APP_PASSWORD` and the Gmail address into `GMAIL_USER`.
4. Dashboard → **Contact** → tick *Show a contact form*.

Messages arrive in the Contact email (or `GMAIL_USER` if blank). Gmail allows roughly 500 emails/day, far more than needed. If you skip this, leave the form off. Visitors still see the email / phone / WhatsApp buttons.

## Limits and cost
- **Vercel Hobby**: free, but officially for personal / non-commercial use. A paid freelancer's site technically belongs on Pro (about $20/month).
- **Neon free tier**: about 0.5 GB storage; this site uses kilobytes. Projects auto-suspend when idle and wake in about a second.
- **YouTube** hosts the videos, so no storage or bandwidth costs here.

## Local development
```bash
npm install
cp .env.example .env.local   # fill DATABASE_URL etc.
npm run dev
```
Without `DATABASE_URL`, `npm run dev` shows placeholder sample videos so you can preview the layout; the dashboard needs a database to sign in.

Other commands: `npm test`, `npm run lint`, `npm run build`.
