# Student Portal Production Polish

Make the student-facing experience demo-ready: each top-level page gets proper sub-pages, real interactions, and a mix of live + self-paced data so both Trainer and Student portals reflect both modes.

## 1. Seed self-paced data (shared)

Add 2–3 self-paced courses + matching batches so they show up across Trainer Courses, Trainer Batches, Student Courses, Student Dashboard, Student Schedule, Student Labs.

- **courseStore.ts**: add `Python for Data Science (self-paced)`, `Linux Server Hardening (self-paced)`, `GenAI Prompt Engineering (hybrid)` with chapters/lessons.
- **batchStore.ts**: add 2 more self-paced batches tied to those courses (floating enrolment, totalAccessHours, lessonVMAccess samples) in addition to existing Batch 7.
- Student-side mock arrays in Labs / Courses / Schedule / Assessments will reference these so the demo shows mixed modes.

## 2. My Labs — `/student/labs`

Add real filtering + per-VM control surface.

- Filter bar: **Batch** select, **Status** select, **Mode** chip (Live / Self-paced), search.
- Each lab card extends current actions with a "Commands & Actions" popover:
  - Power: Start / Stop / Restart / Reset to snapshot
  - Connect: SSH cmd, RDP cmd, copy IP, copy password, download .pem
  - Snapshots: list + Restore
  - Self-paced labs show remaining-hours meter + "Extend hours" CTA instead of "Extend time".
- New sub-route **`/student/labs/:id`** — full lab detail page (console, metrics history, session log, snapshots tab, commands tab). Card click navigates there.

## 3. My Courses — `/student/courses` + sub-pages

Replace drawer-only flow with real pages.

- List page: keep filtered grid; clicking a course routes to detail.
- **`/student/courses/:id`** — Course overview: hero, instructor, progress, chapters accordion, "Continue learning" CTA.
- **`/student/courses/:id/learn/:lessonId`** — Learning Player: left sidebar (chapter/lesson outline with lock states), main area video/reading/quiz/lab launcher, right notes & resources panel, bottom "Mark complete + Next" bar.
- **`/student/courses/:id/resources`** — downloadable PDFs, slides, links.
- **`/student/courses/:id/discussion`** — Q&A thread (mock).
- Self-paced courses show "Lab Access: X / Y hrs" meter; live courses show "Next live session" chip.

## 4. Schedule — `/student/schedule`

- Add view toggle: **List / Week / Month** (week + month = simple calendar grid, mock).
- Filter chips: All / Live / Lab / Self-paced / Assessment.
- Each session card → click opens **`/student/schedule/:id`** session detail page with: agenda, instructor, prep checklist, join/launch buttons, related lab + materials, ICS download.
- Self-paced "session" cards rendered as "Recommended this week" with Start CTA (no time pressure).

## 5. Assessments — `/student/assessments` + sub-pages

- List page: keep summary + filters, add **Course** filter and **Type** filter.
- **`/student/assessments/:id`** — Assessment overview: instructions, time-limit, attempts, syllabus, Start CTA.
- **`/student/assessments/:id/attempt`** — Attempt flow:
  - Quiz: question-by-question with timer, progress, mark-for-review, submit.
  - Assignment: instructions + file upload / text submission.
  - Exercise: code editor placeholder + run/submit.
- **`/student/assessments/:id/result`** — Score, per-question breakdown, feedback, retry/back CTA.

## 6. Certificates — `/student/certificates` + sub-pages

- List page: keep grid, add filter (Earned / In Progress / Expired) + search.
- **`/student/certificates/:id`** — Certificate detail: full-size cert preview, issuer info, credential ID, verify URL, skills, related courses, **Download PDF / Share LinkedIn / Copy verify link** actions.
- **`/student/certificates/:id/verify`** — public-style verify view (read-only summary).
- In-progress entries deep-link to the course's continue page.

## 7. Routing (App.tsx)

Add the new student sub-routes:
```
/student/labs/:id
/student/courses/:id
/student/courses/:id/learn/:lessonId
/student/courses/:id/resources
/student/courses/:id/discussion
/student/schedule/:id
/student/assessments/:id
/student/assessments/:id/attempt
/student/assessments/:id/result
/student/certificates/:id
/student/certificates/:id/verify
```

## Technical notes

- All new pages use existing semantic tokens + shadcn primitives (Card, Tabs, Sheet, Dialog, Progress, Badge, Button). No new design system.
- Mock data lives next to each page (or extended into existing stores where reused across pages — courses, batches).
- Self-paced detection driven by `batch.deliveryMode === "self-paced"` and `course.deliveryType === "self-paced" | "hybrid"`.
- No backend/auth changes — pure frontend + mock state, persists via existing Zustand stores.
- Reuse `PageHeader`, `StatCard`, `StatusBadge`, `ResourceMeter` where applicable.

## Out of scope

- Real video playback, real code execution, real PDF generation.
- Auth, payments, server APIs.
- Admin / Trainer page changes beyond the shared store seed data.
