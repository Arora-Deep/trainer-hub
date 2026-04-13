

## Plan: Enhance Trainer VM Actions + Convert Template Picker to Filtered Dropdown

### Changes

#### 1. Trainer VM — Reclone from Snapshot + More Actions (LiveTraining.tsx)

In the **Trainer VM Card** (left column, lines 369-383) and the **Trainer Console Sheet** (lines 1000-1014), add:

- **Reclone from Snapshot selector**: A `Select` dropdown listing all available snapshots, with a "Reclone" button that destroys the trainer VM and rebuilds it from the chosen snapshot
- **Reset to Snapshot**: Same dropdown pattern but resets without destroying (preserves VM, restores disk state)
- **Power On/Off toggle**: Stop/Start button based on current status
- **Take Named Snapshot**: Dialog to create a snapshot with a custom name
- **Copy RDP command** (for Windows VMs)
- **Download SSH Key** button

Also enhance the Trainer Console Sheet with the same reclone/reset-to-snapshot controls.

#### 2. Template Picker — Replace Cards with Filtered Dropdown (TemplatePickerGrid.tsx → TemplatePickerDropdown.tsx)

Create a new `TemplatePickerDropdown` component that replaces the card grid with:

- A `Select`-style dropdown showing the selected template name + key specs inline
- **Filter controls above the dropdown**: OS type (Linux/Windows), Cloud Provider (AWS/Azure/GCP/DO), Category
- When a template is selected, show a compact summary row below with vCPU, RAM, Storage, Runtime, and Region
- Replace usage in `CreateBatch.tsx` and `AdminBatchDetail.tsx`

#### 3. batchStore — Add trainer VM reclone/reset methods

Add `recloneTrainerVM(batchId, snapshotId)` and `resetTrainerVM(batchId, snapshotId)` to the batch store.

### Files Modified

| File | Change |
|------|--------|
| `src/pages/LiveTraining.tsx` | Add trainer reclone/reset-to-snapshot selector in VM card + Console Sheet |
| `src/components/labs/TemplatePickerDropdown.tsx` | New — filtered dropdown replacing card grid |
| `src/components/labs/TemplatePickerGrid.tsx` | Keep for backward compat but no longer used |
| `src/pages/CreateBatch.tsx` | Swap `TemplatePickerGrid` → `TemplatePickerDropdown` |
| `src/pages/admin/AdminBatchDetail.tsx` | Swap `TemplatePickerGrid` → `TemplatePickerDropdown` |
| `src/stores/batchStore.ts` | Add `recloneTrainerVM`, `resetTrainerVM` methods |

