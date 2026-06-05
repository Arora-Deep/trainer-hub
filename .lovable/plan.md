# Implementation Plan

Breaking the request into two portals. Each item is scoped to UI + store updates only (mock data, no backend).

## Trainer Portal

1. **Global VM controls in Live Training student view** (`src/pages/LiveTraining.tsx`)
  - Add a toolbar above the participant list: "Start All", "Stop All", "Reclone All", "Restore All to Snapshot".
  - Each action shows a confirm dialog. Reclone confirm includes a warning: *"Re-cloning repeatedly degrades host performance and resets all participant work. Use sparingly."*
  - Toast alerts on completion ("Reclone queued for N VMs").
  - Also add per-row actions menu with same options for single VM.
2. **Quiz not opening** — investigate `src/pages/Quizzes.tsx` / quiz detail route. Likely a broken link/import. Fix the click handler / route.
3. **Import buttons**
  - Quizzes page: "Import Quiz" button → dialog accepting JSON/CSV (mock, just toast success and add a stub item).
  - Assignments page: "Import Assignment" button (same pattern).
  - Course content editor: "Import Content" button in `CourseContentEditor.tsx` (accepts a JSON outline, mock import).
4. **24-hour option in VM availability times** — find the availability time picker (likely in batch create/settings VM schedule, `VMDaySchedule.tsx` or batch settings). Add a "24 hours (always on)" preset toggle alongside the time range inputs. do this for the admin and trianer vm. 

## Admin Portal

5. **Hide VM cost pricing from non-finance roles**
  - In `AdminCreateBatch.tsx` (VM cost step) gate price columns behind a role check (`useRoleStore`/auth role). For now: hide if `role !== 'super_admin' && role !== 'finance'`. Show "—" with tooltip "Pricing restricted".
6. **Modify batch — resize VM resources mid-batch** (`src/pages/admin/ModifyBatch.tsx`)
  - Add a new section "Resize VM Resources" with current vs new CPU/RAM/Disk pickers and an "Apply to all participant VMs" action. Mock: update vmConfig, toast "Resize scheduled — VMs will reboot in maintenance window."
7. **Node selection when assigning VMs** (`src/pages/admin/AssignVM.tsx`)
  - Add a "Target Node" select (mock node list: node-a-01, node-a-02, node-b-01, "Auto-balance") shown above the assign actions. Also show node in the table column.
8. **Enable VLAN toggle for batch** — in batch create wizard (network/advanced step), add a "Enable VLAN" switch sitting alongside existing Enable QEMU / nested virt toggles. Look in `AdminCreateBatch.tsx` or `CreateBatch.tsx`.

## Out of Scope

- Real backend wiring, real RBAC, persisted imports.
- Drag-and-drop in imports; just file picker + toast.

## Files (anticipated)

- Trainer: `LiveTraining.tsx`, `Quizzes.tsx` (+ quiz detail route check), `Assignments.tsx`, `CourseContentEditor.tsx`, `VMDaySchedule.tsx`/batch settings.
- Admin: `AdminCreateBatch.tsx`, `ModifyBatch.tsx`, `AssignVM.tsx`, possibly `CreateBatch.tsx`.