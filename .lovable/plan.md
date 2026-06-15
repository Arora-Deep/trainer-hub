# Mega Update Plan (Mock/UI only)

All changes are frontend-only (Zustand + local state, no Lovable Cloud). Skipping: nav color inversion, editable dashboard, reclone warning alerts.

---

## 1. Trainer Portal — Global VM Controls
In the trainer batch detail VM tab, add a sticky toolbar above the VM list:
- **Re-clone All** (confirm dialog)
- **Start All** / **Stop All**
- **Restore All to Initial State** (confirm dialog)
Toast feedback on each action; updates `batchStore` VM statuses in bulk.

## 2. Quiz Not Opening — Fix
Investigate `/quizzes/:id` route + `QuizDetails.tsx`. Likely a broken link / missing route from recent lesson-editor rewire (`createNewHref` → `/quizzes/create`). Fix routing and ensure quiz list "Open" action works.

## 3. Imports
Add an **Import** button (with dropdown menu or modal supporting JSON/CSV paste) on:
- Trainer **Courses** (import course content)
- Trainer **Quizzes** (import quiz)
- Trainer **Assignments** (import assignments)
Mock parser → adds items to respective Zustand stores. Includes "Download template" link.

## 4. VM Availability — 24h option
In trainer batch VM availability picker, add **24 Hours** preset. If user picks > 8 hours via slider/duration, auto-snap to "Full day (24h)" with a small inline hint.

## 5. Hide Pricing from Trainer
Pricing visible to Admin only. In trainer **Create Batch** VM step and review, hide ₹ cost columns/cards (gate via `roleStore.role === 'admin'`). Admin portal continues to show full costs.

## 6. Modify Batch — Resource Upgrade Mid-Batch
In **admin/ModifyBatch.tsx**, add new section **"Upgrade Resources"**: pick affected VMs (all / per-participant), choose new CPU/RAM tier (e.g. 2c/4g → 8c/16g), shows delta cost, confirm → updates batch + logs change in batch audit/timeline.

## 7. Admin — Node Selection for VMs
In admin Create Batch (VM step) and Provisioning flows, add **Target Node** dropdown (Auto / specific node from `Nodes` list) with capacity hints.

## 8. Enable VLAN per Batch
In admin Create Batch settings step add **Enable VLAN** toggle + VLAN ID input (mocked). Persist in batch settings.

## 9. Pre-Provisioned VM Option in Create Batch (Admin)
In VM step, add a third source alongside Template/Master: **"Use Pre-Provisioned VM"** — picks from a mock pool, skips template requirement.

## 10. Configurable VM Access Window (Trainer Prep)
When admin creates batch, trainer chooses **"When can I configure the VM?"** — relative to batch start (e.g. 2 days before / 7 days before / custom). Stored on batch; trainer portal respects this date.

## 11. Trainer Portal Courses Page — Proper Rebuild
Polish `/courses` (trainer): proper grid with cover, status chip, lesson count, last edited, search + filters (status, type), bulk select, primary "New Course" + "Import" CTAs. Match Apple-minimal design system.

## 12. VM Cost = Participants + 1 Trainer VM
Update cost calculations in admin Create Batch review and BatchProvisioning estimate to include +1 trainer VM. Show breakdown line.

## 13. Trainer Create Batch — Per-Participant Cost in Review
On the trainer Create Batch review step, show **Per Participant Cost** alongside **Total Cost** (admin sees both; trainer sees per-participant only per item 5? — clarify in build: keep per-participant visible since trainer needs to quote, hide raw infra ₹ tiers).

## 14. Clone Button Gating + Trainer Post-Batch Access
- Re-clone / clone actions disabled until **2 days before batch start** (tooltip explains).
- After batch is **marked done**, trainer can still open VM console **if their free-time VM availability window covers now**.

## 15. Approval Workflow + Draft Batches (Mock)
- New batch created in trainer portal saves as **Draft** (status badge).
- Sent for approval → admin portal **Approvals** queue shows it.
- On approval (mock click) → status flips to Active, provisioning unlocks.
- Visual states only; no real backend.

## 16. Bulk Add Participants
"Add Participant" button opens dialog with two tabs:
- **Single** (existing form)
- **Multiple** — paste CSV / bulk email list, preview rows, add all.

## 17. Billing Adjustments for Participant Changes
In admin Billing + batch detail, add a **Participant Adjustments** timeline (added/removed with date, prorated delta). Update displayed monthly usage to reflect adjustments (mock).

## 18. Email in Participant Details + Send VM Credentials Action
- Show email column in participant list + detail.
- In row action menu add **"Send VM Login via Email"** → opens preview dialog, mock send, success toast.

## 19. Disable LMS/Content View on Batch
In Create/Modify Batch settings, add toggle **"Hide LMS / Content View for students in this batch"**. Student portal respects flag (hides Courses tab when true).

## 20. Free Calendar Area
Add **Free Time** layer on trainer Schedule page — drag/click to block out "free / available" slots distinct from sessions. Visual differentiation; used by item 14 gating.

## 21. Live Training Console — VM Switch Buttons (Left Rail)
In `LiveClass.tsx` / live training console, add a left vertical rail listing batch VMs with quick **Switch** buttons (active VM highlighted). Mock switch updates active VM panel.

## 22. Trainer Portal — Student Login Details
On trainer participant detail, add **"Login Credentials"** card showing student username + masked password with reveal + copy, plus resend link.

---

## Technical Notes
- All state lives in existing Zustand stores; extend `batchStore`, `trainerStore`, `meetingStore`, plus add fields: `batch.status = 'draft' | 'pending_approval' | 'active' | 'completed'`, `batch.vlan`, `batch.targetNode`, `batch.trainerPrepDate`, `batch.hideLMS`, `batch.participantAdjustments[]`, `participant.email`, `participant.vmCredentials`.
- Cost helper `calcBatchCost(seats, tier)` → `(seats + 1) * tierPrice` used everywhere.
- Role gating uses existing `roleStore`.
- New shared components: `BulkVMActionsBar`, `ImportDialog`, `ResourceUpgradeDialog`, `SendCredentialsDialog`, `VMSwitcherRail`.

## Out of Scope (per your reply)
- Nav color inversion
- Editable/customizable dashboard
- Reclone warning alerts

Ready to implement on approval.