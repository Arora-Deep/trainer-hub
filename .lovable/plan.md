# Plan: Proper LMS course authoring & lesson viewer

## 1. Clean up the Courses page (`src/pages/Courses.tsx`)
- Remove the entire "Currently viewing" card (the dropdown + inline accordion preview at the top).
- Keep just the PageHeader and the All Courses table. Row click already routes to `/courses/:id`.

## 2. Rich lesson authoring inside Course Details (`CourseContentEditor.tsx` + new sub-components)
Replace the tiny "title + type + duration" dialog with a **full-screen lesson editor sheet** (right-side Sheet, ~720px wide) that adapts to the chosen lesson type. Each type gets a proper authoring surface:

- **Video** — choose source: Upload file (drag-drop with progress mock + filename chip) OR paste URL (YouTube / Vimeo / MP4). Live preview of the embedded player. Optional transcript textarea + caption file upload.
- **Reading / Document** — rich text body (Textarea styled as editor, with format hint toolbar) + attach PDFs / slides (file upload list with name + size + remove). Toggle "Allow download".
- **Quiz / Assignment / Code Exercise / Exam** — keep the inline-vs-library toggle. "Library" shows a searchable list of existing items. "Inline" shows a deep-link button "Create new → opens CreateQuiz/CreateAssignment/CreateExercise" plus quick-config: passing score, attempts, time limit, weight %, required toggle.
- **Lab / CTF Scenario** — TemplatePickerDropdown to pick a lab template, mode toggle (on-demand / persistent), estimated hours, instructions textarea, success criteria.
- Common fields on every type: title, summary, duration, "required for completion" toggle, learner instructions.
- Save → persists to `courseStore` (extend Lesson with `summary`, `attachments[]`, `transcript`, `instructions`, `passingScore`, `attempts`, `timeLimit`, `successCriteria`).

## 3. Lesson viewer page (new route `/courses/:courseId/lessons/:lessonId`)
A new page `src/pages/LessonView.tsx` that opens when a lesson row is clicked in the editor. Layout:
- Left sidebar: collapsible chapter/lesson outline of the whole course with current lesson highlighted, Prev/Next buttons at the bottom.
- Main panel renders the lesson based on type:
  - **Video** — `<video>` for uploaded files / iframe for YouTube/Vimeo, plus transcript and attached files below.
  - **Reading** — formatted body + attachment list with download buttons.
  - **Quiz / Assignment / Exam** — summary card with rules, "Start attempt" CTA → links into existing quiz/assignment pages (or shows inline mock).
  - **Code Exercise** — code editor placeholder card with language badge + "Open in IDE".
  - **Lab / CTF** — lab card showing template, mode, est. hours + "Launch lab" CTA reusing existing lab launch UI.
- Header strip: lesson title, type badge, duration, "Edit lesson" button (back to editor sheet) and "Mark complete" toggle (mock).

## 4. Wire everything up
- In `CourseContentEditor.tsx`, clicking a lesson row (title area) navigates to the viewer; pencil icon still opens the edit sheet; trash still deletes.
- Add `/courses/:courseId/lessons/:lessonId` route in `src/App.tsx`.
- Extend `Lesson` type in `courseStore.ts` with the new optional fields; no breaking changes to existing data.

## Out of scope
- Real file storage / backend upload (uploads are mocked locally with object URLs + filename memory).
- Drag-to-reorder chapters/lessons (current grip handle stays decorative).
- Student-side player updates (only trainer authoring + preview view here).

## Files touched
- edit `src/pages/Courses.tsx` (remove top card)
- edit `src/stores/courseStore.ts` (extend `Lesson`)
- rewrite `src/components/courses/CourseContentEditor.tsx` (open new editor + viewer nav)
- new `src/components/courses/LessonEditorSheet.tsx` (type-aware authoring form)
- new `src/pages/LessonView.tsx` (lesson viewer)
- edit `src/App.tsx` (add lesson viewer route)
