# Direct Trainer VM Assignment

Right now, giving a trainer their VM in a batch always requires the full lifecycle: Provision Admin VM → Configure → Snapshot → Clone. Many training companies just want us to hand over a fully-prepared VM. We need a shortcut path.

## What we're adding

In the admin batch detail's **Labs & VMs** tab, next to the existing "Provision Admin VM" flow, add a second option:

**"Assign an existing VM as Trainer VM"** — pick a VM from the node VM pool (or create a fresh one) and hand it directly to the trainer, skipping configure/snapshot/clone.

The trainer then sees this VM in their batch's VM area just like any other trainer machine.

## Flow

Admin batch detail → Labs & VMs tab → Admin VM section shows two side-by-side options when `trainerVMStatus === "not_provisioned"`:

1. **Standard lifecycle** (existing) — Provision → Configure → Snapshot → Clone
2. **Direct assign (new)** — "Already have a VM prepared? Assign it directly"

Clicking (2) opens a right-side drawer:

- **VM source** toggle:
  - *Pick from pool* — search the Node VM Pool by ID / name / IP (only unassigned, running VMs)
  - *Create new* — mini form (name, template, region, node auto-place) that provisions and immediately marks ready
- **Assignment note** (optional, audit) — e.g. "Customer provided pre-configured image"
- **Confirm** button → sets the batch's `trainerVM` to `status: "configured"` (skips provisioning/running steps) with the chosen VM's IP, credentials, and console URL, and links the pool VM to this batch as "Trainer Master" purpose.

Result: the Admin VM card immediately shows the VM as ready (green, "Configured"), console-open button available, and the trainer portal batch view surfaces it as the assigned trainer VM.

## Technical notes

- **Store change** (`src/stores/batchStore.ts`): add `assignTrainerVMDirect(batchId, { vmId?, vmName, ipAddress, credentials, consoleUrl, note })` that patches `vmConfig.trainerVM` to `status: "configured"` with the supplied fields, records to audit log, and (if `vmId` provided) calls `useNodeVMStore.assign()` to link that pool VM to the batch as trainer.
- **New component** `src/components/admin/AssignTrainerVMDrawer.tsx` — right-side drawer with the two-mode form (pick / create), search over `useNodeVMStore` filtered by `!customerId && status === "running"`, and create form mirroring the compact fields from `VMManagement`.
- **Edit** `src/pages/admin/AdminBatchDetail.tsx` — in the Admin VM Lifecycle card, when `trainerVMStatus === "not_provisioned"`, render a secondary "Assign existing VM" button opening the drawer. When directly assigned, hide the Configure/Snapshot lifecycle steps (or mark them all done) since cloning to students still works via the existing "Clone to students" action from the trainer VM's current state.
- No trainer portal changes needed — it already reads `vmConfig.trainerVM` and will show the newly-assigned VM automatically.

## Out of scope

- Changing the standard provision-configure-snapshot-clone workflow.
- Bulk trainer VM assignment across multiple batches.
- Changing how student/participant VMs are provisioned.
