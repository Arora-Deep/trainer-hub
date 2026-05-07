
## Goal

Make admin-side batch and lab management actually do something. Today the admin Create Batch is a thin 4-step shell with hard-coded templates, and Modify Batch / Replace VM / Reset Lab / Reset Password / Assign VM / Templates are mock pages whose buttons only show toasts. Real state lives in `useBatchStore`, `useLabStore`, `useCustomerStore`. We will rewrite the admin pages on top of the trainer Create Batch wizard (`src/pages/CreateBatch.tsx`), with admin-only extras, and hook every action to the stores so changes show up everywhere (admin batch list, customer detail, trainer batch detail, etc.).

## 1. AdminCreateBatch — same as trainer wizard, plus admin power

Rewrite `src/pages/admin/AdminCreateBatch.tsx` to use the same step/UX as `src/pages/CreateBatch.tsx` (Basic Info → Schedule → VMs → Review), driving `useBatchStore.addBatch` and `LabStore` so the new batch appears in `AllBatches`, `AdminBatchDetail`, `CustomerDetail` Batches tab, and the trainer `Batches` page.

Reuse trainer pieces directly: `VMDaySchedule`, `TemplatePickerDropdown`, the same pricing logic, same `VMConfig` shape, same approval flow.

Admin-only additions on top of the trainer flow:
- **Step 0 / Customer**: required Customer picker (`useCustomerStore`). Pre-selected and locked when `?customerId=` is in the URL (already supported).
- **Step 1 (Basic)**: extra fields — Region (`ap-south-1` etc.), Resource Pool / Cluster, Tags, Internal Cost Center, Auto-extend toggle.
- **Step 2 (Schedule)**: extra fields — Prep Period override (default 2 days, editable), Maintenance Window opt-out, Office-hours override.
- **Step 3 (VMs)**: alongside trainer template picker, allow per-VM override of vCPU/RAM/Disk/GPU and choice between Template, ISO, or Customer Rate-Card profile (read from `customerStore.rateCard.vmConfigs`). Add "Skip approval" toggle (admins only) which sets both approval flags to `approved` immediately.
- **Step 4 (Review)**: show pricing using customer rate card with stacked discounts (volume + duration tiers) instead of flat $50/VM/day.

On submit, call `addBatch(...)` with the full `VMConfig` (matching trainer behavior), then navigate to `/admin/batches/{newId}`.

## 2. ModifyBatch — make it actually modify

Rewrite `src/pages/admin/ModifyBatch.tsx` to read from `useBatchStore.batches` (not the local `const batches`) and write through `updateBatch`.

- Batch picker filtered by `?customerId=`/`?batchId=`.
- Editable fields: name, description, end date (extend), seat count, additional details, course, instructors, published/cert flags. Save → `updateBatch(id, ...)`.
- Right-side action buttons wired to existing store actions: Pause/Resume → `updateBatch({ status })`; Complete → `updateBatch({ status: "completed" })`; Extend → opens date picker that updates `endDate`; Reset All Labs → `resetAllVMs`; Reclone All → `recloneAllVMs`; Take Snapshot → `createSnapshot`; Set Golden → `setGoldenSnapshot`; Delete Batch → `deleteBatch` then navigate back.
- Confirmation dialogs for destructive actions (Pause, Complete, Delete, Reset All).

## 3. ReplaceVM — drive batchStore

Rewrite `src/pages/admin/ReplaceVM.tsx` to enumerate every batch's `participantVMs` from `useBatchStore`. The "Replace VM" button calls `recloneParticipantVM(batchId, vmId)` and disappears from the row when status flips to running. Add filters by customer, batch, status; bulk-replace selection; show node/IP from store.

## 4. ResetLab — drive batchStore

Rewrite `src/pages/admin/ResetLab.tsx` to source batches and snapshots from `useBatchStore`. "Reset to Snapshot" → `resetParticipantVM`; "Reset All" → `resetAllVMs`; "Restart" → `restartParticipantVM`; add "Stop/Start" via `stopParticipantVM`/`startParticipantVM`. Snapshots tab inside the page can `createSnapshot` / `setGoldenSnapshot` / `deleteSnapshot`.

## 5. AssignVM — drive batchStore

Rewrite `src/pages/admin/AssignVM.tsx`:
- Customer + batch dropdown drive a participants list from `getBatch(batchId).participants`.
- Per-row "Assign VM" → adds an entry in `vmConfig.participantVMs` (extend store with `assignParticipantVM(batchId, participantId, vmName, ipAddress)` if missing) and updates the participant's `vmStatus`/`vmIpAddress`.
- "Auto Assign" loops over unassigned participants. "Bulk Assign" with checkbox selection.
- "Replace" on failed rows uses `recloneParticipantVM`.

## 6. Templates / CreateLabTemplate — persist

`src/pages/admin/Templates.tsx`:
- Replace local `const templates` with `useLabStore.templates`.
- "Create Template" button navigates to `/labs/create-template` (existing `CreateLabTemplate` page) with `?returnTo=/admin/labs/templates`.
- Row actions hit `updateTemplate` (Save in drawer), `deleteTemplate` (Deprecate), and a duplicate that calls `addTemplate` with a copy.

`src/pages/CreateLabTemplate.tsx` — confirm it already calls `useLabStore.addTemplate`; if it doesn't, wire it. Honor `?returnTo` so admin lands back on `/admin/labs/templates` after create.

## 7. ResetPassword — wire to a user list

Rewrite `src/pages/admin/ResetPassword.tsx` to search across all batch participants (across all customers). Selecting a result shows their batch/customer. "Reset Password" generates a temp password (mock string), shows it in a dialog with copy button, and toasts. No store mutation required (no password field today), but the action persists a `lastPasswordReset` timestamp on the participant via a new `updateParticipant` extension.

## 8. Reflection across the app

Every action above mutates the same Zustand stores already consumed by:
- `src/pages/admin/AllBatches.tsx`, `AdminBatchDetail.tsx` — batch list / detail
- `src/pages/admin/CustomerDetail.tsx` Batches & VMs tabs
- `src/pages/Batches.tsx`, `BatchDetails.tsx` (trainer)
- `src/pages/admin/LabInstances.tsx`, `Templates.tsx`

So creating a batch in the admin portal will instantly show up in the trainer's batch list, the customer's batch tab, and the admin batch list — no extra plumbing needed.

## Files to change

- Rewrite: `src/pages/admin/AdminCreateBatch.tsx`, `src/pages/admin/ModifyBatch.tsx`, `src/pages/admin/ReplaceVM.tsx`, `src/pages/admin/ResetLab.tsx`, `src/pages/admin/AssignVM.tsx`, `src/pages/admin/Templates.tsx`, `src/pages/admin/ResetPassword.tsx`
- Touch: `src/stores/batchStore.ts` (add `assignParticipantVM`, extend `updateParticipant` with `lastPasswordReset`)
- Touch: `src/pages/CreateLabTemplate.tsx` (honor `?returnTo`, ensure persistence)

## Out of scope

- No backend / Lovable Cloud yet — all state stays in Zustand (matches current architecture).
- No new routes; only the existing admin routes are reused.
