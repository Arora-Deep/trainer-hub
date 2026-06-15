# Trainer Portal Expansion

Three new modules in the trainer (training-company-admin) portal, built on existing Zustand stores and the established design system (Apple-minimal, drawers over modals, Recharts, status chips).

---

## 1. Schedule (tabbed view of all batches)

New route: `/schedule` — sidebar entry under **Main**, icon `CalendarDays`.

Pulls from `batchStore`. Single page with three tabs:

- **Calendar** — month/week grid (using existing `Calendar` component + custom event overlays). Each day shows colored dots per batch; click a day → right drawer listing batches on that day with quick actions (View, Open Meeting, Roster).
- **Timeline** — horizontal Gantt-style. Rows = batches, x-axis = dates. Bars colored by status (Upcoming = yellow, Live = green, Completed = white/grey, Cancelled = red). Hover tooltip with batch summary; click → batch details.
- **Kanban** — three columns: Upcoming / Live / Completed. Batch cards show name, trainer, participant count, dates, lab status chip. Drag is out-of-scope for v1.

Shared top bar: filters (trainer, course, customer, status), search, and a "Today" jump.

---

## 2. Trainer Management

New route: `/trainers` — sidebar entry under **Main**, icon `UserSquare2`. Visible to all trainer-portal users for now (gating added later when RBAC ships).

New store: `trainerStore.ts` (Zustand) with seeded dummy trainers:
`id, name, email, avatar, skills[], certifications[], bio, hourlyRate, joinedAt, status (active/inactive), assignedBatchIds[], metrics { avgRating, npsScore, completionRate, attendanceRate, batchesDelivered, studentsTrained, ratingTrend[] }`.

**Pages/components:**

- **Trainer Directory** (`/trainers`) — table + grid toggle. Columns: trainer, skills (chips), batches (count), avg rating, completion %, status. "Add Trainer" button → right drawer form (name, email, skills multi-select, certs, bio, hourly rate). Row click → Trainer Detail.
- **Trainer Detail** (`/trainers/:id`) — header with avatar + StatCards (Avg Rating, NPS, Completion %, Attendance %, Batches Delivered). Tabs:
  - *Overview* — bio, skills, certifications, edit button (drawer).
  - *Performance* — Recharts: rating trend line, completion bar by batch, student feedback breakdown pie, score distribution.
  - *Batches* — list of assigned batches with status chips; "Assign to Batch" button → drawer that picks an upcoming/live batch (with simple schedule-conflict warning if dates overlap another assignment).
  - *Feedback* — dummy student review cards (rating + comment + batch).

**Batch assignment integration:** add `trainerId` to batches in `batchStore` (already present in some places — normalize). Batch detail's header shows trainer chip linking back to trainer profile.

---

## 3. Meetings (BigBlueButton — mock UI)

New route: `/meetings` — sidebar entry under **More**, icon `Video`. UI shell only; no real BBB calls yet (placeholders ready for later integration).

New store: `meetingStore.ts` seeded with dummy meetings:
`id, title, batchId, trainerId, scheduledAt, durationMins, status (scheduled/live/ended), joinUrl (#), recordingUrl (#), attendeeCount, maxAttendees`.

**Pages:**

- **Meetings List** (`/meetings`) — tabs: Live Now / Upcoming / Past. Cards show title, batch, trainer, time, status chip, primary action (Join / Start / View Recording). "Schedule Meeting" button → drawer (title, batch select, date/time, duration, welcome message, record toggle, mute on join, waiting room).
- **Meeting Detail** (`/meetings/:id`) — meeting info, attendees mock list, recordings list, "Open BBB Room" button (opens `joinUrl` placeholder in new tab; toast: "BBB integration pending"). Settings tab with BBB-style options (camera/mic, layout, breakout rooms) — all UI only.
- Surface "Open Meeting" buttons inline on Schedule cards and Batch Detail when a meeting exists for that batch.

A small `bbbConfig.ts` placeholder file documents the future env vars (`BBB_SERVER_URL`, `BBB_SHARED_SECRET`) so wiring real integration later is a drop-in.

---

## Technical notes

- **Files added:**
  - `src/pages/Schedule.tsx` + `src/components/schedule/{CalendarView,TimelineView,KanbanView,ScheduleFilters,DayBatchesDrawer}.tsx`
  - `src/pages/Trainers.tsx`, `src/pages/TrainerDetail.tsx` + `src/components/trainers/{TrainerDrawer,PerformanceCharts,AssignBatchDrawer,FeedbackList}.tsx`
  - `src/pages/Meetings.tsx`, `src/pages/MeetingDetail.tsx` + `src/components/meetings/{ScheduleMeetingDrawer,MeetingCard,AttendeesList,RecordingsList}.tsx`
  - `src/stores/trainerStore.ts`, `src/stores/meetingStore.ts`
  - `src/lib/bbbConfig.ts` (placeholder)
- **Files edited:**
  - `src/components/layout/AppSidebar.tsx` — add Schedule, Trainers, Meetings entries to `trainerNav`.
  - `src/App.tsx` — register the new routes.
  - `src/stores/batchStore.ts` — ensure `trainerId` on each batch; add helper selectors `getBatchesByStatus`, `getBatchesByDateRange`.
  - `src/pages/BatchDetails.tsx` — trainer chip in header; "Meetings" quick link if any exist for the batch.
- **Patterns reused:** PageHeader, StatCard, StatusBadge, right-side Sheet drawers, Recharts with existing gradient/rounded-top styling, status color mapping.
- **Out of scope (this pass):** real BBB API calls, RBAC gating on trainer management, drag-and-drop in Kanban, recurring meetings, ICS export.

After build, I'll also update `mem://index.md` with references to the three new modules.
