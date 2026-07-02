# AGENTS.md

## Cursor Cloud specific instructions

### Overview

MindFlow Research is a Next.js 16 (App Router) web app for collecting anonymous ADHD screening responses. It uses Supabase for auth and database. See `README.md` for full feature list and setup instructions.

### Running the app

- `npm run dev` starts the Next.js dev server on port 3000.
- `npm run build` builds for production.
- `npm run lint` runs ESLint (should pass clean).

### Environment variables

The app requires Supabase credentials in `.env.local` (see `.env.example`). Without valid credentials:
- The middleware gracefully skips Supabase session refresh (pages still render).
- API routes (`/api/submit`, `/api/submit/cookies`) and auth flows will fail.
- The questionnaire UI and results analysis are fully functional without Supabase — the results page shows a warning banner but still displays the analysis. Only persisting submissions to the database requires live credentials.

### Gotchas

- Node.js 22.x is required (matches `package.json` engine expectations).
- The Chrome extension (`/extension/`) and Google Ads script (`/google-ads/`) are auxiliary — neither is needed for the core web app dev flow.
- There are no automated tests in this repository.
