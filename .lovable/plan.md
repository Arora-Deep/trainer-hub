# Student Portal Restructure – Self-Paced & VILT

Reshapes the student experience around three delivery modes (Self-Paced, VILT, Hybrid) with first-class lab allocation rules, a new Lab Instructions content type, and a proper Lab Workspace. Trainer/admin tooling gets the minimum knobs to drive these student views.

---

## 1. Data model changes

**`courseStore.ts`**
- Extend `Course` with `deliveryMode: 'self_paced' | 'vilt' | 'hybrid'` (already exists on student mock — promote to authoring side).
- Extend `Lesson` type union with `'lab_instruction'` and `'live_session'`, `'survey'`, `'mock_exam'`.
- Add `LabInstruction` shape on `Lesson`: `objective`, `prerequisites[]`, `tasks[] { title, detail }`, `expectedOutcome`, `resources[] { label, url, kind }`.
- Extend `LabAttachment` with `allocation`:
  ```
  { type: 'persistent' | 'module_unlock' | 'time_limited' | 'hour_pool',
    hours?, expiry?, untilCourseEnd?, unlockAfter?: { kind: 'lesson'|'module'|'quiz'|'assignment', refId },
    sessionDurationHrs?, onExpire?: 'suspend'|'delete'|'lock',
    poolHours? }
  ```
- New `studentLabStore.ts` (lightweight): tracks per-student active labs — `id, courseId, lessonId, name, status, hoursRemaining, expiresAt, lastAccessed, snapshotId`.

**`studentMockData.ts`**
- Add 1 self-paced course, 1 VILT course, 1 hybrid course with full module/lesson/lab-instruction examples and varied lab allocation types.
- Add active labs list, lab-hour pools, upcoming sessions tied to VILT courses.

## 2. Trainer-side authoring (minimal)

**`LessonEditorSheet.tsx`** — add new type options:
- `lab_instruction` → form with Objective / Prerequisites / Tasks (repeatable) / Expected Outcome / Resources (repeatable).
- `live_session` → date, time, duration, meeting link, agenda.
- `mock_exam`, `survey` → reuse existing inline-vs-library pattern.
- When type = `lab`, add **Allocation** section with the 4 types and conditional fields.

**`CreateCourse.tsx` / `CourseDetails.tsx`** — add Delivery Mode selector (Self-Paced / VILT / Hybrid).

## 3. Student dashboard redesign (`src/pages/student/Dashboard.tsx`)

Replace existing layout with sections in this order:
1. **Hero strip** – name, streak, today's focus CTA ("Continue X" or "Join live in 12m").
2. **Continue learning** – top in-progress course card with progress %, next lesson, resume button.
3. **Upcoming live sessions** – only renders if student has VILT/hybrid enrollments; shows join button when within ±15m.
4. **Active labs** – cards with name, status chip, hours remaining bar, expiry, quick actions (Resume / Snapshot / Stop).
5. **Lab hours remaining** – per-course meter for hour-pool allocations.
6. **Course progress** – compact list of enrolled courses with % bars.
7. **Recent activity** – feed (lesson done, lab launched, assignment submitted).
8. **Achievements** – existing certificates/skill chips, slimmed.

Keep gamification but as a secondary band, not the hero.

## 4. Course detail adapts to delivery mode (`src/pages/student/CourseDetail.tsx`)

- Header badge already shows mode — expand summary card per mode:
  - **Self-Paced**: progress, est. time remaining, lab hours remaining, "Next lesson" CTA.
  - **VILT**: next live session card prominent, attendance %, "Join session" CTA, schedule list.
  - **Hybrid**: both, with self-paced modules and a live schedule tab.
- Module list renders new lesson types with proper icons; show lock state with reason ("Unlocks after Module 2 quiz").

## 5. New Lab Workspace page

New route `/student/courses/:courseId/labs/:lessonId/workspace` → `src/pages/student/LabWorkspace.tsx`.

Layout (3-pane, resizable via existing `resizable` primitives):
- **Left (320px)**: Lab Instructions — Objective, Tasks checklist (local check state), Expected Outcome, Resources list.
- **Center (flex)**: VM console placeholder (existing console mock), top bar with VM name + status + timer (for time-limited).
- **Right (260px)**: Controls — Start/Stop/Restart/Pause, Snapshot/Restore, Fullscreen, Remaining time, Expiry info.

Reuse `OnDemandLabPanel`/`PersistentLabPanel` patterns; new wrapper page.

## 6. Lesson viewer extensions (`src/pages/student/CoursePlayer.tsx` and/or `LessonView.tsx`)

- `lab_instruction` lesson → render the structured instruction layout inline with "Launch lab" CTA that opens the Lab Workspace.
- `live_session` lesson → session card with join button + status.
- `lab` lesson → opens Lab Workspace directly.
- Lock evaluation uses `allocation.unlockAfter` and student progress.

## 7. VILT live session page (`src/pages/student/LiveClass.tsx`)

Restructure into 4 zones:
- Main: instructor video/screen-share placeholder + chat.
- Right top: **My Training Lab** mini-console with quick controls.
- Right bottom: **Session Resources** (downloads/slides).
- Bottom strip: announcements, attendance status chip, session timer.

## 8. Routing (`src/App.tsx`)

Add:
- `/student/courses/:courseId/labs/:lessonId/workspace` → `LabWorkspace`
- Ensure existing `/student/courses/:id/learn/:lessonId` handles new lesson types.

## 9. Out of scope

- Real WebRTC / video infra (mocked).
- Real VM orchestration (mocked statuses).
- Admin batch wizard changes beyond delivery mode (already covered earlier; will reuse).
- Backend persistence — all client state via Zustand mocks.

## Files touched

**New:** `src/pages/student/LabWorkspace.tsx`, `src/stores/studentLabStore.ts`
**Edit:** `src/stores/courseStore.ts`, `src/data/studentMockData.ts`, `src/components/courses/LessonEditorSheet.tsx`, `src/pages/CreateCourse.tsx`, `src/pages/student/Dashboard.tsx`, `src/pages/student/CourseDetail.tsx`, `src/pages/student/CoursePlayer.tsx`, `src/pages/student/LiveClass.tsx`, `src/App.tsx`
