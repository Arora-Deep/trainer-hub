# Slim down the Student Portal

Goal: cut the gamification overload so corporate students who only show up once or twice see a focused shell. Main nav stays roughly as-is per your call; the Progression group gets the deep cut, plus the two folds you asked for.

## Final sidebar shape

**Main** (5 items, unchanged structure — two folded in)
- My Dashboard *(now hosts the Announcements feed inline)*
- Learning Centre
- Active Labs
- My Courses
- Schedule *(now has an "Office Hours" tab for booking)*

**Achievements** (was "Progression" — 2 items)
- My Progress
- Certificates

**Bottom:** Support

Goes from **13 nav items → 8**. The Progression group shrinks from 6 → 2.

## What gets cut from the sidebar

| Item | Reason |
|---|---|
| Portfolio | Public showcase only matters for long-form bootcamp grads, not one-off corporate trainees |
| Leaderboard | Cross-cohort ranking is noise when students visit twice |
| Challenges | Extracurricular coding stuff outside their actual course |
| Learning Paths | Corporate enrollments are course- or batch-scoped; paths are overkill |
| Announcements (page) | Feed already lives on Dashboard via `AnnouncementsFeed` |
| Office Hours (page) | Booking becomes a tab inside Schedule |

## What gets folded (kept, just moved)

- **Announcements → Dashboard.** Feed already renders there. Drop the `/student/announcements` sidebar link; the "All announcements" affordance becomes a "View all" expand on the Dashboard card.
- **Office Hours → Schedule.** Schedule page gets two tabs: **Calendar** (existing view) and **Office Hours** (the booking UI from `OfficeHours.tsx`).

## Technical changes

**`src/components/layout/AppSidebar.tsx`** — rewrite `studentNav`:
- Main group: remove `Office Hours` and `Announcements` entries.
- Rename "Progression" → "Achievements"; keep only `My Progress` and `Certificates`.

**`src/App.tsx`** — keep route files on disk (developer reference) but you can optionally delete these routes since they're no longer reachable from nav:
- `/student/portfolio`, `/student/paths`, `/student/paths/:slug`, `/student/challenges`, `/student/leaderboard`, `/student/announcements`, `/student/office-hours`, `/student/portfolio/public/:handle`
- Recommendation: **remove the routes** too, so the dev knows they're out of scope. Files stay in `src/pages/student/` as reference.

**`src/pages/student/Schedule.tsx`** — wrap content in a `Tabs` with two tabs:
- "Calendar" — current schedule view
- "Office Hours" — render the existing `OfficeHours.tsx` body (extract into a small component or import the page component directly)

**`src/pages/student/Dashboard.tsx`** — `AnnouncementsFeed` already renders here; add a "View all" toggle on the feed card (local state, no new page). Remove any "→ Announcements page" links.

**`src/components/gamification/LevelChip.tsx`** — the header chip links to `/student/portfolio` and `/student/progress`. Repoint Portfolio → Certificates (or drop it), keep Progress.

**`src/components/gamification/HeroDashboard.tsx`** — currently navigates to `/student/paths` and `/student/challenges`. Repoint "Continue path" → continue the current course (`/student/courses/:id`), drop the challenge CTA. This keeps the streak/hero visual without the dead links.

**Cross-references to clean:** quick grep + repoint anywhere in student pages that links to the removed routes (`paths`, `challenges`, `leaderboard`, `portfolio`, `announcements`, `office-hours`).

## Out of scope

- No store/data deletions — `gamificationStore`, `officeHoursStore`, `announcementStore` stay so the dev can re-enable later or use the data inside Dashboard/Schedule.
- No visual redesign of Dashboard or Schedule beyond inserting the folded content.
- No trainer-side changes; trainers still manage office-hours slots and announcements as before.
