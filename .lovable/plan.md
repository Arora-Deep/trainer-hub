# Mega Plan — Trainer + Admin Portal Improvements

All-mock implementation (no backend). Grouped by area. Items map 1:1 to your list; numbering reused for traceability.

---

## A. Global VM Controls (Trainer)

**1. Batch-wide VM control bar** — In `BatchDetails.tsx` (trainer VMs tab) + `LiveTraining.tsx`, add a sticky toolbar above the VM grid:
- `Start all`, `Stop all`, `Reclone all`, `Restore all to initial state` buttons.
- Each runs over `batch.participants[].vm` in `batchStore`, toast progress, optimistic status flips.

**2. Reclone alerts** — Confirmation dialog before reclone (single or bulk) with warning:
> "Recloning resets all participant work. Repeated reclones in a short window can slow the host node."
Track `reclonedAt[]` on each VM in store; if >1 reclone in last 24h, show amber inline alert "Reclone throttled — last reclone Xh ago".

---

## B. Quizzes

**3. Fix quiz not opening** —
- Trainer side (`QuizDetails.tsx`): route uses `:id`, store has ids `"1"–"4"`, route param works. Real bug: nothing renders Play button target. Add `Play` action → student-style attempt preview at `/quizzes/:id/preview` (read-only walkthrough using existing questions).
- Student side: wire `Assessments` quiz cards → `AssessmentAttempt`. Confirm route guard; fix `getStudentAssessment` returning `undefined` for quiz-store ids by extending lookup to merge `quizStore`.

**4. Import quiz / course content / assignments** (CSV/JSON upload, mock):
- New `src/components/imports/ImportDialog.tsx` — drag-drop file → parse → preview rows → confirm → push into store.
- Schema docs in-dialog ("Download sample CSV"); samples in `src/data/import-samples/`.
- Buttons: `Quizzes.tsx`, `Courses.tsx` (course content into selected course), `Assignments.tsx`.

---

## C. Schedules & Availability

**5. 24-hour option in VM availability** — In `AdminCreateBatch` & `CreateBatch` VM scheduling step, add `24h / always-on` toggle. When on, hide start/end pickers; persist `availability: { mode: '24h' | 'window', start, end }`.

**6. "≥8h selected = full-day access" rule** — Same scheduler: if `(end-start) >= 8h`, auto-promote to 24h with toast "Granted full-day access (selection ≥ 8 hours)".

**7. Free calendar / free area** — New `Schedule.tsx` (trainer) tab "Free time" — draggable blocks the trainer marks as available; stored in `trainerStore`. Used by office-hours and the trainer-console-after-done rule (#21).

---

## D. Pricing & Billing (Admin + Trainer)

**8. Hide prices from non-finance roles** — In `AdminCreateBatch` VM step (`vm costs`), wrap all `$` displays in `<IfRole roles={['SuperAdmin','Finance']}>`. Helper component reads `roleStore`.

**9. VM cost = participants + 1 trainer VM** — Update cost calc in `AdminCreateBatch` & trainer `CreateBatch`: `total = (seats + 1) * perVmCost * hours`.

**10. Per-participant cost in trainer review step** — `CreateBatch.tsx` review/summary card: show `Per participant: $X` and `Total (incl. trainer VM): $Y`.

**11. Billing adjustments for add/remove participants** — `pages/admin/Billing.tsx` + `BatchDetails` participants tab: when participant added mid-batch, append line item `+1 seat · prorated $X`; on removal, credit line. Store in new `billingAdjustments[]` on batch.

---

## E. Create / Modify Batch (Admin)

**12. Choose node for VMs** — `AdminCreateBatch` infra step: dropdown `Target node` populated from `Nodes.tsx` mock list, default `Auto-select`. Per-batch override + per-VM override in `ModifyBatch`.

**13. Enable VLAN for batch** — Same step: toggle `Dedicated VLAN`, optional VLAN ID input. Show info: "Isolates batch traffic from other tenants."

**14. Resize VM mid-batch** — `ModifyBatch.tsx`: new "Resources" tab. Per-VM resize control (vCPU/RAM/Disk sliders). Confirm dialog: "Requires reboot. Apply now / schedule for window?". Logs entry in batch activity.

**15. Pre-provisioned VM assignment** — In create-batch VM step, add option `Use pre-provisioned VM pool` alongside template flow. Picker lists VMs from `LabInstances.tsx` mock pool with status=available. Skips template/snapshot flow.

**16. Trainer VM-config access window** — In create-batch (trainer flow), add field "When should you get access to configure VMs?" with options: `Default (2 days before)`, `Custom date` (date picker), `Immediately on approval`. Stored on batch.

**17. Reclone button gating** — Trainer batch detail: reclone disabled unless `now >= batchStart - 2 days`. Tooltip explains.

**18. Trainer console access after "Done"** — If batch marked completed but trainer's free-time block (#7) overlaps current time AND VM availability window still open, allow console access. Otherwise show "Batch ended" state.

**19. Approval = backend process; create-batch saves as draft** — Trainer `CreateBatch` submit → status `draft` → `pending_approval`. New `Approvals.tsx` admin page already exists; wire it. Provisioning only triggered post-approval (mock: button "Approve & provision"). Batch hidden from trainer's active list until approved; visible in "My drafts".

**20. Disable LMS/content view per batch** — Create-batch toggle `Enable LMS content for students`. When off, student portal hides Courses/Learning Centre nav items for that batch enrolment (read from `enrollmentStore` flag).

---

## F. Admin Portal Misc

**21. Add multiple participants at once** — `ParticipantsTab.tsx` "Add" → drawer with two tabs: `Single` (existing) and `Bulk` (paste emails or upload CSV). Generates participants in batch.

**22. Email in participant details + "Send VM credentials" action** — Already have email; add row action `Send login credentials via email`. Mock toast "Credentials emailed to <addr>". Action also in trainer participants list.

**23. Show student login details to trainer** — `BatchDetails` participants tab: per-row eye toggle to reveal generated username + temp password (mock). Copy-to-clipboard.

---

## G. UX / Console Polish

**24. VM-switch buttons on left of live training console** — `LiveTraining.tsx`: add a left rail listing participant VMs; click to switch the active VM preview frame.

**25. Editable dashboard (user preference)** — `Dashboard.tsx` (trainer): add "Edit layout" mode using a simple widget toggle drawer (Show/Hide: Stats, Upcoming sessions, Active batches, Quick actions, Activity). Persist to `localStorage` key per role.

**26. Properly build Trainer Courses page** — Rebuild `Courses.tsx` (trainer):
- Filter chips (Mine / Shared / Drafts / Published)
- Card grid → switch to table view
- Per-row actions (Edit, Duplicate, Archive, Import content)
- Empty state + "New course" + "Import course" CTAs

---

## H. Skipped (per your answers)
- Nav color inversion — skipped.

---

## Technical Notes

- New stores/fields: `batchStore` gains `vlan`, `targetNode`, `lmsEnabled`, `trainerConfigAccessAt`, `reclonedAt[]`, `billingAdjustments[]`, `approvalStatus`. `participant.vm` gains `loginUsername`, `loginPassword` (mock), `availability` shape change, `size` (vCPU/RAM/disk).
- New components: `ImportDialog`, `IfRole`, `BulkAddParticipantsDrawer`, `VmControlBar`, `ResizeVmDialog`, `EditDashboardDrawer`, `FreeTimeCalendar`.
- New page: trainer Courses rewrite.
- All persistence stays in Zustand + `localStorage` (no backend).
- Approval workflow is mock — admin clicks Approve in `Approvals.tsx` and batch flips status.

---

## Out of scope
- Real email sending, real VM control, real billing engine — all toasts/mocks.
- Nav color inversion (skipped).
- Student portal changes beyond #3 (quiz fix) and #20 (LMS-disabled hide).

Approve and I'll implement in one pass.
