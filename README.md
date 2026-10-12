# MathHub by Mr. Porras

A separate, expanded MathPath classroom with six courses and 72 original introductory practice topics: 6th Grade Math, 7th Grade Math, Pre-Algebra, Algebra 1, Algebra 2, and Geometry. Each course has 12 topics with explanations, illustrations, worked examples, guided steps, fresh numeric practice, hints, and solutions. This is an introductory practice collection, not a complete course or a formal gradebook.

## Student access and progress

Students join with first and last names. Returning with the same normalized spelling restores the same profile and saved progress across devices. Students with identical full names need distinct name variations agreed with Mr. Porras. Sign out on shared devices. These name-based profiles support practice; they do not verify identity.

Mastery requires the Learn and Guided stages plus five independent first-try correct answers. Supported answers still count as correct practice. Activity indicates a recent visible-page heartbeat, not verified attention.

## Professor access

Open `/teacher`. Use the private professor access phrase. Capitalization, spaces, and hyphens are ignored. Sessions last eight hours, or 30 days when the personal-device checkbox is selected. Secure HttpOnly cookies, hashed server sessions, expiry, sign-out, rotation, and persistent login limits protect the dashboard. Never commit real credentials or their hashes.

The dashboard provides course and activity filters, topic progress, help requests, CSV export, a student-link copy button, and student removal with confirmation. Removing a student deletes that profile and its records, leaving other students intact.

The Sites deployment additionally supports owner-account sign-in. Set `TEACHER_EMAIL` to the verified owner's email as a runtime secret. Standalone Cloudflare ignores caller-supplied Sites identity headers and uses the professor phrase only.

## Hosting

The Sites manifest and source repository identify this separate MathHub project. Production secrets are configured through the hosting service, never in source. Existing MathPath records are not copied into this classroom.

For a direct Cloudflare deployment, use the Worker named `mathhub` with `wrangler.cloudflare.json`. The direct Cloudflare publication is pending account authentication.

- Build command: `npm run build:cloudflare`
- Deploy command: `npx wrangler deploy --config wrangler.cloudflare.json`
- Student route: `/`
- Professor route: `/teacher`

Cloudflare provisions SQLite Durable Object storage from the configuration. Before classroom use, set the secret `TEACHER_CODE_SHA256` to the SHA-256 of the professor phrase uppercased with spaces and hyphens removed. The normalized phrase must contain 12–64 alphanumeric characters, with total input length at most 64. Use a unique random phrase. Without configuration the dashboard fails closed. `/api/health` reports whether the secret is configured, without disclosing it.

## Verification

- `node node_modules/typescript/bin/tsc --noEmit --incremental false`
- `node scripts/verify-cloudflare.mjs`
- `node scripts/verify-cloudflare.mjs --sites`
- `npm run build:cloudflare`
- `npx wrangler deploy --config wrangler.cloudflare.json --dry-run --outdir work/worker`
- `node scripts/verify-worker.mjs`

Math checks independently calculate 12,960 questions across all 72 topics. Both server variants are tested for scoring, progress persistence, returning students, authorization, hints, retries, help, removal, session expiry, rate limits, and secure cookies including 30-day sign-in. The standalone Worker bundle is also checked in the Cloudflare SQLite runtime. Test-only credentials in these scripts are public fixtures and must never be used in production. Browser visual and interaction QA was unavailable in this development environment.

## Content references

The original explanations and generators draw on mathematics domains represented in Florida B.E.S.T. and Common Core. They are independent of DeltaMath and do not claim complete standards coverage.

- https://www.fldoe.org/academics/standards/subject-areas/math-science/mathematics/bestmath.stml
- https://www.thecorestandards.org/Math/Content/6/introduction/
- https://www.thecorestandards.org/Math/Content/7/introduction/
- https://www.thecorestandards.org/Math/Content/8/introduction/
