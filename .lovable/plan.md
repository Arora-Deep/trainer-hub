## Refactor: assessments are lessons

Single underlying data model = the existing chapter→lesson tree. Two views into it: **Content** (author & order) and **Assessments** (configure grading + view submissions). No more parallel placement system.

### 1. Data model cleanup (`courseStore.ts`)

Remove:
- `AssessmentPlacement` union
- `CourseAssessment` interface
- `assessments` array on `Course`
- `addAssessment` / `updateAssessment` / `deleteAssessment` actions

Extend `Lesson`:
```ts
interface Lesson {
  // …existing fields
  refId?: string;        // points to quizStore/assignmentStore/exerciseStore item when library-linked
  source?: 'inline' | 'library';
  weight?: number;       // % toward course grade (assessment lessons only)
  required?: boolean;    // gates progression (assessment lessons only)
}
```

Helper selector: `getCourseAssessments(courseId)` → flattens chapters and returns lessons where `type ∈ {quiz, assignment, code-exercise, exam}` in course order, each with `{chapterIndex, lessonIndex, chapterTitle}`.

### 2. Content editor — library picker

In `CourseEditor.tsx` add-lesson sheet and `CourseContentEditor.tsx` add-lesson dialog: when the picked type is `quiz`, `assignment`, or `code-exercise`, show a toggle:

```
( ) Create new    (•) Pick from library
```

Library mode renders a `Select` of items from the matching store (`useQuizStore`, `useAssignmentStore`, `useExerciseStore`). On submit, the new lesson is created with `source: 'library'`, `refId`, and `title` snapshotted from the library item.

Inline mode keeps current behavior (`source: 'inline'`).

Visual: library-linked assessment lessons get a small "Library" chip in the tree so authors can see at a glance.

### 3. Assessments tab — editable summary + submissions

Replace the slot-based outline I built with a two-section tab:

**Section A — Grading config (table)**
Columns: Order · Title · Type · Located in (Module N › position) · Weight (%) · Required · Submissions count · Actions
- Weight and Required edit inline (number input + switch). Writes back to the lesson on the chapter tree.
- Title click → jumps to that lesson in the Content tab.
- Footer shows `Σ weight = X%` with a warning chip if ≠ 100%.

**Section B — Submissions**
- Top selector: "All assessments" or pick a specific one.
- Table of student submissions (mocked from existing stores): Student · Assessment · Submitted at · Score · Status (graded / pending / late).
- Row click → opens a right-side drawer with submission detail (mock content for now).

No "course-start / course-end / after-module" slots anywhere. Position = order in the content tree; trainers reorder by editing the tree.

### 4. Files touched

- `src/stores/courseStore.ts` — drop assessment array & actions, extend `Lesson`, add selector
- `src/components/courses/CourseAssessmentsTab.tsx` — rewrite as table + submissions view
- `src/components/courses/CourseContentEditor.tsx` — add library/inline toggle in lesson dialog, library chip in tree
- `src/pages/CourseEditor.tsx` — same library/inline toggle in the add-lesson sheet, library chip in tree
- `src/data/studentMockData.ts` — small mock submissions array for the new submissions section (or inline in tab)

### 5. Migration

Any existing `course.assessments` entries are dropped (they were just added this session, mock data only). No persistence to migrate.

### Out of scope

- Drag-and-drop reordering (current up/down + tree edit is enough; can add later)
- Actual grading workflows / Judge0 wiring (still mocked)
- Batch-level overrides of weight/required
