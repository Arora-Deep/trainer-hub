

## Plan: Admin VM Lifecycle — Provision → Console → Snapshot → Clone

### Problem
The current Admin VM workflow has no timing logic (it can be provisioned anytime) and the console interaction is just a dead link. The user wants:
1. Admin VM provisioning only allowed **2 days before** batch start date (free prep period)
2. A working console experience (embedded or simulated) to set up the environment
3. Clear flow: Provision → Open Console → Configure → Snapshot → Set Golden → Clone to all students
4. Reset any student VM (or all) to any snapshot state

### Changes

#### 1. Batch Store — Add prep period logic
**File: `src/stores/batchStore.ts`**
- Add a `prepStartDate` computed field (batch start - 2 days) to the `VMConfig` or derive it in UI
- Update `provisionTrainerVM` to store prep window metadata
- Add a `trainerVM.consoleUrl` field (simulated as `noVNC`-style URL like `https://console.cloudadda.io/vm/{id}`)
- Ensure `trainerVM` status flow: `not_provisioned` → `provisioning` → `running` → `configured` → `snapshotted`

#### 2. AdminBatchDetail — Rewrite Admin VM card with prep period enforcement
**File: `src/pages/admin/AdminBatchDetail.tsx`**
- Calculate `prepDate = subDays(batchStartDate, 2)` and `today = new Date()`
- Show a countdown/info banner: "Admin VM can be provisioned from {prepDate}" when too early
- Disable "Provision" button if `today < prepDate`, show when it becomes available
- When provisioned and running, show a prominent **"Open Console"** button that opens a dialog/drawer simulating a terminal/console session (a dark-themed panel with connection info: IP, credentials, SSH command, and an iframe placeholder for noVNC)
- Console panel shows: VM IP, root password (masked with reveal), SSH command copyable, and a large "Open in New Tab" button
- After console work, user clicks **"Mark as Configured"** → status moves forward
- After configured, **"Take Snapshot"** dialog captures name + description
- Once a golden snapshot exists, **"Clone to All Students"** becomes active with a confirmation dialog showing seat count and estimated time
- Add visual timeline showing the prep period on the Schedule tab

#### 3. AdminCreateBatch — Show prep period info
**File: `src/pages/admin/AdminCreateBatch.tsx`**
- In the Review step (step 4), show the calculated prep window: "Admin VM available from {startDate - 2 days}"
- Add a note in the environment step explaining the 2-day prep period

#### 4. Console Dialog Component
**Built inline in AdminBatchDetail.tsx** (or extracted if large)
- A `Dialog` or `Sheet` that renders:
  - Dark background panel simulating a console
  - Connection details: IP address, SSH port, credentials
  - Copy-to-clipboard buttons for SSH command
  - "Open Full Console" button (opens `#` in new tab, representing noVNC)
  - Status indicators (connected/disconnected)

#### 5. Reset flow improvements
- In the Snapshots tab and Reset dialog, show snapshot timestamps and which state each represents
- "Reset to Snapshot" dropdown clearly shows golden vs regular snapshots
- Bulk reset confirms with "This will restart X VMs"

### Technical Details

**Prep period calculation:**
```typescript
import { subDays, isAfter, isBefore } from "date-fns";
const batchStart = new Date(batch.startDate);
const prepDate = subDays(batchStart, 2);
const canProvision = isAfter(new Date(), prepDate) || isEqual(new Date(), prepDate);
```

**Console dialog state:** New `consoleOpen` boolean state. The dialog shows connection info pulled from `vmConfig.trainerVM.ipAddress` and a generated password.

**Files modified:**
- `src/stores/batchStore.ts` — Add `consoleUrl`, `credentials` to trainerVM, prep period awareness
- `src/pages/admin/AdminBatchDetail.tsx` — Rewrite Admin VM card, add console dialog, prep period enforcement, improved snapshot/clone flow
- `src/pages/admin/AdminCreateBatch.tsx` — Show prep period info in review step

