# Move all lab + access config to the Course; Batch is just enrollment

For a self-paced course, **everything about labs and access lives on the course** — template, allocation model, runtime caps, VM-hour budget. The batch only decides *who* gets in and *when* enrollment is open.

## 1. Course Details → new "Labs & Access" tab (self-paced courses only)

On `src/pages/CourseDetails.tsx`, when `course.settings.deliveryType === "self-paced"`, add a **Labs & Access** tab.

**Section A — Course-wide access model**
- Access model (single choice):
  - **Full-course pool** — shared VM-hour budget across all labs
  - **Per-lab allocation** — each lab has its own cap
  - **Module unlock** — labs unlock as learner progresses through lessons
- Total VM hours per learner (when full-course pool)
- Validity after first launch (days)
- Idle shutdown default (min)
- On-expiry behavior (suspend / delete / lock)

These persist onto `course.settings` (extending `CourseSettings` with `accessModel`, `totalAccessHours`, `validityAfterLaunchDays`, `defaultIdleShutdownMin`, `onExpire`).

**Section B — Per-lab template & limits**
Auto-lists every lab lesson in the course. For each:
- Template picker (dropdown from `labStore.templates`) + inline **Request a template** opening the existing `RequestTemplateSheet`
- Runtime per launch (min) — defaults from template
- Max launches per learner
- Idle shutdown (overrides course default)
- Allocation (when "Per-lab allocation"): hours for this lab
- Unlock-after lesson picker (when "Module unlock")

Persists onto `Lesson.lab` (extending `LabAttachment` with `runtimeLimitMin?`, `maxLaunches?`, `idleShutdownMin?`, `hoursAllocated?`, `unlockAfterLessonId?`). "Awaiting template" badge on rows that still need one.

Reuses `RequestTemplateSheet` for inline template requests.

## 2. Self-paced batch wizard slims to 3 steps

`src/pages/CreateSelfPacedBatch.tsx` becomes:

1. **Basics** — name, description, linked self-paced course. Course picker is filtered to courses where `deliveryType === "self-paced"` AND all lab lessons have a template configured. If the chosen course isn't ready, show a banner with a link to its Labs & Access tab.
2. **Enrollment** — enrollment mode (always-open / window / invite-only), enrollment window dates, max concurrent learners (soft cap). No access model, no VM-hour budget, no per-lab caps — all of that is read from the course.
3. **Review** — summary + publish.

`batchStore.selfPacedConfig` shrinks to `{ enrollmentMode, enrollmentStart?, enrollmentEnd?, maxConcurrentLearners }`. We keep the old fields as optional/back-compat readers but no new batch writes them.

## 3. Self-paced Batch Details

On `src/pages/BatchDetails.tsx`, when `batch.deliveryMode === "self-paced"`, swap to:

- **Overview** — enrolled count, active VM sessions, hours consumed, completion %
- **Learners** — floating enrollment list, hours used / remaining, expiry
- **Running VMs** — live list of student-launched VMs (status, learner, lab, time remaining, force-stop)
- **Assessments** — per-assessment progress across enrolled learners (existing component)
- **Settings** — enrollment window + max concurrent only (everything else is on the course, with a "Edit lab settings in course" link)

Hidden for self-paced: trainer-VM tab, snapshot tab, cohort participant-VM tab, materials/meetings.

## Files

**Modified**
- `src/stores/courseStore.ts` — extend `CourseSettings` with `accessModel`, `totalAccessHours`, `validityAfterLaunchDays`, `defaultIdleShutdownMin`, `onExpire`; extend `LabAttachment` with `runtimeLimitMin?`, `maxLaunches?`, `idleShutdownMin?`, `hoursAllocated?`, `unlockAfterLessonId?`
- `src/pages/CourseDetails.tsx` — conditional **Labs & Access** tab
- `src/pages/CreateSelfPacedBatch.tsx` — drop access/labs steps; gate course picker
- `src/pages/BatchDetails.tsx` — self-paced tab set
- `src/stores/batchStore.ts` — `selfPacedConfig` reduced to enrollment fields

**New**
- `src/components/courses/CourseLabsAccessTab.tsx` — the editor used in Course Details

## Out of scope
- Migrating existing batches that wrote the old `perLabCaps` shape (read as fallback only)
- Real provisioning callbacks for the Running VMs tab (still mock)
- Per-learner cost breakdown

Approve and I'll build.
