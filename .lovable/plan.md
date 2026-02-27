

## Understanding

You're CloudAdda, a cloud company providing training lab infrastructure. The hierarchy is:

1. **CloudAdda Admin Portal** (your internal team) — provision labs, manage client companies, manage templates, billing, platform analytics, roles
2. **Trainer Portal** (your clients — training companies) — the current portal, runs batches/LMS, roles within their org
3. **Student Portal** — students consume training content, access labs, take assessments

This is a UI/UX MVP — no backend yet, just flows.

## Architecture: Single Project, Role-Based Routing

All three portals live in this project with a role switcher in the header for demo purposes.

```text
┌─────────────────────────────────────────────────┐
│  AppHeader  [Role Switcher ▾]  [Theme] [Notif]  │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │   Pages (change per role)            │
│ (adapts  │                                      │
│  per     │                                      │
│  role)   │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

## Implementation Plan

### Step 1: Create Role Store
- `src/stores/roleStore.ts` — Zustand store with `role: "cloudadda" | "trainer" | "student"` and a `setRole()` action
- Default role: `trainer` (current portal)

### Step 2: Role Switcher in Header
- Add a styled dropdown in `AppHeader` to switch between "CloudAdda Admin", "Trainer", "Student"
- Shows current role with a colored badge indicator
- Switching role changes sidebar nav and available routes

### Step 3: Make AppSidebar Role-Aware
- Move `navItems` into a config keyed by role
- **CloudAdda Admin nav**: Dashboard, Customers, Lab Templates, VM Management, Approvals, Billing, Users & Roles, Platform Analytics, Settings
- **Trainer nav**: current nav items (unchanged)
- **Student nav**: My Dashboard, My Labs, My Courses, Assessments, Certificates, Support

### Step 4: Build CloudAdda Admin Pages
- **`/admin/dashboard`** — Platform-wide stats: total customers, active VMs, revenue, VM health
- **`/admin/customers`** — List of training company clients with status, plan, active batches count; click into detail
- **`/admin/customers/create`** — Onboard a new client company
- **`/admin/templates`** — Global lab template library (promote existing template management here)
- **`/admin/vms`** — All VMs across all customers, filterable by customer/status/region
- **`/admin/approvals`** — Pending VM provisioning requests from trainers needing CloudAdda approval
- **`/admin/billing`** — Usage and billing per customer
- **`/admin/users`** — Internal user management with role assignment (admin, support, ops)
- **`/admin/analytics`** — Platform usage charts, customer growth, VM utilization trends
- **`/admin/settings`** — Platform-level settings

### Step 5: Build Student Pages
- **`/student/dashboard`** — Welcome screen with enrolled batches, upcoming sessions, progress summary
- **`/student/labs`** — Active lab VMs with "Launch Console" buttons, time remaining, status
- **`/student/courses`** — Enrolled courses with module-by-module progress, video/content viewer
- **`/student/assessments`** — Quizzes, assignments, exercises with scores and deadlines
- **`/student/certificates`** — Earned certificates with download option

### Step 6: Wire Routes in App.tsx
- Wrap role-specific routes in the same `AppLayout`
- Admin routes under `/admin/*`
- Student routes under `/student/*`
- Trainer routes stay at current paths
- Role switcher navigates to the corresponding dashboard on switch

### Step 7: Create Supporting Stores
- `src/stores/customerStore.ts` — mock customer/client data for CloudAdda admin
- `src/stores/roleStore.ts` — role state (from step 1)
- Reuse existing stores (labStore, batchStore, courseStore) where relevant

