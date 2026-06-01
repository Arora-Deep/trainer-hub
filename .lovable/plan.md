# Self-Paced Training — End-to-End Plan

Goal: Make self-paced training a first-class, versatile delivery mode that works for cyber-sec, coding, AI/ML, networking, and certification programs. Cover authoring (Customer + Trainer), settings, lab/VM modes, and the student learning UX — all consistent and intuitive.

## 1. Mental model

A **Self-Paced Course** = ordered modules of mixed content blocks + optional attached lab(s), wrapped in an **Enrollment** (per student) governed by **Course Settings** (validity, lab policy, certification).

```text
SelfPacedCourse
 ├─ Settings (validity, lab policy, prerequisites, certification)
 ├─ Modules[]
 │    └─ Lessons[]: video | reading | quiz | assignment | code-exercise | lab | ctf | exam
 └─ LabAttachments[] (blueprint refs + per-lab mode)

Enrollment (student × course)
 ├─ validUntil
 ├─ labWallet (hours OR "unlimited-during-validity")
 ├─ progress per lesson
 └─ persistentVMs[] (if any persistent labs)
```

## 2. Authoring — who builds what

Two authors, one builder, scoped catalogs:

- **Customer (training company) admin** → builds courses in their tenant catalog. Visible only to their students.
- **Trainer** → builds courses in their own library; can publish to the customers they are assigned to, or to the global CloudAdda marketplace (if Admin approves).
- **CloudAdda Admin** → curates a global catalog + approves marketplace submissions.

Same **Course Builder** UI for both Customer and Trainer (already exists at `src/pages/CourseBuilder.tsx` / `CourseEditor.tsx`) — we extend it, don't fork it. Ownership and visibility scoping is the only difference.

## 3. Course Builder — Lesson block types

Extend `Lesson.type` from `video | document | quiz | assignment` to:

- `video` — uploaded or URL, with chapter markers + transcript
- `reading` — rich text / markdown
- `quiz` — uses existing `quizStore`
- `assignment` — file-submission
- `code-exercise` — Judge0 inline editor (already scoped in memory)
- `lab` — attached VM blueprint (see §5)
- `ctf-scenario` — lab + flag submission + scoring (cyber-sec)
- `exam` — timed/proctored, gates certification

This single block library covers all verticals:
- Coding/AI-ML → video + reading + code-exercise + lab
- Cyber-sec → video + reading + ctf-scenario + lab
- Networking → video + reading + lab (multi-VM topology)
- Certification → everything + exam → certificate

## 4. Course Settings (per course)

A dedicated **Settings** tab in Course Builder:

- **Delivery**: self-paced (this plan), instructor-led, hybrid
- **Validity model**: fixed days from enrollment (e.g. 90) OR fixed end-date OR rolling cohort
- **Lab policy** (the big one — see §5)
- **Prerequisites**: other courses / paths
- **Sequential vs free navigation**: must-complete-in-order toggle
- **Completion rule**: % of lessons + min quiz score + (optional) exam pass
- **Certification**: issues certificate on completion (links to `certificationStore`)
- **Discussion**: enable/disable course Q&A
- **Visibility**: private to batch / customer-wide / marketplace

## 5. Lab Hours & VM Access — the versatile model

Author picks the policy **per course**, then **per lab lesson** chooses the mode:

### Course-level lab policy (one of):
1. **Hourly wallet** — student gets N lab-hours for the course, consumed by on-demand VMs.
2. **Unlimited-during-validity** — no metering, labs available as long as enrollment is valid.

### Per-lab mode (within a lesson):
- **On-demand VM** — student clicks "Launch Lab", VM spins up from blueprint, auto-suspends after idle, hours deducted from wallet (if hourly policy).
- **Persistent VM** — VM provisioned at course enrollment (or first launch), stays assigned to student for entire validity window, state preserved across sessions. Used for long-running projects, capstone work, multi-step CTFs.

Trainer/Customer marks which labs are persistent during authoring. Persistent VMs ignore the hourly wallet (they're billed differently, surfaced as "always-on VM count" on the course card).

## 6. Student learning experience

### Course card (in `Courses.tsx`)
Self-paced courses get a distinct chip + show: validity remaining, lab hours remaining (if hourly), persistent VM count, % complete.

### Course Player (`CoursePlayer.tsx`) — main self-paced view
Left rail: modules → lessons (collapsible, current highlighted, completed checkmarks).
Main pane: renders the active block (video / reading / quiz / code / lab / exam).
Right rail (collapsible): Notes, Discussion, Resources, Lab session (if lab lesson active).
Sticky footer: Mark complete → Next lesson.

### Lab launch UX (inside lesson)
- **On-demand**: "Launch Lab" button → status pill (Provisioning → Ready → Open Console). Live timer of session, current wallet balance, idle auto-suspend warning.
- **Persistent**: "Open My Lab" → console opens immediately, "Always available until {validity date}".
- VM console opens in a side panel or new tab (existing Console UI reused).

### Progress hub (`Progress.tsx`)
Self-paced section listing: courses with deadlines, validity countdowns, lab wallet status per course, next lesson CTA.

### Certification flow
On completion → certificate auto-issued via `certificationStore`; appears in `Certificates.tsx`.

## 7. Admin / CloudAdda side

- **Course Moderation queue** (new admin page) — review marketplace submissions.
- **Lab Hour Plans** — extend `PlansAndPricing.tsx` so customers can buy lab-hour bundles per course/student.
- **Persistent VM tracking** — extend `VMManagement.tsx` to filter "Self-paced persistent" VMs.
- **Reports** — usage by course, completion rate, average lab hours consumed, certification issuance rate.

## 8. Build order

1. **Data model** — extend `courseStore.ts` (lesson types, settings, lab policy, persistent flag), add `enrollmentStore.ts` (validity, lab wallet, progress, persistent VM refs).
2. **Course Builder** — add **Settings** tab, expand lesson block palette with the new types, per-lab mode picker.
3. **Customer authoring entry point** — surface "Create Course" in Customer portal under their catalog (today it's trainer-only).
4. **Student CoursePlayer** — left-rail TOC, block renderers (video / reading / quiz / code / lab / exam), sticky completion footer.
5. **Lab launch components** — `OnDemandLabPanel` + `PersistentLabPanel` reused inside lessons and in `LabDetail.tsx`.
6. **Validity + wallet UI** — surfaces on Course cards, CourseDetail header, Progress page.
7. **Certification wiring** — completion event triggers cert issuance.
8. **Admin moderation + lab-hour plans** — last, after the core loop works.

## 9. Out of scope (this round)

- Live/instructor-led specific UX (we touch only the self-paced delivery type).
- Real VM provisioning backend — UI uses mocked states (Provisioning → Ready → Suspended) consistent with current lab mock layer.
- Payment integration for lab-hour bundles — UI stubs only.
- Proctoring vendor integration — `exam` block renders as timed quiz with a "proctored" badge for now.

## 10. Technical notes

- New stores: `enrollmentStore.ts`. Extend: `courseStore.ts` (types + settings), `labStore.ts` (per-VM persistent flag, wallet decrement helper).
- New components: `LessonBlockRenderer`, `OnDemandLabPanel`, `PersistentLabPanel`, `CourseSettingsForm`, `LabPolicyPicker`.
- Reuse: existing `CoursePlayer.tsx` shell, `Console` views, `quizStore`, `certificationStore`, `TemplatePickerDropdown` for blueprint selection.
- Follow project conventions: Drawers for settings forms, Apple-minimal styling, status chips with the standard color map, Zustand for all state.
