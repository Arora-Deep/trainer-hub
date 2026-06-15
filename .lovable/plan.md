# Meetings — full system

A single source of truth for live sessions across the company: scheduled from a central Meetings page, attached to a batch later, surfaced to students in every relevant place, and reported on after the fact. All BigBlueButton calls stay mocked behind `bbbConfig.ts` so we can wire real secrets later without touching UI.

---

## 1. Concepts & data model

We standardize on **one** Meeting object across trainer, admin, student, and batch surfaces. (Removes today's duplication between `meetingStore` and the mock array in `MeetingsTab.tsx`.)

```text
Meeting
├─ id, title, description
├─ kind: "batch-session" | "ad-hoc" | "office-hours"
├─ batchId? + batchName?           (null until attached)
├─ courseId? + lessonId?           (set if linked from a course live-session lesson)
├─ trainerId, trainerName, coHostIds[]
├─ scheduledAt, durationMins, timezone
├─ status: "draft" | "scheduled" | "live" | "ended" | "cancelled"
├─ visibility: "batch" | "invitees" | "public-in-company"
├─ inviteeIds[]                    (used for office hours / invite-only)
├─ recurrence?: { freq, until, byDay[] }   (for recurring batch classes)
├─ bbb: { meetingId, joinUrlMock, moderatorPwMock, attendeePwMock }
├─ settings: { record, muteOnJoin, waitingRoom, allowChat,
│              allowScreenShare, raiseHand, maxAttendees, lockSettings }
├─ agenda?, prerequisites?, materialsAttachmentIds[]
├─ attendance: AttendanceRecord[]   (built from join/leave events)
├─ engagement: EngagementRecord[]   (per-student composite)
├─ recordings: Recording[]
└─ createdAt, updatedAt, createdBy
```

Two new sibling types:

- `AttendanceRecord`: `studentId, name, joinedAt, leftAt, durationMins, presentPct, status: "present"|"late"|"left-early"|"absent"`.
- `EngagementRecord`: `studentId, talkTimeSec, chatMessages, handRaises, pollResponses, cameraOnPct, score (0-100), tier: "low"|"medium"|"high"`.

Mock generators produce realistic numbers for any meeting whose `status === "ended"`.

---

## 2. Scheduling flow (Trainer / Company admin portal)

### Central Meetings page (`/meetings`) — rebuild

- **Hero stats** stay (Live now / Upcoming / Past / Recordings).
- **View toggle**: List · Calendar (month grid using shadcn calendar) · Timeline (per-batch lanes, optional).
- **Filters**: kind, batch, trainer, date range, status, "needs attention" (low attendance < 50%).
- **Card → drawer**: clicking a meeting opens a right-side drawer with summary + quick actions (Start, Copy link, Edit, Cancel, View report).
- **"Schedule Meeting" wizard** (right-side drawer, single step but grouped):
  1. **Basics**: title, kind (batch-session / ad-hoc / office-hours), description.
  2. **When**: date, time, duration, timezone, optional recurrence (weekly on selected days until end-date).
  3. **Who**: trainer + co-hosts; batch picker (optional — can leave blank, attach later); for office-hours show invitee multiselect.
  4. **Settings**: record, mute on join, waiting room, chat, screen share, raise hand, max attendees.
  5. **Materials** (optional): attach files from the batch / course library.

The batch field is **optional** — meetings created without a batch land in the "Unassigned" bucket and can be attached from Batch Details later.

### Batch Details → Meetings tab (replace current mock-only tab)

- Reads from the **same** `meetingStore`, filtered by `batchId`.
- "Schedule meeting" pre-fills the batch.
- New action: **"Attach existing meeting"** → picks from unassigned meetings.
- Tabs: Live now · Upcoming · Past (with report links).
- For recurring sessions, show the series header with expandable child instances.

---

## 3. Student access points

### a. Student dashboard banner

A single, highly visible card at the top of `/student/dashboard`:

- **Live now** — pulsing red dot, "Join now" button, trainer + time elapsed.
- **Starting soon** (≤ 15 min) — amber, countdown, "Join now".
- **Up next today** — neutral, time until start, "View details".
- Falls back to "No live sessions today" with a link to the schedule.

### b. Student Schedule (`/student/schedule`)

- The existing schedule already shows "Live Class" rows from `studentMockData`. We rewire it to read from `meetingStore` filtered by the student's batch (+ any office-hours they're invited to).
- Each row: Join (when live / within 15 min), Add to calendar (.ics download — generated client-side), View details, View recording (after).
- Calendar view (month + week) using shadcn calendar.

### c. Course detail & lesson player

- The existing `live-session` lesson type gets linked to a real meeting via `courseId + lessonId` on the meeting.
- In the player: shows a `MeetingLessonPanel` — scheduled time, trainer, "Join" button when live, "Watch recording" when ended, agenda + materials inline.

### d. Meeting room page (`/student/meeting/:id`)

Lightweight gate page (NOT a fake BBB UI — that's already prototyped inside `MeetingsTab.tsx` and confuses the integration story):

- Pre-flight checklist (mic/camera test mock), waiting-room state if enabled.
- Big **"Join room"** button → opens `bbb.joinUrlMock` in a new tab (stub).
- Sidebar: agenda, attached materials, "Open course lesson" deep link.

---

## 4. Reports

### Per-meeting report (`/meetings/:id/report`)

Available once `status === "ended"`. Sections:

1. **Header**: title, batch, trainer, date, duration, recorded?
2. **Attendance summary cards**: total invited, present, late, absent, average attendance %.
3. **Attendance table**: student, joined at, left at, time present, %, status chip. Export CSV.
4. **Engagement summary**: average engagement score with donut, distribution (low/med/high) bar chart (Recharts).
5. **Engagement table**: student, talk time, chat msgs, hand raises, polls, camera %, score, tier.
6. **Timeline strip** (optional, nice-to-have): bands showing when each student was in the room.
7. **Recordings** list with thumbnail, duration, size, view link.

### Trainer-level report (Trainers → trainer detail → Reports tab)

- Average attendance % across their sessions, average engagement, number of sessions hosted, completion rate, low-engagement flag count.
- Uses the same store data — no duplicate metrics source.

### Batch-level report (Batch Details → Reports tab, extend existing)

- Per-student rollup: attendance % across all batch meetings, average engagement, sessions missed; flags students under thresholds (configurable in batch settings later).

### Admin overview (Admin → Analytics, light add-on)

- Total live hours delivered this month, top trainers by engagement, batches with attendance issues. Pulls from the same store.

---

## 5. BBB integration boundary (stays mocked)

We expand `src/lib/bbbConfig.ts` to define the **shapes** the future edge function will use, but every function returns mock URLs / IDs. Nothing in the UI hits a network. A small `BBB_INTEGRATION_STATUS` chip stays on the Meetings page so the user knows it's not yet live. A README block documents the four edge functions to add later: `bbb-create`, `bbb-join`, `bbb-end`, `bbb-recordings`.

---

## 6. Technical plan

**New / changed files**

```text
src/stores/meetingStore.ts          extend Meeting type, recurrence, attendance,
                                    engagement, recordings; add selectors & seeds
src/lib/bbbConfig.ts                extend type shapes (no real calls)
src/lib/meetingMockData.ts          NEW — generates attendance + engagement seeds
src/pages/Meetings.tsx              rebuild: list/calendar/timeline + filters
src/pages/MeetingDetail.tsx         add report tab; clean up join flow
src/pages/MeetingReport.tsx         NEW — full report page (or as a tab)
src/components/meetings/
  ScheduleMeetingDrawer.tsx         NEW — used by Meetings + Batch Details
  MeetingCalendar.tsx               NEW — month/week shadcn calendar
  MeetingCard.tsx                   NEW — shared card
  AttendanceTable.tsx               NEW
  EngagementPanel.tsx               NEW (Recharts donut + bar)
  MeetingLessonPanel.tsx            NEW — student course-player surface
  LiveNowBanner.tsx                 NEW — student dashboard banner
src/components/batches/MeetingsTab.tsx
                                    rewrite to use meetingStore (remove inline
                                    fake BBB room UI); add "Attach existing"
src/pages/student/Dashboard.tsx     add <LiveNowBanner/>
src/pages/student/Schedule.tsx      rewire to meetingStore for live items
src/pages/student/CoursePlayer.tsx  use <MeetingLessonPanel/> for live-session
src/pages/student/LiveClass.tsx     simplify to gate page (drop fake BBB room)
src/App.tsx                         add /meetings/:id/report and student route
src/components/layout/AppSidebar.tsx
                                    keep Meetings (trainer); no student entry
```

**State & selectors (zustand)**: add `getUpcomingForBatch`, `getLiveNowForStudent(studentId, batchId)`, `getReport(meetingId)`, `attachToBatch`, `cancelMeeting`, `expandRecurrence`.

**Mock data**: deterministic generator keyed off meeting id so the same meeting always shows the same numbers across pages.

**Design**: drawers for create/edit/filters; status chips per project standard (live=green pulse, scheduled=amber, ended=neutral, cancelled=destructive ghost); Recharts with existing gradient styling.

**Out of scope (won't do now)**:

- Real BBB API calls or edge functions
- The in-browser fake BBB meeting UI currently inside `MeetingsTab.tsx` (replaced with a gate page; can be revived once we wire real BBB)
- Per-user OAuth, calendar push to Google Calendar (we only generate .ics downloads)
- Polls / breakout rooms / whiteboard editor (BBB handles those in the real room)

---

## 7. Build order

1. Expand `meetingStore` + mock generators.
2. New `ScheduleMeetingDrawer` and shared `MeetingCard`.
3. Rebuild `/meetings` (list + calendar + filters).
4. Rewrite Batch Details → Meetings tab on top of the store.
5. Meeting detail + report page (attendance + engagement).
6. Student surfaces: dashboard banner, schedule rewire, course-player panel, gate page.
7. Trainer detail Reports tab + batch Reports rollup additions.

Ready to ship — say the word and I'll move to build.
