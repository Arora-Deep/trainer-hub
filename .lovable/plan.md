

## Plan: Transform the Student Portal into an Elite Learning Experience

The current student portal has solid foundations — dashboard with streaks/XP, courses with module lists, labs with resource meters, live class with split-pane, assessments, certificates, schedule, and support. The goal is to elevate every page with richer interactivity, more data, better visual design, and new micro-features that make it feel like a world-class learning platform.

### Changes Overview

This is a large scope touching all 8 student pages. I'll break it into two batches to keep each change manageable.

---

### Batch 1: Dashboard, Courses, Labs, Live Class

#### 1. Dashboard (`student/Dashboard.tsx`) — Command Center Upgrade
- **Skill Radar Chart**: Add a recharts RadarChart showing skill proficiency across domains (Cloud, DevOps, Linux, Networking, Security)
- **Learning Heatmap**: GitHub-style activity grid showing daily learning activity for the past 12 weeks
- **Leaderboard Widget**: Top 5 students in the batch with XP, rank badges (Gold/Silver/Bronze)
- **"Continue Where You Left Off" Hero Card**: The most recent in-progress item (course module, lab, or assessment) as a prominent CTA card with thumbnail and one-click resume
- **Daily Challenge**: A gamification card showing today's optional challenge (e.g., "Complete 1 lab exercise" for bonus XP)
- **Upcoming Deadlines Timeline**: A vertical mini-timeline of the next 5 due dates across all assessments

#### 2. Courses (`student/Courses.tsx`) — Immersive Learning Path
- **Course Detail Drawer**: Clicking a course opens a `Sheet` with full details — syllabus, instructor bio, batch info, estimated time remaining, and a "Learning Path" visual showing prerequisites
- **Module Progress Timeline**: Replace flat module list with a vertical stepper/timeline showing completed, current (highlighted + animated), and locked modules with connector lines
- **Notes & Bookmarks**: Each module row gets a bookmark icon; bookmarked modules appear in a "Saved" tab
- **Study Time Tracker**: Per-course card shows "You've spent 8h 20m on this course" with a mini area chart of daily study time
- **Course Completion Celebration**: When all modules done, show confetti-style banner with certificate link

#### 3. Labs (`student/Labs.tsx`) — Infrastructure Dashboard
- **Lab Console Preview**: Running labs show a mini terminal preview (last 3 commands) inline on the card — click to expand to full console Sheet
- **Real-time Resource Charts**: Replace static meters with mini sparkline charts (recharts) showing CPU/RAM trends over last 30 min
- **Lab Timer with Extend Request**: Running labs show a countdown timer with a "Request Extension" button that opens a dialog
- **Lab History Section**: Below active labs, show a collapsible "Past Sessions" table with date, duration, and status
- **Quick Actions Toolbar**: Floating bar at top for running labs — "Open Console", "SSH Copy", "Reset All"
- **Connection Details Popover**: Click IP address to get a popover with full connection info (SSH command, RDP details, copy buttons)

#### 4. Live Class (`student/LiveClass.tsx`) — Production Studio Quality
- **Floating Participant Panel**: Expandable sidebar showing all online students with status indicators (watching, away, hand raised)
- **Hand Raise Button**: Prominent button that signals the instructor
- **Reactions Bar**: Quick emoji reactions (thumbs up, clap, mind blown, question) that float up as animations
- **Poll Widget**: Inline poll component showing instructor-created polls with real-time vote bars
- **Shared Whiteboard Tab**: New tab alongside Video/Content/Notes for a collaborative whiteboard placeholder
- **Breakout Room Indicator**: Banner showing if student is in a breakout room
- **Session Recording Badge**: Indicator that session is being recorded with "Recording will be available in 24h"
- **Lab Sync Indicator**: When instructor shares terminal, show "Instructor's terminal synced" in the lab panel

---

### Batch 2: Assessments, Certificates, Schedule, Support

#### 5. Assessments (`student/Assessments.tsx`) — Test Center
- **Assessment Detail Sheet**: Click any assessment to open a Sheet with full info — description, topics covered, scoring rubric, past attempts with scores
- **Score Trend Chart**: Line chart showing score trends across completed assessments
- **Countdown Timer for Due Items**: Assessments due today show a live countdown "Due in 3h 42m"
- **Difficulty Badges**: Each assessment shows Easy/Medium/Hard badge
- **Performance Breakdown**: Completed assessments show topic-wise performance bars (e.g., "Networking: 90%, Security: 75%")

#### 6. Certificates (`student/Certificates.tsx`) — Achievement Showcase
- **Certificate Preview Card**: Issued certificates show a visual preview/thumbnail of the actual certificate design
- **Share to LinkedIn Button**: Direct share integration placeholder
- **Verification QR Code**: Each cert shows a QR code for quick verification
- **Skills Earned Section**: Visual skill tree showing which certs unlock which skills
- **Certificate Timeline**: Vertical timeline of all earned certs with milestones

#### 7. Schedule (`student/Schedule.tsx`) — Calendar View
- **Calendar Grid View**: Add a toggle between the current list view and a weekly calendar grid (Mon-Sun with time slots)
- **Add to Personal Calendar**: Export buttons for Google Calendar / iCal
- **Session Reminders**: Toggle to set 15min/30min/1hr reminders
- **Conflict Detection**: If two sessions overlap, show a warning badge
- **Week Navigation**: Previous/Next week arrows with "Jump to Today"

#### 8. Support (`student/Support.tsx`) — Help Center
- **Ticket Detail Sheet**: Click a ticket to see full conversation thread with message bubbles
- **New Ticket Form**: Dialog with category selector (Lab Issue, Course Access, Account, Billing), priority, description, and screenshot upload placeholder
- **AI Help Suggestion**: "Before submitting, try these steps..." auto-suggestions based on category
- **Expandable FAQ Accordion**: Replace flat FAQ with accordion that expands/collapses
- **Status Timeline on Tickets**: Each ticket shows a mini status timeline (Created → Assigned → In Progress → Resolved)
- **Live Chat Widget Placeholder**: A "Chat with Support" button that opens a chat-style Sheet

---

### New Addition: Student Profile/Settings Page
- **Add route** `/student/profile`
- Shows: Avatar, name, email, batch enrollment, total XP, rank, skills summary, preferences (notification settings, theme)
- Add to sidebar nav under student section

### Technical Approach
- All changes use existing component library (shadcn Card, Sheet, Badge, Tabs, Dialog, Progress, ScrollArea, Accordion)
- Charts use `recharts` (already installed) — RadarChart, AreaChart, LineChart, BarChart
- Animations use `framer-motion` (already installed) — for reactions, celebrations, transitions
- No new dependencies needed
- All data remains mock/static — structured for future API integration

### Files Modified
- `src/pages/student/Dashboard.tsx` — Major rewrite
- `src/pages/student/Courses.tsx` — Major rewrite
- `src/pages/student/Labs.tsx` — Major rewrite
- `src/pages/student/LiveClass.tsx` — Major rewrite
- `src/pages/student/Assessments.tsx` — Major rewrite
- `src/pages/student/Certificates.tsx` — Major rewrite
- `src/pages/student/Schedule.tsx` — Major rewrite
- `src/pages/student/Support.tsx` — Major rewrite
- `src/pages/student/Profile.tsx` — New file
- `src/App.tsx` — Add profile route
- `src/components/layout/AppSidebar.tsx` — Add profile nav item

Given the scope, I recommend implementing Batch 1 (Dashboard, Courses, Labs, Live Class) first, then Batch 2 in a follow-up. This keeps each round focused and testable.

