# MathPath — Learn with Mr. Porras

## Open the published portal

- Student portal: https://porras-math-path.prueba1xyz.chatgpt.site/
- Teacher dashboard: https://porras-math-path.prueba1xyz.chatgpt.site/teacher

This repository contains the source of the published MathPath portal. GitHub itself is not the running student portal. Deployment to the owner's separate Cloudflare account is not yet configured. This version relies on Sites-managed teacher authentication and D1 bindings; it must be adapted before deploying directly to a standalone Cloudflare Worker.

A guided, responsive math practice portal for grades 6–8. Includes 24 introductory topics, original worked examples, scaffolded guided steps, generated practice questions, hints, solutions, and a teacher dashboard.

## Learner flow

Students enter only their first and last name, then choose a grade and topic. A normalized full name identifies a practice profile across devices. Exact duplicate full names share a profile; the teacher can agree on a distinct name variation when needed. These are practice profiles, not verified identities. Students should sign out on shared devices.

A topic is mastered after the student completes the learning and guided stages and answers 5 new questions correctly on the first try, without a hint or solution. Supported correct answers still count toward practice totals. This introductory set is not a full grade-level curriculum or a formal gradebook.

## Teacher access

The public student portal is `/`. The protected teacher workspace is `/teacher`. The teacher uses Sites-managed ChatGPT sign-in. The server authorizes the verified owner email against the `TEACHER_EMAIL` runtime secret. No roster data is returned to anonymous visitors, students, or other signed-in accounts. Configure the owner email through the native Sites environment tool; never put the value in client code.

The dashboard refreshes every 12 seconds and shows names, current grade/topic/stage, recent activity, help requests, and per-topic progress. Activity indicates a visible browser heartbeat within the last two minutes; it does not verify attention. CSV export uses the current filters and escapes spreadsheet formula prefixes.

## Runtime and data

Vinext and React on Cloudflare Workers. D1 binding: `DB`. Migrations live in `drizzle/`. Profiles, opaque hashed student sessions, lesson milestones, and scored question attempts are stored online. Answers are recomputed and validated by the server. Teacher reads are checked on every request. Student writes require an opaque HttpOnly session cookie and same-origin requests. Lessons and public examples are not secret assessment material.

## Validation

- `node node_modules/typescript/bin/tsc --noEmit`
- `node scripts/verify-math.mjs`
- Build and publish through the Sites workflow.

The verification script checks 4,320 generated questions against independent calculations from the visible prompts. It applies the actual migrations to in-memory SQLite and tests the request handlers with a D1-compatible adapter, including progress restoration, teacher authorization, isolation between student sessions, hint/retry/solution behavior, duplicate credit, activity, help, and logout. It does not replace a real-browser interaction test.

## Content references

- https://www.thecorestandards.org/Math/Content/6/introduction/
- https://www.thecorestandards.org/Math/Content/7/introduction/
- https://www.thecorestandards.org/Math/Content/8/introduction/

Content and visual design are original. MathPath is independent of DeltaMath. No DeltaMath accounts or material are imported.
