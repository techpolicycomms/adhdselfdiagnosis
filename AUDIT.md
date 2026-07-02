# MindFlow Research — Codebase Audit & Revision Plan

*Audit date: July 2026 · Scope: all 31 source files, extension, config, migration*

---

## Executive Summary

The app is a functional Next.js 16 + Supabase ADHD screening flow. The largest risks are **unauthenticated API writes via service role**, **anonymous cookie updates gated only by guessable `anonymousId`**, **dead/duplicated files**, and **missing server-side validation**. The cookie donation flow was recently improved (paste/upload options) but the overall architecture has accumulated tech debt.

---

## 1. Dead Code — Remove or Wire Up

| File | Status | Action |
|------|--------|--------|
| `src/lib/diva5-questions.ts` (164 lines) | Never imported | Delete — `adhd-questions.ts` is the active source |
| `src/lib/asrs-questions.ts` (44 lines) | Never imported | Delete — API accepts `asrsResponses` but no UI sends it |
| `src/components/AccountLink.tsx` | Never imported | Delete — superseded by `ClientAccountLink.tsx` |
| `src/components/GoogleTag.tsx` | Never imported | Wire into layout or delete |
| `src/components/ConversionTracker.tsx` | Never imported | Wire into done step or delete |
| `public/next.svg, vercel.svg, globe.svg, window.svg, file.svg` | Default Next.js assets | Delete all |

**Impact:** ~250 lines of dead code removed, cleaner dependency tree.

---

## 2. Security Issues

### 2.1 API Route Validation (Critical)

**`/api/submit`** — No validation on response values or structure:
- Accepts any object as `diva5Responses` (could be empty, wrong IDs, out-of-range values)
- `timestamp` required in payload but never persisted to DB
- `asrsResponses` accepted but never sent by any client
- `details` error field leaks in development mode

**Revision:** Add schema validation (e.g., Zod) — enforce all 18 question IDs, values 0–4, valid impairment domain IDs, onset in `["yes","no","unsure"]`, `anonymousId` format (32 hex chars).

### 2.2 Cookie Update Authorization (Critical)

**`/api/submit/cookies`** — Authorization = knowledge of `anonymousId`:
- No rate limiting, no CSRF tokens, no payload size limits
- **Logged-in user bug:** If user completes questionnaire anonymously then signs in, cookie donation lookup fails (query filters on `user_id` which was null at submit time)
- Guessing another user's `anonymousId` could attach cookies to their submission

**Revision:** Use a short-lived signed token (JWT or HMAC) returned at submit time instead of raw `anonymousId` for cookie updates.

### 2.3 Auth Callback Open Redirect

**`/auth/callback/route.ts:36`** — `next` query param used in redirect without validation:
```ts
return NextResponse.redirect(`${origin}${next}`);
```
A crafted `next` value could redirect to an external URL.

**Revision:** Validate `next` starts with `/` and doesn't contain `//`.

### 2.4 Login Ignores `next` Param

**`/auth/login/page.tsx:29`** — Hardcoded redirect to `/account` after login, ignoring the `?next=` query parameter passed from protected pages.

**`/account/submission/[id]/page.tsx:21`** — Redirects to `?next=/account` instead of the current submission URL.

### 2.5 Missing Security Headers

**`next.config.ts`** is empty — no `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, or other headers.

---

## 3. Architecture Issues

### 3.1 Monolithic Donate Page (765 lines)

`src/app/donate/page.tsx` contains all wizard steps, API calls, cookie upload/paste, results, and certificate display in a single file.

**Revision:** Extract step components:
- `QuestionStep.tsx` — question display + answer selection
- `ImpairmentStep.tsx` — domain selection
- `OnsetStep.tsx` — age of onset
- `CookieDonationStep.tsx` — upload/paste/extension options
- `DoneStep.tsx` — thank you + certificate

### 3.2 Duplicated Cookie Sanitization (3 copies)

| File | Function |
|------|----------|
| `src/app/api/submit/route.ts:15-37` | `sanitizeCookieData` + `sanitizeCookieItem` |
| `src/app/api/submit/cookies/route.ts:10-30` | Nearly identical copy |
| `src/app/donate/page.tsx:28-51` | Third variant (`sanitizeCookieList`) |

**Revision:** Create `src/lib/sanitize-cookies.ts` shared by all three.

### 3.3 Naming Inconsistency

| Location | Name Used |
|----------|-----------|
| `package.json` | `adhd-research-dataset` |
| Layout metadata | "MindFlow Research" |
| NavBar | "ADHD Self-Assessment" |
| README | "MindFlow Research" |
| Questions file | `adhd-questions.ts` |
| Analysis function | `analyzeDiva5Responses` |
| DB column | `diva5_responses` |

**Revision:** Pick one brand name and one question-set name. Align file names, function names, DB columns, and UI copy.

### 3.4 Missing Next.js Error Boundaries

No `loading.tsx`, `error.tsx`, or `not-found.tsx` in any route group. Server errors show default Next.js page.

### 3.5 Auth Routes Inconsistent Supabase Usage

Auth callback and signout create Supabase clients directly via `@supabase/ssr` with inline cookie handling, while app pages use `@/lib/supabase/server`. Should use shared helper.

---

## 4. Type Safety & Error Handling

| File | Issue |
|------|-------|
| `src/lib/supabase/client.ts:5-6` | Non-null assertions on env vars — crashes at runtime if unset (unlike middleware which gracefully skips) |
| `src/lib/supabase/server.ts:8-9` | Same |
| `src/app/auth/callback/route.ts:5-8` | Same |
| `src/app/account/page.tsx:64-66` | Unchecked JSONB cast from DB (`as Record<string, ResponseValue>`) |
| `src/app/account/page.tsx:17-21` | Supabase query error silently ignored — user sees empty list |
| `src/components/ResultsAnalysis.tsx:74` | `onContinue` optional but button always rendered — could fire `undefined` |
| `src/components/SelfAssessmentCertificate.tsx:22-26` | Certificate date is **current date** (print time), not submission date |
| `src/app/donate/page.tsx:428` | Impairment step allows proceeding with 0 domains selected (no validation) |

---

## 5. Performance

| Issue | Location | Suggestion |
|-------|----------|------------|
| Large client bundle | `donate/page.tsx` ("use client", 765 lines) | Code-split per step with dynamic imports |
| 3 Google fonts loaded | `layout.tsx:6-22` | JetBrains Mono only used in cookie preview; Playfair only on home hero — lazy-load or remove |
| Auth check on every page | `ClientAccountLink.tsx` | Creates Supabase client + auth subscription in NavBar on all routes |
| `analyzeDiva5Responses` called twice | `donate/page.tsx` (results + done steps) | Compute once, store in state |
| Empty `next.config.ts` | Root | No image optimization, compression, or bundle analyzer |

---

## 6. Accessibility

| Issue | Location | Fix |
|-------|----------|-----|
| Progress bar missing ARIA | `ProgressBar.tsx` | Add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| No skip-to-main link | `layout.tsx` | Add skip link before NavBar |
| No `aria-current="page"` | `NavBar.tsx` | Add to active nav link |
| Decorative SVG icons not hidden | Multiple components | Add `aria-hidden="true"` to decorative SVGs |
| Paste textarea no label | `donate/page.tsx` | Add `aria-label="Paste cookie JSON"` |
| No `prefers-reduced-motion` | `globals.css` smooth scroll | Media query to disable |
| Status div in extension popup | `popup.html` | Add `role="status"` and `aria-live="polite"` |
| Color contrast concern | `text-stone-400` on `#faf9f6` | May fail WCAG AA for small text — verify |

---

## 7. SEO

| Present | Missing |
|---------|---------|
| Root `title` + `description` | Open Graph tags (`og:title`, `og:description`, `og:image`) |
| Server-rendered home page | Twitter card tags |
| `rel="noopener noreferrer"` on external links | Per-page metadata (donate, account, auth) |
| | `metadataBase` / canonical URLs |
| | `robots.txt`, `sitemap.xml` |
| | Favicon (referenced in middleware but absent) |
| | Structured data (JSON-LD `MedicalWebPage`) |

---

## 8. UX Issues

| Issue | Details |
|-------|---------|
| **Wizard state lost on refresh** | URL has `?step=cookies&id=...` but step is never restored from URL on mount |
| **No sign-in CTA in questionnaire flow** | Error says "sign in to save" but there's no button to sign in |
| **"100% Anonymous" badge conflicts with accounts** | Users can sign in — badge is misleading |
| **Cookie step says "saved" even when save failed** | The green banner shows regardless of `saveWarning` from prior step |
| **Extension install page references local file path** | "Select the `extension` folder" only works for developers, not deployed users |
| **`meetsOnset` silent on "unsure"** | "Unsure" is treated same as "No" but UI doesn't explain this |
| **Certificate uses current date** | Should use submission date from DB for account page views |
| **Suspense fallback is bare "Loading..."** | No skeleton or spinner |

---

## 9. Database / Migration

| Issue | Suggestion |
|-------|------------|
| No unique constraint on `anonymous_id` | Allows duplicate submissions — add unique or add idempotency check |
| No UPDATE RLS policy | API uses service role (bypasses RLS) but client updates would fail |
| `asrs_responses` column exists but never populated | Remove column or build UI for it |
| No `updated_at` column | Can't track when cookies were added post-submission |

---

## 10. Extension Issues

| Issue | Fix |
|-------|-----|
| `host_permissions: ["<all_urls>"]` is overly broad | Restrict to specific research site domains |
| `popup.js:1-6` — No null checks on DOM elements | Add guards |
| `chrome.cookies.getAll({})` unbounded | Can be very slow on large cookie stores — add progress feedback |
| No content script for page communication | Extension can't auto-detect page state; relies on URL parsing |
| Status div missing `role="status"` | Screen readers won't announce updates |

---

## 11. Prioritized Revision Roadmap

### P0 — Security & Data Integrity
1. Add Zod schema validation on `/api/submit` and `/api/submit/cookies`
2. Fix cookie update authorization (signed token instead of raw `anonymousId`)
3. Validate `next` param in auth callback (prevent open redirect)
4. Fix login page to respect `?next=` redirect
5. Add security headers in `next.config.ts`

### P1 — Code Quality & Maintainability
6. Delete dead files (5 unused components/libs, 5 default SVGs)
7. Extract shared `sanitize-cookies.ts` utility
8. Unify brand name + question-set naming across codebase
9. Add `loading.tsx` / `error.tsx` / `not-found.tsx` error boundaries
10. Fix certificate date to use submission timestamp

### P2 — UX & Accessibility
11. Restore wizard state from URL params on mount
12. Add sign-in CTA in questionnaire error state
13. Fix "saved" banner to reflect actual save status on cookies step
14. Add ProgressBar ARIA attributes
15. Add skip-to-main link and `aria-current` on nav
16. Improve Suspense fallback with skeleton

### P3 — Performance & SEO
17. Split donate page into step components
18. Lazy-load non-essential fonts
19. Add Open Graph + Twitter card metadata
20. Add `robots.txt`, `sitemap.xml`, favicon
21. Add `engines` field to `package.json`

### P4 — Extension & Database
22. Narrow extension `host_permissions`
23. Add unique constraint on `anonymous_id`
24. Add `updated_at` column to submissions
25. Remove unused `asrs_responses` DB column

---

*This audit is advisory. Each section can be implemented independently. Start with P0 for security, then P1 for code health.*
