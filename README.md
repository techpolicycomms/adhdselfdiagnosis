# MindFlow Research — ADHD Dataset Collection

A privacy-first web app for collecting anonymous ADHD screening responses and optional cookie donations to build a dataset for ML-based ADHD research. **~5 minute flow** with guided extension-based cookie donation.

## Features

- **DIVA-5 / DSM-5 questionnaire** — All 18 ADHD criteria, impairment, and age of onset
- **One-click cookie donation** — Chrome extension reads cookie domain/name patterns (values never sent)
- **User accounts** — Sign in to save your self-assessments and access them anytime
- **Anonymous option** — No sign-up required; contribute without an account
- **Guided flow** — Questionnaire → install extension → donate → done

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown).

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run the migration in `supabase/migrations/001_submissions.sql`
3. In **Authentication → URL Configuration**, add:
   - Site URL: `https://adhdselfdiagnosis.com` (or your domain)
   - Redirect URLs: `https://adhdselfdiagnosis.com/auth/callback`, `http://localhost:3000/auth/callback`
4. Copy from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Extension Setup (for cookie donation)

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select the `extension` folder in this project

The donate page guides users through the full flow.

## Data Storage

Submissions are stored in Supabase. Each row contains:

- `anonymous_id` — Random hex string (no PII)
- `user_id` — Optional; set when user is signed in
- `diva5_responses` — Answers to the 18 DSM-5 criteria (0–4 scale)
- `impairment_domains` — Life areas affected
- `age_of_onset` — Whether symptoms present before age 12
- `cookie_data` — Sanitized cookie metadata (domain/name only, no values)
- `created_at` — Submission time

## Cookie Options

- **Extension (recommended)** — One click; reads patterns directly
- **File upload** — Export via Cookie Editor / EditThisCookie, upload JSON

## Citation

When using questionnaire data, cite:

> American Psychiatric Association. (2013). *Diagnostic and Statistical Manual of Mental Disorders* (5th ed.). DSM-5 ADHD criteria.
> DIVA Foundation. DIVA-5 Diagnostic Interview for ADHD in Adults. https://www.divacenter.eu

## Google Ads

To run a $100 campaign and track donations:

1. Set up conversion tracking (see `google-ads/README.md`)
2. Add `NEXT_PUBLIC_GOOGLE_ADS_ID` and `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` to `.env.local`
3. Run `python google-ads/create_campaign.py -c YOUR_CUSTOMER_ID -u https://yoursite.com/donate`
4. Enable the campaign in Google Ads when ready

Conversions = donations (thank-you page views from ad clicks). Total donations = count of rows in the `submissions` table.

## Disclaimer

This tool is for **research purposes only**. It does not provide diagnosis. The questionnaire identifies individuals who may benefit from further clinical evaluation.
