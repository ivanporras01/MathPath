# MathPath · Learn with Mr. Porras

Guided math practice for grades 6–8, with 24 original introductory topics, worked examples, guided steps, fresh practice questions, hints, and saved progress.

## Direct Cloudflare deployment

The standalone build is prepared. **Publication to the owner's Cloudflare account has not yet been verified.** The repository URL is not a running classroom.

Deploy the main branch as a Worker named mathpath in account 411e855db2e236ed186881845c318001.

- Build command: npm run build
- Deploy command: npx wrangler deploy
- Root directory: repository root
- Configuration: wrangler.json
- Student route: /
- Private teacher route: /teacher

The checked-in docs/ folder contains the compiled frontend, so npx wrangler deploy can also publish the prepared version directly. SQLite Durable Object storage is provisioned through the configuration; no separate D1 database setup is required.

Before classroom use, configure the TEACHER_CODE_SHA256 secret in the Worker settings. Its value is the SHA-256 digest of the private 16-character alphanumeric teacher code, uppercased with spaces and hyphens removed. Keep the actual code and its digest out of this repository. Without the secret, teacher access stays locked.

After deployment succeeds, verify the returned workers.dev URL, /api/health, student registration, and /teacher. Replace this pending-publication note with the confirmed links.

## Students

Students enter only first and last names. Spaces, Unicode normalization, and letter case are normalized when matching profiles. Returning with the same name restores the same student ID and saved progress, including on another device. Signing out closes the device session while keeping progress.

Profiles, activity, lesson milestones, question attempts, and progress are stored online. Name-only profiles support optional practice, not verified identities. Two students with the same full name share a profile; agree on distinct name variations when needed. Students should sign out on shared devices.

## Teacher dashboard

The private teacher code creates an eight-hour Secure, HttpOnly, SameSite=Strict session. Server-side session hashes support sign-out, expiry, and code rotation. Persistent rate limiting protects code entry. Every teacher action requires authorization. Caller-supplied identity headers never grant access to the standalone Worker.

The dashboard refreshes every 12 seconds and shows student names, grade, current topic and stage, recent activity, help requests, attempts, correct answers, and mastered topics. Includes search, grade/activity filters, individual topic details, CSV export, a student-link copy button, and Remove student with confirmation. Removal deletes the selected profile, sessions, and practice records; other students remain intact.

Activity means a visible-page heartbeat within two minutes, not verified attention. Mastery requires learning and guided stages plus five independent first-try correct answers. Supported correct answers still count in practice totals.

## Different MathPath template

A warm notebook classroom with horizontal navigation, a teal graph-paper banner, grade cards, mathematical illustrations, and a spacious teacher roster. MathPath is a separate project and design from the Python Practice Portal.

## Verification

Run:

    npm run typecheck:cloudflare
    npm run verify:cloudflare
    npm run build
    npx wrangler deploy --dry-run --outdir work/worker
    node scripts/verify-worker.mjs

Content checks independently calculate 4,320 generated questions. API checks cover returning students, saved progress, scoring, hints, retries, authorization, session expiry and revocation, cross-origin protection, rate limiting, help requests, and student removal. The actual Worker bundle is tested with Cloudflare's local SQLite Durable Object runtime. Test access codes are public fixtures and must never be used in production.

The direct deployment uses practice/, cloudflare/, and vite.cloudflare.config.ts. The original Sites source remains available in app/, build/, and .openai/. Previously hosted student records are not embedded in public code or frontend assets.

## Content references

Original lessons; independent of DeltaMath. This introductory collection is not a complete grade-level curriculum or a formal gradebook.

- https://www.thecorestandards.org/Math/Content/6/introduction/
- https://www.thecorestandards.org/Math/Content/7/introduction/
- https://www.thecorestandards.org/Math/Content/8/introduction/
