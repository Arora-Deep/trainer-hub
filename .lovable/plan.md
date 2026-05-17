## Goal

Today the platform is built end-to-end around live instructor-led batches: fixed dates, fixed schedules, fixed seat count, single live class page. We will add **self-paced** as a first-class delivery mode (alongside live and hybrid) and propagate it through Course → Batch → Student experience across the Admin, Trainer, and Student portals.

The change is data-model + UX, no backend work — everything stays in the existing Zustand stores.

---

## 1. Data model (stores)

### `src/stores/courseStore.ts`
`deliveryType` already exists on `Course`. Normalize values to `"live" | "self-paced" | "hybrid"` and surface it as a required choice in `CreateCourse` (radio group). Courses where `deliveryType === "hybrid"` are eligible for either batch mode.

### `src/stores/batchStore.ts`
Add to `Batch`:
```
deliveryMode: "live" | "self-paced"
accessModel?: "full-course" | "lesson-unlock"   // self-paced only
totalAccessHours?: number                        // self-paced only, floating
lessonVMAccess?: Array<{                         // self-paced + lesson-unlock
  chapterId: string
  lessonId: string
  vmTemplateId: string
  instanceName: string
  hours: number               // access window once unlocked
  unlockOn: "lesson-start" | "lesson-complete" | "previous-complete"
}>
enrollmentMode: "fixed" | "floating"             // self-paced defaults to floating
```
- `seatCount` becomes optional (`floating` mode hides it; no auto-generated participants).
- For self-paced batches, `vmConfig.dateRange` is replaced by an open-ended window (start date + optional hard expiry); schedules/day-grids are skipped.
- New helpers: `enrollSelfPacedStudent`, `unlockLessonVM(batchId, participantId, lessonId)`, `consumeAccessHours(batchId, participantId, vmId, minutes)`.

No changes to the existing live flow — those batches keep `deliveryMode: "live"` and behave exactly as today.

---

## 2. Course creation (Trainer + Admin)

`src/pages/CreateCourse.tsx`: add a "Delivery type" step with three cards: **Live instructor-led**, **Self-paced**, **Hybrid**. Show a short blurb under each. This value flows into every batch built from the course.

`src/pages/CourseDetails.tsx` / `Courses.tsx`: surface a small chip (`Live` / `Self-paced` / `Hybrid`) next to the course name everywhere it's listed.

---

## 3. Batch creation — branched wizard

Rewrite `src/pages/CreateBatch.tsx` and mirror in `src/pages/admin/AdminCreateBatch.tsx` so both share a step-based shell with a new **Step 1: Delivery Mode**.

```text
Step 1  Delivery mode
        ┌─ Live instructor-led ──► existing steps (Basic → Schedule → VMs → Review)
        └─ Self-paced ─────────► new steps below
```

When the parent course's `deliveryType` is `"live"` or `"self-paced"`, the mode is locked to that value (no picker shown). For `hybrid` courses, the user chooses.

### Self-paced steps

1. **Basics** — name, description, instructor (optional mentor), tags. No fixed seat count; toggle reads "Floating enrollment" (default on).
2. **VM Access Model** — radio:
   - *Full-course access*: VMs are available the entire time the student is enrolled, governed by a total hour budget.
   - *Lesson-based access*: VMs unlock per lesson/module with a per-unlock hour budget.
3. **VMs**
   - Full-course access: pick one or more templates, set **Total access hours per student** (default 120), set hard expiry date (optional).
   - Lesson-based access: render the course curriculum (chapters → lessons from `courseStore`) as a tree; on each lesson the trainer can attach a VM template, pick `unlockOn` (`lesson-start` / `lesson-complete` / `previous-complete`), and set hours of access. Multiple lessons can share or differ in VMs.
4. **Review** — show pricing computed per active hour × estimated enrollments slider (since seats are floating) instead of per-seat × days.

Submit → `addBatch({ ..., deliveryMode: "self-paced", accessModel, totalAccessHours, lessonVMAccess, enrollmentMode: "floating" })`.

---

## 4. Batch detail (Trainer + Admin)

`src/pages/BatchDetails.tsx` and `src/pages/admin/AdminBatchDetail.tsx`:

- Header chip shows `Live` or `Self-paced`.
- **Participants tab**: for self-paced + floating, replace the "X / Y seats" meter with a live enrolled count and an "Invite link / enroll students" CTA. Columns change: drop attendance, add `Hours used / Total`, `Last lesson`, `Last active`.
- **VM tab**: 
  - Live → unchanged.
  - Self-paced + full-course → single VM template panel with aggregate hour-usage gauge and per-participant breakdown.
  - Self-paced + lesson-unlock → **curriculum tree view**: each chapter/lesson row shows attached VM template, unlock rule, hours, and per-student unlock status (locked / unlocked / consumed). Trainer can edit attachments inline.
- **Schedule tab**: hidden for self-paced.
- **Course tab**: for self-paced, show curriculum progress per student instead of session calendar.

---

## 5. Student portal

### Rename + scope
Rename `src/pages/student/LiveClass.tsx` and its route (`/student/live` or current path) to **Learning Centre** (`/student/learning`). Update `AppSidebar` label and icon. Keep the existing Default / Content / Lab / Notes view tabs and the resizable layout — they work for both modes.

### Course switcher
At the top of Learning Centre, add a sticky **course picker**:
- Lists every batch the student is enrolled in.
- Live batches show a `Live now` / `Next session …` badge and behave exactly as today when selected.
- Self-paced batches show `Self-paced • {hoursRemaining}h left`.
- Selecting a course swaps the curriculum, VM context, and chat panel (chat hidden for self-paced; replaced by a "Mentor inbox" panel).

### Self-paced view differences
- **Default view**: removes live-only widgets (live chat, class pulse). Shows the curriculum on the left, a "Resume" hero card with the last lesson, and an hour-budget meter.
- **Content view**: same layout, but the sidebar shows `Hours remaining`, `Next unlock at: Lesson X`, and a Mentor message box instead of live chat.
- **Lab view**: VM console is only available for the currently unlocked lesson; if locked, show a "Complete `Lesson Y` to unlock this VM (Z hours of access)" empty state with a CTA.
- **Notes**: unchanged.

`src/pages/student/Dashboard.tsx`: the existing "Resume Lab" / "Continue Course" cards already work — just respect `deliveryMode` so self-paced cards show "Hours left" instead of "Next live session", and link into `/student/learning?batchId=…`.

### Student labs list
`src/pages/student/Labs.tsx`: split into "Always-on labs" (self-paced full-course) and "Lesson-locked labs" (self-paced lesson-unlock) so students see exactly what's available now.

---

## 6. Admin portal reflection

The Zustand stores are shared, so these pages pick up the new fields automatically; we only adjust columns/filters:

- `AllBatches.tsx`, `CustomerDetail.tsx` Batches tab — add a `Mode` column (Live / Self-paced) and a filter.
- `Students.tsx`, `Approvals.tsx`, `BatchProvisioning.tsx` — show `Mode` chip; for self-paced rows the "Schedule" / "Seat" columns render `Floating` and `{hoursRemaining}h`.
- `ResetLab.tsx`, `AssignVM.tsx`, `ReplaceVM.tsx`, `VMManagement.tsx` — keep working as today; for lesson-unlock VMs the picker shows the lesson it's tied to.

---

## Files to change

**Stores**
- `src/stores/courseStore.ts` — normalize `deliveryType` values
- `src/stores/batchStore.ts` — extend `Batch`, add helpers

**Course flow**
- `src/pages/CreateCourse.tsx`, `src/pages/CourseDetails.tsx`, `src/pages/Courses.tsx`

**Batch flow**
- `src/pages/CreateBatch.tsx`, `src/pages/admin/AdminCreateBatch.tsx`
- `src/pages/BatchDetails.tsx`, `src/pages/admin/AdminBatchDetail.tsx`
- `src/components/batches/ParticipantsTab.tsx`, `BatchSettingsTab.tsx`
- `src/pages/admin/AllBatches.tsx`, `src/pages/admin/CustomerDetail.tsx`, `src/pages/admin/ModifyBatch.tsx`

**Student**
- Rename `src/pages/student/LiveClass.tsx` → `src/pages/student/LearningCentre.tsx`; update route + sidebar
- `src/pages/student/Dashboard.tsx`, `src/pages/student/Labs.tsx`
- `src/components/layout/AppSidebar.tsx`, `src/App.tsx` (route)

**Admin polish (column/chip only)**
- `src/pages/admin/Students.tsx`, `Approvals.tsx`, `BatchProvisioning.tsx`, `VMManagement.tsx`, `AssignVM.tsx`, `ResetLab.tsx`, `ReplaceVM.tsx`

---

## Out of scope

- No backend wiring; access-hour consumption is mocked in the store (decrement when "Start VM" is clicked).
- No billing/invoicing changes beyond a display tweak on the Review step.
- Existing live batches keep their current UI verbatim — no regressions.
