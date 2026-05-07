## Scope
All changes target `src/pages/admin/CustomerDetail.tsx` plus light edits to `AdminCreateBatch.tsx`, `ModifyBatch.tsx`, `BatchProvisioning.tsx`, and `Tickets.tsx` so existing pages can accept a preselected customer via query string.

## 1. Batches tab — drill-down opens a real batch detail view
- Clicking a batch row (currently opens a Sheet) instead navigates to `AdminBatchDetail` (`/admin/batches/:id`) so admins use the same rich page they already know.
- The Sheet is replaced by direct routing; `selectedBatch` state and its sheet are removed.
- "Provision Batch" / "Create Batch" buttons link to `/admin/batches/new?customerId={id}` (no inline duplicate wizard).

## 2. VMs tab — complete admin VM action set
For each row in the customer's VM list and via bulk-select toolbar, expose these actions in a dropdown menu:
- Power: Turn On, Shutdown, Force Stop, Restart
- Lab: Reset Lab, Reclone from Golden, Replace VM
- Snapshots: Take Snapshot, View/Restore Snapshots
- Access: Open Console (noVNC), Copy RDP/SSH, Reset Password
- Maintenance: Resize (vCPU/RAM/Disk), Migrate Node, Change Region
- Clone for All (apply current VM state as new golden image to all batch VMs)
- Destroy

Bulk toolbar mirrors these (Start All / Stop All / Reboot All / Snapshot All / Reclone All / Resize All / Destroy All).

## 3. Settings tab — pruning and reorg
- **Security & Access**: remove Enforce SSO Login, SSO Provider, SSO Entity ID/Tenant. Move "Restrict Portal to Office Hours" into the **Scheduling & Calendar** card.
- **Scheduling & Calendar**: remove Google Calendar and iCal export integrations. Keep timezone, working hours, holiday calendar, and the moved office-hours toggle.
- **Data & Compliance**: remove the GDPR section entirely.

## 4. Commercial & Billing — per-customer rate card (replaces current simple card)

New card structure with persisted state on the customer object:

**Base rates**
- Default currency (INR/USD/EUR/GBP)
- Default monthly rate per VM
- Default daily rate per VM
- Hourly rate (auto-calculated = daily / 8, editable override) with a hint "We charge for 8 working hours/day; rest is free"

**Volume tiers** (editable table, add/remove rows)
- Default seed: 1–24 → 0%, 25–49 → 5%, 50–99 → 10%, 100+ → 15%
- Columns: Min seats, Max seats, Discount %

**Duration tiers** (editable table)
- Default seed: <25 days → 0%, 25 d–3 mo → 5%, 3–6 mo → 10%, 6–12 mo → 15%, 1–2 yr → 20%, 2 yr+ → 25%
- Columns: Min days, Max days, Discount %

**Monthly spend rebate**
- Editable rules: "If monthly spend ≥ X, give Y% rebate" (multi-row)

**Commercial terms**
- Payment terms (Net 7/15/30/45/60 + custom days)
- Billing cycle (Monthly / Quarterly / Annual / Per-batch)
- Auto-renew toggle
- Prepaid credit balance (read-only with top-up button)
- Tax/GSTIN, PO required toggle, PO number field
- Late-payment interest %, grace period days
- Effective-from date for the rate card + version history note

A live "Effective price preview" widget: input seats + duration → shows the resulting per-seat rate after stacked discounts.

## 5. Analytics tab — usage + business reports
Replace the current minimal analytics with:
- KPI strip: Total VMs provisioned, Active VMs now, Total VM-hours (MTD), Spend MTD, Open tickets, Avg ticket resolution.
- **Usage over time**: line chart of monthly VM-hours and spend (last 12 months).
- **Per-batch usage table**: Batch, Participants, Active days, VM-hours, Spend, Status. Each row has a "Download CSV" action; toolbar has "Download all (CSV)" and "Download PDF report".
- **Support stats**: tickets opened/closed per month bar chart, breakdown by category and priority.
- **Engagement**: logins, course completion %, lab completion %, top trainers by hours.
- Date-range picker (7d / 30d / 90d / 12m / custom) applied to all widgets.
- All tables export as CSV; whole tab exports as PDF.

## 6. Deep-link existing pages with preselected customer
Edit each target page to read `?customerId=` from the URL and skip/lock the customer-selection step:
- `AdminCreateBatch.tsx` — if `customerId` present, prefill and auto-advance from step 1.
- `ModifyBatch.tsx` — accept `?customerId=` and `?batchId=`.
- `BatchProvisioning.tsx` — same.
- Customer Detail buttons updated to use `navigate('/admin/.../...?customerId=' + id)` instead of opening inline sheets/wizards.

## 7. Support tab improvements
- Lists all tickets for the customer (table: ID, Subject, Priority, Status, Assignee, Updated).
- Row click navigates to `/admin/tickets?ticketId={id}` (Tickets page auto-opens that ticket's drawer/page).
- "New Ticket" button opens a compact create form (subject, priority, category, description, attachment) and saves via the existing ticket flow with the customer preselected.
- Quick Fixes section expanded:
  - Reset all VM passwords
  - Reboot all VMs
  - Reclone all VMs from golden
  - Extend all batches by N days
  - Send announcement to all participants
  - Force re-sync from Frappe LMS
  - Clear stuck provisioning jobs
  - Resend last invoice
  - Generate temporary access link for support engineer

## Technical notes
- Add `customerId` query-param parsing via `useSearchParams` on the four target pages; when present, set the customer in store and advance the stepper.
- Extend `customerStore` Customer type with `rateCard: { currency, monthlyRate, dailyRate, hourlyRate?, volumeTiers[], durationTiers[], spendRebates[], paymentTerms, billingCycle, ... }`. Seed existing customers with defaults.
- Reuse existing `Dialog`, `DropdownMenu`, `Table`, `Tabs`, `recharts` components — no new deps.
- Keep all changes inside admin portal; trainer/student portals untouched.

## Files touched
- `src/pages/admin/CustomerDetail.tsx` (major refactor of Batches, VMs, Settings, Billing, Analytics, Support tabs)
- `src/pages/admin/AdminCreateBatch.tsx` (read `?customerId`)
- `src/pages/admin/ModifyBatch.tsx` (read `?customerId`)
- `src/pages/admin/BatchProvisioning.tsx` (read `?customerId`)
- `src/pages/admin/Tickets.tsx` (read `?ticketId` to auto-open)
- `src/stores/customerStore.ts` (rateCard schema + defaults)
