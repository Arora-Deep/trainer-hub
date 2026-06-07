## Goal

Make `/student/live-class` (the "Learning Centre") behave differently depending on the selected course's delivery mode, and tighten the Labs page so it only shows VMs a student can currently access.

---

## 1. Learning Centre — VILT courses (no change)

When the selected course is `deliveryMode: "live"` or `"hybrid"`, render today's existing live-class layout exactly as it is (instructor video / chat / synced lab console / participants / view modes).

The current "Self-paced" branches and amber notices in `LiveClass.tsx` are pulled out — the live UI no longer pretends to also serve self-paced.

## 2. Learning Centre — Self-Paced courses (new view)

When the selected course is `deliveryMode: "self-paced"`, render a new layout inside the same page that feels like the existing `CoursePlayer` (the "My Courses → course" experience), not like a live class.

Structure:

```
┌────────────────────────────────────────────────────────────────┐
│ Course switcher · course title · self-paced badge · hours left │
├──────────────┬────────────────────────────────┬────────────────┤
│              │                                │                │
│  Curriculum  │   Current lesson content       │  Course Lab    │
│  (chapters,  │   (video / reading / quiz /    │  (only if      │
│   lessons,   │    assignment / code / lab /   │   course has   │
│   locked,    │    lab-instruction / exam /    │   a persistent │
│   completed) │    live-session)               │   course VM)   │
│              │   Prev / Mark complete / Next  │                │
└──────────────┴────────────────────────────────┴────────────────┘
```

Lab handling — two modes:

- **Course-wide persistent VM with hour pool** (e.g. 20h, accessible anytime): the right rail shows a "Course Lab" panel with VM status, hours-remaining meter, launch console button, and VM actions (Start / Stop / Restart / Snapshot / Reset / Open fullscreen). Available from every lesson, not gated by lesson type.
- **Time-limited between-lesson lab** (current behaviour): when the current lesson itself is a `lab` / `lab-instruction`, the centre pane keeps today's inline `OnDemandLabPanel` / `LabWorkspace` launch flow. The right rail hides when no course-wide VM exists.

### View toggle when student opens the VM

On a self-paced course with a persistent VM, the top of the page exposes a small segmented control:

- **Lessons + Lab** (split, default) — curriculum / lesson / VM side-by-side as above.
- **Lab only** — center pane is replaced by a full-width VM console; curriculum collapses to a slim rail; right controls remain.

(Existing "Content View / Lab View / Notes" tabs are removed in self-paced mode — replaced by these two states.)

## 3. Active Labs page (rename + scope change)

- Sidebar item "My Labs" → **"Active Labs"** (`/student/labs` route unchanged).
- The page only lists labs the student can currently use:
  - Course-wide persistent VMs (self-paced courses with hour pools).
  - Currently-running time-limited lesson labs.
- Stopped lesson labs without an active session and completed/failed labs are hidden by default (still reachable via a "Show all" toggle for transparency).
- Card copy clarifies access type: "Always available · 20h pool" vs "Lesson lab · 1h 30m left this session".

## 4. Data tweaks (`src/data/studentMockData.ts`)

Add to `StudentCourse` for self-paced courses:

```ts
persistentLab?: {
  labId: string;          // links to studentLabs
  templateName: string;
  totalHours: number;     // e.g. 20
  usedHours: number;
};
```

Populate it on the Python (id 4) and Linux Hardening (id 5) self-paced courses. The hybrid GenAI course (id 6) gets one too.

Existing `studentLabs` entries gain an `accessKind: "course-persistent" | "lesson-time-limited"` so the Active Labs page can filter cleanly.

## 5. Files touched

**Edit**
- `src/data/studentMockData.ts` — add `persistentLab` on courses, `accessKind` on labs.
- `src/components/layout/AppSidebar.tsx` — rename "My Labs" → "Active Labs".
- `src/pages/student/LiveClass.tsx` — branch on delivery mode; mount new self-paced view, keep VILT as-is.
- `src/pages/student/Labs.tsx` — filter to active-only by default, add "Show all" toggle, update copy and hero title.

**New**
- `src/pages/student/SelfPacedLearningCentre.tsx` — the curriculum + lesson + course-lab layout, with Split / Lab-only toggle. Reuses `CoursePlayer`'s block renderers and `LabWorkspace`'s console mock.

## 6. Out of scope

- Real VM orchestration / real video — all mock.
- Trainer authoring side for `persistentLab` (already covered by lab allocation editor).
- `/student/courses/:id/learn/:lessonId` (My Courses → CoursePlayer) keeps its current behaviour; no duplication.
