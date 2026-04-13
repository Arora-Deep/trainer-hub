

## Plan: Supercharge the CloudAdda Admin Portal

### What This Plan Covers

The admin portal already has strong foundations. This plan fills the operational gaps so it can truly handle everything end-to-end: managed provisioning on behalf of customers, a real-time notification system, enhanced batch requests with approval workflows, enriched support tickets with threaded conversations, and several new missing pages/features.

### Changes Overview

#### 1. Managed Provisioning for Customers (Admin provisions VMs on behalf of trainer)
**File**: `src/pages/admin/AdminBatchDetail.tsx`

Add a "Provision on Behalf" workflow to the Labs & VMs tab:
- A prominent "Provision for Customer" button that lets an admin run the full Provision → Configure → Snapshot → Clone workflow on behalf of a customer who doesn't want to do it themselves
- When the admin provisions, it sets a flag `provisionedBy: "admin"` so it's visible in the trainer portal as "Provisioned by CloudAdda"
- The trainer portal's BatchDetails page will show a read-only "Managed by CloudAdda" badge on the VMs tab when this flag is set, with a "Request Changes" button instead of direct VM controls

**File**: `src/stores/batchStore.ts`
- Add `provisionedBy` field to `vmConfig` (either `"admin"` or `"trainer"`)

#### 2. Real-Time Notification Center
**File**: `src/components/layout/AppHeader.tsx`

Upgrade the notification bell from hardcoded 3 items to a dynamic system:
- Pull counts from stores: pending batch requests, open tickets, active alerts, failed provision jobs, overdue invoices
- Group notifications by category with tabs: All, Requests, Tickets, Alerts, Billing
- Each notification is clickable and navigates to the relevant page
- Show a red badge with total unread count
- Add a "Mark all read" action and per-item dismiss

**File**: `src/stores/notificationStore.ts` (new)
- Centralized notification state that aggregates from customerStore data
- Types: `batch_request`, `ticket`, `alert`, `provision_failure`, `billing`, `system`
- Each notification has: id, type, title, description, timestamp, read status, link

#### 3. Enhanced Batch Requests Page
**File**: `src/pages/admin/BatchRequests.tsx`

Major upgrade from the current basic table:
- **KPI cards** at top: Pending, Approved This Month, Rejected This Month, Avg Response Time
- **Filters**: By customer, request type, status, date range
- **Approval workflow in Sheet**: When reviewing a request, show the full context — customer health score, current resource usage vs quota, batch details, and impact analysis (e.g., "Approving this will use 75% of their CPU quota")
- **Admin notes & internal comments**: Text area for adding resolution notes before approving/rejecting
- **Auto-provision option**: For "Extend Batch" or "Extra VM" requests, an "Approve & Provision" button that immediately triggers provisioning
- **Request types expansion**: Add `vm_provisioning` (customer wants CloudAdda to provision), `batch_extension`, `seat_increase`, `lab_reset`, `resource_upgrade`

**File**: `src/stores/customerStore.ts`
- Expand `TenantRequest` type with new request types and add `adminNotes`, `resolvedAt`, `resolvedBy` fields

#### 4. Enhanced Support Tickets Page
**File**: `src/pages/admin/Tickets.tsx`

Transform from a flat table into a proper help desk:
- **KPI row**: Open, In Progress, Avg Resolution Time, SLA Breached count
- **Ticket Detail Sheet** (right-side drawer): Full conversation thread with messages from customer and admin, internal notes (visible only to staff), attachments list
- **SLA timer**: Visual countdown showing time remaining before SLA breach, with color changes (green → yellow → red)
- **Quick actions**: Assign to team member, escalate, merge with another ticket, link to incident
- **Reply composer**: Rich text area with canned responses dropdown and "Send & Close" / "Send & Keep Open" buttons
- **Status workflow**: open → in_progress → waiting → resolved → closed with clear transitions

#### 5. Enhanced Alerts Page with Error Tracking
**File**: `src/pages/admin/Alerts.tsx`

Upgrade from a basic table:
- **Severity summary cards**: Critical (red pulse), Major, Warning, Info counts
- **Alert detail Sheet**: Full context — impacted customers, impacted batches, related incidents, suggested runbook, timeline of status changes
- **Auto-link to incidents**: Group related alerts into incidents automatically
- **Acknowledge & Assign**: Assign alerts to team members, add investigation notes
- **Error log viewer**: Expandable section showing related system logs for infrastructure alerts

#### 6. New: Provisioning Queue Page (Enhanced)
**File**: `src/pages/admin/ProvisioningQueue.tsx`

The existing page likely needs enhancement:
- Real-time job status with progress indicators
- Group by customer/batch for easier monitoring
- Retry failed jobs with one click
- Cancel queued jobs
- Show resource allocation preview before provisioning starts
- "Provision for Customer" shortcut that opens the managed provisioning flow

#### 7. Admin Dashboard — Live Notification Indicators
**File**: `src/pages/admin/Dashboard.tsx`

- Add pulsing indicators on KPI cards that have actionable items (e.g., red pulse on "Open Tickets" if any are critical)
- Add a "Needs Attention" section below KPIs showing: pending batch requests, SLA-breaching tickets, failed provision jobs needing retry
- Quick action buttons inline: "Review" → navigates to the item

#### 8. Sidebar Notification Badges
**File**: `src/components/layout/AppSidebar.tsx`

- Show count badges on nav items: Batch Requests (pending count), Tickets (open count), Alerts (active critical count)
- Red dot indicator for sections with critical items

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/stores/notificationStore.ts` | Create — centralized notification aggregation |
| `src/pages/admin/BatchRequests.tsx` | Major rewrite — KPIs, filters, approval workflow Sheet, auto-provision |
| `src/pages/admin/Tickets.tsx` | Major rewrite — ticket threads, SLA timers, reply composer |
| `src/pages/admin/Alerts.tsx` | Major rewrite — severity cards, detail Sheet, acknowledge flow |
| `src/pages/admin/Dashboard.tsx` | Enhance — pulse indicators, "Needs Attention" section |
| `src/pages/admin/AdminBatchDetail.tsx` | Add "Provision on Behalf" workflow |
| `src/components/layout/AppHeader.tsx` | Upgrade notification dropdown with categories and dynamic counts |
| `src/components/layout/AppSidebar.tsx` | Add notification count badges on nav items |
| `src/stores/customerStore.ts` | Expand TenantRequest type, add ticket thread data |
| `src/stores/batchStore.ts` | Add `provisionedBy` field |

### Implementation Order
1. Notification store + Header upgrade + Sidebar badges (foundation)
2. Batch Requests page rewrite + customerStore expansion
3. Tickets page rewrite with threads and SLA
4. Alerts page rewrite with detail sheets
5. Dashboard "Needs Attention" section
6. AdminBatchDetail "Provision on Behalf" workflow + batchStore update

