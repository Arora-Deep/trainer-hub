# Self-Paced Templates & Batches

Two connected pieces:
1. A clear pipeline for trainers to **request** lab templates (from two entry points), with admin/CloudAdda team owning the **snapshot & publish** step.
2. A **dedicated self-paced batch wizard** distinct from the live-training one, plus a self-paced-aware Batch Details view.

---

## 1. Trainer request flow → admin publishes template

### Entry points (both feed the same pipeline)

**A. Labs → Templates page** (`src/pages/Labs.tsx`)
- Add a primary `Request a template` CTA in the header.
- Add a sub-tab/view "Pending requests" so trainer can see their own in-flight requests (status badge: Requested → Provisioning → Ready (configure) → Submitted for snapshot → Published).
- Once `published`, the resulting template appears in the main table with a small "From your sandbox" pill.

**B. Batch Details → VM area** (`src/pages/BatchDetails.tsx`)
- In the VM tab, when picking a template, add a `Need a different template?` inline action that opens the same request sheet, prefilled with the batch's course context.

Both reuse a single `RequestTemplateSheet` (right-side drawer per memory) — refactor from existing `RequestSandboxVM.tsx` into a sheet component so it works inline too.

### Trainer workspace: My Sandbox VMs (`src/pages/SandboxVMs.tsx`)
Keep as the trainer's working area. Card per sandbox showing status, console link, and a `Submit for snapshot` action (renames "Mark ready"). Once submitted, status moves to `validation` and is locked from further edits.

### Admin/CloudAdda queue (`src/pages/admin/SandboxVMRequests.tsx`)
Existing page; tighten the workflow into four columns / filters:
1. **New requests** → `Approve & Provision` or `Reject`
2. **Provisioning** → auto-advances to Ready
3. **Awaiting snapshot** (trainer submitted) → admin reviews, runs validation, then `Snapshot & Publish as template` (modal asks for template name, category, runtime limit; writes to `labStore.templates` with `source: "sandbox"` and `sourceSandboxId`)
4. **Published** → audit history

`sandboxVMStore` already supports the full state machine; just add a `submitForSnapshot` action (renames current `markReady` semantics — keep both for back-compat).

`labStore`: add optional fields on `LabTemplate`: `source?: "builtin" | "sandbox"`, `sourceSandboxId?`, `createdByTrainerId?`. No breaking changes.

### Notifications
- Trainer notification when status changes (Provisioning → Ready → Published / Rejected).
- Admin notification on new request.
Implemented via existing `notificationStore`.

---

## 2. Dedicated self-paced batch wizard

New page `src/pages/CreateSelfPacedBatch.tsx`, route `/batches/create-self-paced`. Live wizard stays at `/batches/create`. Add a chooser dialog on the Batches page "New batch" button → `Live cohort` vs `Self-paced batch`.

### Why a separate wizard
Self-paced has no schedule, no fixed seats, no trainer-led VM provisioning timeline. Instead it needs: enrollment window, access model, on-demand lab quotas, and template→lab mappings.

### Steps

**Step 1 — Basics**
- Name, description, linked course (required — must be a course whose lessons have on-demand labs attached).
- Tags, cover image.

**Step 2 — Access & enrollment**
- Enrollment mode: always-open / window (date range) / invite-only.
- Access model: `full-course` (X total VM hours per learner) or `lesson-unlock` (per-lesson cap).
- Total access hours / per-lab cap; expiry after first launch (days).
- Max concurrent learners (soft cap for cost projection).

**Step 3 — On-demand labs**
- Auto-lists every lab attached to the linked course's lessons.
- For each lab, shows the chosen template (from `labStore.templates`), per-launch runtime limit (defaults from template), max launches per learner, idle shutdown minutes.
- Inline `Request a template` if a lab still needs one — opens the same `RequestTemplateSheet`. Lab row shows "Awaiting template" status until published.
- Cannot advance to Review until every lab has a published template (or trainer explicitly marks lab as "manual provision later").

**Step 4 — Review & publish**
- Summary, cost estimate (concurrent learners × avg hours × node rate).
- `Save as draft` or `Publish self-paced batch`.

Writes to `batchStore.addBatch` with `deliveryMode: "self-paced"`, `enrollmentMode: "floating"`, plus a new optional `selfPacedConfig` blob: `{ accessModel, totalAccessHours, expiryDays, perLabCaps: [{ labId, runtimeLimit, maxLaunches, idleShutdownMin }] }`. Skips the live wizard's date-grid / seat fields.

### Self-paced Batch Details
On `BatchDetails.tsx`, when `deliveryMode === "self-paced"`, swap the tab set to:
- **Overview** — enrolled count, active sessions, hours consumed
- **Learners** — floating enrollment list, hours used / remaining, expiry
- **Labs** — per-lab template, runtime cap, launch count, currently-running VMs
- **Analytics** — completion %, avg time-on-lab, drop-off
- **Settings** — edit access model, caps, enrollment window
Hide the trainer-VM / snapshot / participant-VM tabs that only make sense for cohort batches.

---

## Technical summary

**New files**
- `src/pages/CreateSelfPacedBatch.tsx`
- `src/components/batches/SelfPacedLabsStep.tsx`
- `src/components/batches/SelfPacedOverviewTab.tsx`, `SelfPacedLearnersTab.tsx`, `SelfPacedLabsTab.tsx`
- `src/components/sandbox/RequestTemplateSheet.tsx` (reusable drawer; replaces page-only `RequestSandboxVM`)
- `src/components/batches/BatchTypeChooser.tsx` (live vs self-paced modal)

**Modified files**
- `src/App.tsx` — new route
- `src/pages/Labs.tsx` — `Request a template` CTA, "My pending requests" view
- `src/pages/BatchDetails.tsx` — inline request action; conditional self-paced tab set
- `src/pages/Batches.tsx` — chooser modal on "New batch"
- `src/pages/SandboxVMs.tsx` — `Submit for snapshot` action, status copy
- `src/pages/admin/SandboxVMRequests.tsx` — 4-stage swimlane, snapshot-publish modal
- `src/stores/sandboxVMStore.ts` — add `submitForSnapshot`
- `src/stores/labStore.ts` — add `source`, `sourceSandboxId`, `createdByTrainerId` on `LabTemplate`
- `src/stores/batchStore.ts` — add optional `selfPacedConfig`
- `src/stores/notificationStore.ts` — fire on status transitions

**Out of scope for this round** (will note as TODO): real BBB-like provisioning callbacks, billing meter wiring, per-learner cost breakdown UI.
