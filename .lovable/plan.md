

## Plan: Overhaul VM Management in Batches + Upgrade Live Training + Resolve Labs Page Role

### The Problem

1. **Batch Details VMs tab** — Has the Provision → Configure → Clone workflow but the Student VMs table is bare (no per-student actions like reclone, reset to snapshot, open console, restart).
2. **Labs page** (`/labs`) — Currently a separate page showing lab instances and templates from `labStore`. It overlaps with the VMs tab in Batches and the Live Training page. It has no clear purpose for trainers since VMs are managed per-batch.
3. **Live Training page** — Has student VM grid with hover actions (console, view screen, restart, reset) but missing: reclone a single student's VM, snapshot management (choose which snapshot to reset to), trainer console Sheet (currently opens external link), and proper snapshot listing.

### What Changes

#### 1. Remove standalone Labs page from trainer nav
The Labs page (`/labs`) duplicates functionality. Replace the sidebar entry with a redirect or repurpose it as a "Lab Templates" browser (read-only catalog of available templates). The actual VM management lives in Batches and Live Training.

#### 2. Batch Details — VMs Tab Upgrade
Enhance the existing VMs tab with comprehensive per-student VM actions:

- **Snapshot Management Panel**: Below the trainer workflow, add a card listing all snapshots (from `vmConfig.snapshots`) with name, date, size, status, and a "Set as Golden" button. Include a "Create Snapshot" dialog.
- **Student VMs Table — Rich Actions Column**: Replace the single ghost button with a dropdown menu per student VM containing:
  - Open Console (opens Sheet with terminal preview + connection info)
  - Copy SSH command
  - Restart VM
  - Stop / Start VM
  - Reset to Snapshot (sub-menu listing available snapshots)
  - Reclone from Golden (destroys current VM, creates fresh clone)
- **Bulk Actions Bar**: When checkboxes are selected, show a sticky bar with "Reset All Selected", "Restart All Selected", "Reclone All Selected"
- **Status indicators**: Add CPU/RAM progress bars inline in the table

#### 3. Live Training — Full VM Command Center
Upgrade the existing page to be the trainer's complete operational hub:

- **Trainer Console Sheet**: Instead of `window.open`, clicking "Console" opens a `Sheet` with a full simulated terminal (dark bg, monospace, scrollable command history), connection details (IP, SSH command, credentials with show/hide), and action buttons (Restart, Snapshot, Stop).
- **Per-Student VM Actions Enhancement**: The student detail `Sheet` (already exists) gets additional actions:
  - **Reclone VM**: Button that triggers a confirmation dialog, then reclones from the golden snapshot
  - **Reset to Snapshot Selector**: Replace the single "Reset to Snapshot" button with a `Select` dropdown listing all available snapshots by name, with a "Reset" button
  - **Take Snapshot of Student VM**: Save current state of a specific student's VM
  - **View Logs**: Expandable section showing last 20 lines of VM logs
- **Snapshot Quick Panel**: Add a collapsible card in the left column showing all batch snapshots with one-click "Reset All to This" per snapshot
- **Mass Actions Enhancement**: Add "Reclone All" button to the session control bar alongside existing Lock/Snapshot/Restart buttons

#### 4. Sidebar Navigation Update
- Rename "Labs" to "Lab Templates" in trainer sidebar, pointing to a simplified template browser
- Or remove it entirely if templates are only relevant during batch creation

### Files Modified
- `src/pages/BatchDetails.tsx` — Rewrite VMs tab with snapshot panel, rich per-student actions, bulk actions
- `src/pages/LiveTraining.tsx` — Add trainer console Sheet, enhance student Sheet with reclone/snapshot selector/logs, add snapshot quick panel
- `src/components/layout/AppSidebar.tsx` — Update or remove Labs nav item for trainer role
- `src/stores/batchStore.ts` — Add `recloneStudentVM` and `snapshotStudentVM` actions
- `src/pages/Labs.tsx` — Simplify to template browser or remove

### Technical Details
- Snapshot selector uses existing `vmConfig.snapshots` array from batchStore
- Reclone action calls a new `recloneStudentVM(batchId, vmId)` store method that resets the VM entry and marks it as "provisioning" then transitions to "running"
- Console Sheet reuses the existing terminal mock lines pattern from LiveTraining
- No new dependencies needed

