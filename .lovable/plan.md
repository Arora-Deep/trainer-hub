# Admin Infra & Lab Controls — Implementation Plan

All UI-only / mock data, extending existing Zustand stores. Follows existing Apple-minimalist patterns (right-side drawers, sticky headers, status chips).

---

## 1. Node VM Pool & Assignment

**New page:** `src/pages/admin/NodeVMPool.tsx` (route `/admin/infra/node-vms`)
- Filter bar: Node, Region, Status, Customer, Batch, "Unassigned only"
- Table columns: VM Name · Node · vCPU/RAM/Disk · OS · IP · Status chip · Assigned to (student / batch / —) · Actions
- Bulk selection with sticky action bar: **Assign to Student**, **Assign to Batch**, **Reassign**, **Release**
- Assign drawer (right side): pick Customer → Batch → one/many Students (multi-select) or "Entire batch"; shows VM count vs. participant count with mismatch warning; reason field; confirm

**Node drill-down:** extend `src/pages/admin/Nodes.tsx`
- Row click opens existing node detail; add new **"VMs on this node"** tab that embeds the same `<NodeVMTable />` component scoped to that node, with the same assign drawer

**Shared component:** `src/components/admin/NodeVMTable.tsx` + `AssignVMDrawer.tsx` so both views stay in sync.

**Store:** extend `labStore.ts` with a `nodeVMs: NodeVM[]` collection and `assignNodeVM(vmId, target)` / `releaseNodeVM(vmId)` actions. Mock ~40 VMs across 5 nodes.

---

## 2. Self-Paced Lab Template Provisioning

Two entry paths converging into one pipeline:

**Path A — Direct provision (admin-initiated)**
- New action on `src/pages/admin/Customers.tsx` row & customer detail: **"Provision Sandbox VM for Trainer"**
- Opens drawer: pick Trainer (from customer's trainer list), base OS / size / region, purpose note → creates a `SandboxVM` in status `provisioning`

**Path B — Trainer request (request-first)**
- Trainer portal: new page `src/pages/RequestSandboxVM.tsx` (link in Labs sidebar) — form: desired OS, size, software notes, target self-paced course
- Lands in new admin queue `src/pages/admin/SandboxVMRequests.tsx` (route `/admin/infra/sandbox-requests`)
- Admin **Approve & Provision** → same pipeline as Path A

**Pipeline status chip:** `Requested → Provisioning → Ready (trainer configuring) → Validation → Snapshot → Published`
- Trainer side: `src/pages/SandboxVMs.tsx` lists their sandbox VMs with **Open Console**, **Mark Ready for Snapshot**
- Admin side: detail drawer with **Snapshot & Promote to Template** button → creates new `LabTemplate` (kind: `self_paced`) in `labStore.templates`, auto-attaches to trainer's available templates, marks VM `Published`

**Store:** new `sandboxVMStore.ts` (requests + sandbox VMs + status history) and a `kind?: 'self_paced' | 'instructor_led'` flag on `LabTemplate`.

---

## 3. Extra-Time Overrides (4 scopes)

Single reusable drawer `src/components/admin/ExtendTimeDrawer.tsx` invoked from each scope's row action. Inputs: hours to add (1/2/4/8/custom), reason (required), notify trainer toggle.

- **Per-VM** — action button on `src/pages/admin/VMManagement.tsx` row and `AssignVM.tsx`
- **Per-batch (all VMs)** — action in `src/pages/admin/AdminBatchDetail.tsx` header overflow menu; applies bonus hours to every VM in batch
- **Per-session/day window** — control in `src/components/batches/VMDaySchedule.tsx` (admin-only) to extend today's availability window (+1/2/3h)
- **Template runtimeLimit override (per customer)** — on customer detail, "Template Overrides" section to bump `runtimeLimit` for a template scoped to that customer; stored as `templateOverrides: { customerId, templateId, runtimeLimit }[]` in `labStore`

**Audit logging:** every extend / assign / promote / release action calls a shared `logAdminAction(actor, action, target, reason)` helper writing to a `useAuditStore` (or extend existing `notificationStore`). Visible in `src/pages/admin/AuditLogs.tsx` via the existing log table — add filter chips for new action types.

---

## Technical Summary

- **New files:** `pages/admin/NodeVMPool.tsx`, `pages/admin/SandboxVMRequests.tsx`, `pages/RequestSandboxVM.tsx`, `pages/SandboxVMs.tsx`, `components/admin/NodeVMTable.tsx`, `components/admin/AssignVMDrawer.tsx`, `components/admin/ExtendTimeDrawer.tsx`, `stores/sandboxVMStore.ts`, `lib/auditLog.ts`
- **Modified:** `labStore.ts` (nodeVMs, templateOverrides, template.kind), `App.tsx` (routes), `AppSidebar.tsx` (admin: Infra → Node VM Pool, Sandbox Requests; trainer: Labs → Request Sandbox VM, My Sandbox VMs), `Nodes.tsx`, `VMManagement.tsx`, `AdminBatchDetail.tsx`, `AssignVM.tsx`, `VMDaySchedule.tsx`, `Customers.tsx`/`CustomerDetail.tsx`, `AuditLogs.tsx`
- **No backend** — all mock data, Zustand persistence, follows existing role-gating via `roleStore`
