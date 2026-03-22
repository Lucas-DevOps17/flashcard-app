# Flashcard Study App 🃏

A private, authenticated flashcard web app built with Next.js and Google OAuth. Only authorized users can sign in and access the flashcard deck.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

## Features

- **Flashcard review** across multiple subject categories with a smooth flip animation
- **Spaced repetition rating** — mark each card as 😓 Again / 🤔 Hard / ✅ Easy
- **Filter by category** — study all cards or focus on a specific subject
- **Session stats** — track Easy, Hard, and Review counts per session
- **Keyboard shortcuts** — `Space` / `Enter` to flip, `1` / `2` / `3` to rate, `→` to skip
- **Google OAuth** — private access with an email allowlist via NextAuth.js

## Tech Stack

- [Next.js 14](https://nextjs.org/) — React framework with Pages Router
- [NextAuth.js](https://next-auth.js.org/) — Google OAuth authentication with email allowlist
- [TypeScript](https://www.typescriptlang.org/) — type-safe throughout
- [Vercel](https://vercel.com/) — hosting and CI/CD

## Project Structure

```
flashcard-app/
├── pages/
│   ├── index.tsx              # Main flashcard app (protected route)
│   ├── login.tsx              # Google sign-in page
│   ├── unauthorized.tsx       # Shown for non-allowed emails
│   ├── _app.tsx               # NextAuth session provider
│   └── api/
│       └── auth/
│           └── [...nextauth].ts  # Google OAuth handler
├── styles/
│   └── globals.css
├── .env.example               # Environment variable template
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials

### Installation

```bash
git clone https://github.com/your-username/flashcard-app.git
cd flashcard-app
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `ALLOWED_EMAILS` | Comma-separated list of Gmail addresses allowed to sign in |

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** → Web application
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-app.vercel.app/api/auth/callback/google` (production)
4. Copy the Client ID and Client Secret into your `.env.local`

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push your repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Update `NEXTAUTH_URL` to your production URL
5. Add the production redirect URI to your Google Cloud OAuth app

## Flashcard Categories

The app ships with built-in starter cards across four categories:

| Category | Description |
|---|---|
| Google Data Analytics | Data analysis process, metrics, bias, integrity |
| IBM Data Analyst | SQL, ETL, joins, keys, analyst vs scientist |
| Python for Everybody | Lists, loops, dictionaries, pandas, imports |
| General Knowledge | APIs, cloud, version control, Big O, CPU, OSS |

## How It Works

- Only emails listed in `ALLOWED_EMAILS` can sign in via Google
- All other Google accounts are redirected to an unauthorized page
- Cards are rated per session — "Again" cards re-enter the queue
- Sessions reset on page refresh (no backend persistence by design)

## License

MIT
