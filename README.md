# Lucas & Ava — Flashcard App 🃏

Private study flashcard app with Google OAuth. Only Lucas & Ava can log in.

## Tech Stack
- **Next.js 14** — React framework
- **NextAuth.js** — Google OAuth authentication
- **Vercel** — hosting
- **Anthropic Claude API** — AI flashcard generation from notes

---

## Step-by-Step Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://your-app.vercel.app/api/auth/callback/google` (for production — add AFTER deploying)
7. Copy the **Client ID** and **Client Secret**

### 3. Generate a NextAuth secret
```bash
openssl rand -base64 32
```
Copy the output — this is your `NEXTAUTH_SECRET`.

### 4. Get your Gemini API key
Go to https://aistudio.google.com/  → Get API Keys → Create Key.

### 5. Fill in .env.local
Copy `.env.example` to `.env.local` and fill in all values:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
GOOGLE_CLIENT_ID=<your client id>
GOOGLE_CLIENT_SECRET=<your client secret>
NEXTAUTH_SECRET=<generated secret>
NEXTAUTH_URL=http://localhost:3000
ALLOWED_EMAILS=example1@gmail.com,example2@gmail.com
ANTHROPIC_API_KEY=<your api key>
```

### 6. Run locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashcard-app.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Add all environment variables from `.env.local` in Vercel's dashboard
4. Change `NEXTAUTH_URL` to `https://your-app.vercel.app`
5. Deploy!

### 3. Update Google OAuth redirect URI
After deploying, go back to Google Cloud Console and add:
```
https://your-app.vercel.app/api/auth/callback/google
```

---

## How It Works

- **Login page** — Sign in with Google (only whitelisted emails work)
- **Flashcards** — 17 built-in starter cards across all 3 courses
- **Filter** — by course (GDA, IBM, Python, or all)
- **Rating** — 😓 Again (repeats) / 🤔 Hard / ✅ Easy
- **AI Generate** — paste Notion notes → Claude generates 5 new cards
- **Keyboard** — Space/Enter to flip, 1/2/3 to rate, → to skip

## Project Structure
```
flashcard-app/
├── pages/
│   ├── index.tsx              ← main flashcard app (protected)
│   ├── login.tsx              ← Google sign-in page
│   ├── unauthorized.tsx       ← shown for non-allowed emails
│   ├── _app.tsx               ← session provider
│   └── api/
│       ├── auth/
│       │   └── [...nextauth].ts  ← Google OAuth handler
│       └── generate-cards.ts     ← AI card generation API
├── styles/
│   └── globals.css
├── .env.local                 ← your secrets (never commit this!)
├── .env.example               ← template (safe to commit)
└── .gitignore
```
