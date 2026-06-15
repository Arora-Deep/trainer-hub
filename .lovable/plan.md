# Plan — Trainer Portal Gap Fixes (Phase 1)

Same pattern as the rest of the portal: Zustand stores + mock seed data + new pages/components wired into existing routes. No backend. Student portal fixes follow in Phase 2 after this lands.

## 1. Unified Assessment Library
Goal: one place to browse/search Quizzes, Assignments, Exercises and attach them to lessons/batches.
- New page `src/pages/AssessmentLibrary.tsx` at `/assessments` — tabs (All / Quizzes / Assignments / Exercises), search, course filter, status (draft/published) filter.
- Reuses existing `quizStore`, `assignmentStore`, `exerciseStore` via a thin `useAssessments()` selector hook (`src/hooks/useAssessments.ts`) that normalizes them into one shape `{id, type, title, course, status, attempts, avgScore}`.
- Row actions: Edit (routes to existing Create* pages in edit mode), Duplicate, Attach to lesson, Attach to batch, Delete.
- Add lifecycle field `status: "draft" | "in_review" | "published" | "archived"` to all 3 stores (quiz already has draft/published — extend; same for assignment/exercise). Add `publish()` / `archive()` actions.
- Sidebar: group existing Quizzes/Assignments/Exercises under a single "Assessments" collapsible with "Library" at the top.

## 2. Batch → Content Progress Rollup
Goal: trainer sees "what's due this week" and per-student progress per batch.
- New `src/stores/progressStore.ts` — mock seed: per-batch × per-student × per-item (lesson/quiz/assignment/exercise/lab) status (`not_started | in_progress | submitted | graded`), score, submittedAt.
- New tab in `BatchDetails.tsx`: **Progress** — two views:
  - *This week*: list of items due in next 7 days, completion % bar, count of submissions to grade.
  - *Students*: table of participants × completion %, last activity, at-risk flag (computed: <50% & past midpoint).
- New component `src/components/batches/ProgressRollupTab.tsx` + sub `StudentProgressDrawer.tsx` (right drawer with item-by-item breakdown — per design memory).
- Bulk actions on Students table: Send reminder (toast), Mark excused.

## 3. Meetings Module Polish
- **Recurring edit UX**: in `ScheduleMeetingDrawer`, when editing a recurring meeting show "Edit this / Edit this and following / Edit series" radio (mock — applies to all for now but UI exists).
- **Recording attach**: add an "Upload recording" button on `MeetingDetail` past meetings → opens dialog with URL/file input → appends to `meeting.recordings[]`.
- **Co-host view**: add `coHostIds` already in model; surface a "Co-hosting" filter on `/meetings` and a badge on cards.
- **Notifications**: on meeting create/update/cancel, push to existing `notificationStore` (kind: "meeting"). Same for "starts in 15 min" simulated via store action `simulateReminders()` called on app mount.
- **Office hours booking**: new `src/pages/student/OfficeHoursBooking.tsx` (Phase 2 wiring) — slot table generated from `meetingStore.getOfficeHoursSlots(trainerId)`. Trainer-side: a `Slots` tab inside Meetings to define recurring availability windows (mock).

## 4. Labs Consolidation
- Keep existing pages, just clarify in sidebar: group "Lab Templates" + "Lab Instances" + "Requests" under one "Labs" collapsible.
- Add a small banner on `Labs.tsx` index explaining Template vs Instance with links.
- No store changes.

## 5. Reporting & Export
- New `src/lib/exportCsv.ts` helper.
- Add "Export CSV" buttons on: `BatchReportsTab`, `AttendanceTable` (already mentioned), Assessment Library results, Progress Rollup Students table.
- New `src/components/reports/StudentDeepDive.tsx` drawer — opens from any student row across the trainer portal; tabs: Overview / Assessments / Attendance / Engagement / Labs. Pulls from `progressStore` + `meetingStore`.

## 6. Announcements & Messaging (lightweight)
- New `src/stores/announcementStore.ts` — `{id, batchId|null (global), title, body, postedBy, postedAt, pinned}`.
- New tab on `BatchDetails.tsx`: **Announcements** — compose form + list. Toast + push to `notificationStore` on post.
- New trainer page `src/pages/Announcements.tsx` at `/announcements` for cross-batch view.
- Student-side rendering wired in Phase 2.

## 7. Sidebar Grouping (minor, no removals)
`AppSidebar.tsx` trainer section reorganized into collapsibles:
- **Teach**: Programs, Courses, Paths, Certifications
- **Assess**: Assessment Library, Quizzes, Assignments, Exercises, Exams
- **Run**: Batches, Schedule, Meetings, Live Training
- **Labs**: Labs, Templates, Requests
- **People**: Trainers, Students
- **Insight**: Engagement, Reports, Announcements
Order preserved within groups; nothing removed.

## Out of scope for this phase
Student "Next action" card, student calendar export, autosave on attempts, course-player bookmarks/notes, mobile audits, role-gating audit — all moved to **Phase 2 (Student Portal)** which I'll plan after Phase 1 ships.

## Files

**New**
- `src/pages/AssessmentLibrary.tsx`, `src/pages/Announcements.tsx`
- `src/hooks/useAssessments.ts`
- `src/stores/progressStore.ts`, `src/stores/announcementStore.ts`
- `src/components/batches/ProgressRollupTab.tsx`, `src/components/batches/StudentProgressDrawer.tsx`, `src/components/batches/AnnouncementsTab.tsx`
- `src/components/reports/StudentDeepDive.tsx`
- `src/lib/exportCsv.ts`

**Modified**
- `src/stores/quizStore.ts`, `assignmentStore.ts`, `exerciseStore.ts` (lifecycle fields + publish/archive)
- `src/stores/meetingStore.ts` (office-hour slots, reminder simulation, notification hooks)
- `src/stores/notificationStore.ts` (meeting/announcement kinds)
- `src/pages/BatchDetails.tsx` (Progress + Announcements tabs)
- `src/pages/Meetings.tsx`, `src/pages/MeetingDetail.tsx` (slots, recording upload, recurring edit)
- `src/components/layout/AppSidebar.tsx` (grouping)
- `src/App.tsx` (new routes)

Confirm and I'll switch to build mode and ship Phase 1.
