# Lucas & Ava — Flashcard App 🃏

A private flashcard study app for Lucas and Ava. Built with Next.js and Google OAuth — only the two of them can log in.

## What it does

- **Flashcard review** across 4 course categories with flip animation
- **Spaced repetition rating** — mark each card as 😓 Again / 🤔 Hard / ✅ Easy
- **Filter by course** — study all cards or focus on one category
- **Session stats** — track your Easy, Hard, and Review counts per session
- **Keyboard shortcuts** — Space/Enter to flip, 1/2/3 to rate, → to skip
- **Google OAuth** — only `aungkomyat.lucas@gmail.com` and `ava.khinyadanarkyaw@gmail.com` can sign in

## Flashcard categories

| Course | Cards |
|---|---|
| Google Data Analytics | 6 |
| IBM Data Analyst | 5 |
| Python for Everybody | 6 |
| General Knowledge | 12 |

## Tech stack

- **Next.js 14** (Pages Router, TypeScript)
- **NextAuth.js** — Google OAuth with email allowlist
- **Vercel** — hosting and deployment
- **Google Calendar** — study sessions scheduled for both accounts

## Project structure

```
flashcard-app/
├── pages/
│   ├── index.tsx              ← main flashcard app (protected)
│   ├── login.tsx              ← Google sign-in page
│   ├── unauthorized.tsx       ← shown for non-allowed emails
│   ├── _app.tsx               ← session provider
│   └── api/
│       └── auth/
│           └── [...nextauth].ts  ← Google OAuth handler
├── styles/
│   └── globals.css
├── .env.example               ← env template (safe to commit)
├── .gitignore
└── README.md
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | From Google Cloud Console → OAuth 2.0 Client IDs |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console → OAuth 2.0 Client IDs |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, your Vercel URL in production |
| `ALLOWED_EMAILS` | Comma-separated list of allowed Gmail addresses |

## Local development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in Vercel's dashboard
4. Set `NEXTAUTH_URL` to your production URL (e.g. `https://flashcard-app.vercel.app`)
5. Add the production redirect URI in Google Cloud Console:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

## Setting up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web application
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google`
5. Copy the Client ID and Client Secret into your `.env.local`

## Study schedule

Lucas and Ava study every weekday 5:00–7:00 PM (Asia/Bangkok):

| Day | Course |
|---|---|
| Monday | Google Data Analytics |
| Tuesday | IBM Data Analyst |
| Wednesday | Python for Everybody |
| Thursday | Google Data Analytics |
| Friday | Python for Everybody |

Sessions run from **24 March → 23 May 2026** and are synced to both Google Calendars.

## Notion workspace

Study notes, session tracker, and resources are organized at:
[Lucas & Ava — Study Space](https://www.notion.so/32b84e28f2b78164b39de77b607db149)
