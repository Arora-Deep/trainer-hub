# Student Gamification Restructure

Strip the slot-machine layer (XP, levels, momentum, badges, achievements). Keep streaks (lightweight habit signal) plus what proves actual learning: completion, mastery, ranking inside your batch, and a public portfolio worth sharing.

## 1. Information architecture changes

Sidebar group "Progression" becomes:

```text
Before                          After
─────────                       ─────────
My Profile         /profile     Portfolio          /portfolio   (+ public /p/:handle)
Quests             /quests      Challenges         /challenges  (merged)
My Progress        /progress    My Progress        /progress    (cleaned)
Skill Trees        /skill-tree  Learning Paths     /paths
Challenges         /challenges  ─ merged into above ─
Leaderboards       /leaderboard Leaderboard        /leaderboard (batch-only)
Certificates       /certificates Certificates      /certificates (unchanged)
```

Old routes redirect to new ones so deep links don't break.

## 2. What gets deleted

- All XP totals, level numbers, level rings, "next level in N XP" bars
- "Momentum multiplier", weekly XP race, rival callouts, reward-unlock cards
- Badges and achievement shelves (incl. `AchievementShowcase`, badge tabs on Profile)
- Global / cross-batch leaderboards
- `HeroDashboard` XP banner, `RivalCallout`, `RewardUnlockCard`, `MiniLeaderboard` (global), `WeeklyChallengeFeature` (XP-based)
- Mock data in store: `xp`, `level`, `xpFeed`, `achievements`, `momentum`, `leaderboard.weekly/streaks/kubernetes`

## 3. What stays (lean gamification)

- **Streaks** — daily activity counter, current + longest. One small streak chip in the page hero and a streak calendar on Progress. No streak leaderboard.
- **Gradient heroes, animations, "Arcade Premium" look** — visual game feel without points
- **Completion %, mastery %, batch rank** — concrete progress

## 4. Page-by-page

### Portfolio (`/student/portfolio`) — replaces Profile
Public-shareable, GitHub-profile-style. Renders at internal `/student/portfolio` (editable) and public `/p/:handle` (read-only, no auth, shareable URL with Copy Link + OG image meta tags).

Sections, in order:
1. Header — avatar, name, headline, batch, "Share portfolio" button (copies `/p/:handle`)
2. Top Skills — top 5 skills by mastery %, horizontal bars
3. Completed Learning Paths — cards with path name, % mastery, completion date
4. Certificates — grid pulling from existing certificates store
5. Labs Shipped — list of completed labs with date + short outcome
6. Challenges Won — completed challenges with date

Streaks are NOT shown publicly (private signal). Settings (handle, visibility toggle, headline) live in a right-side drawer from the Portfolio header.

### Learning Paths (`/student/paths`) — replaces Skill Tree
Reframe existing skill-tree data as ordered learning journeys.

- List page: cards showing path name, # modules, % complete, est. hours, "Continue" CTA
- Detail page: linear/branching module sequence rendered top-down with clear "next up"; each node links to its course/lab/assessment
- Progress = % of modules completed. Nodes unlock by prerequisite completion only — no XP gates.

### Challenges (`/student/challenges`) — absorbs Quests
One page, two tabs:
- **Active** — challenges currently joinable or in progress (multi-step storylines from old Quests + one-offs from old Challenges, unified as "Challenge" with optional `steps[]`)
- **Completed** — history with outcome + date

Rewards are concrete: certificate, lab credit, mentor session — no XP/badges.

### My Progress (`/student/progress`) — cleaned
Keep only what a learner acts on:
1. Current batch progress — % of program complete, weeks elapsed / total
2. Streak — current + longest + 30-day calendar
3. Active courses — list with % complete + last-activity date
4. Active learning paths — same shape
5. Skill mastery — bar list (skill → % from assessments/labs)
6. Upcoming deadlines — assessments, live sessions, challenge end dates

Remove: XP graph, momentum chart, badge progress, weekly XP goal.

### Leaderboard (`/student/leaderboard`) — batch-only
- Tab per batch the student is enrolled in
- Single ranking inside each batch
- Rank metric: composite of completion % + assessment scores + labs shipped. Breakdown shown on row hover for transparency.
- No global, no cross-batch, no streak leaderboard, no weekly XP race

## 5. Data / store changes

`gamificationStore` shrinks and is renamed `progressStore`:
- Remove: `xp`, `level`, `momentum`, `achievements`, `xpFeed`, global `leaderboard` slices
- Keep: `streak` (current, longest, activity dates)
- Keep & rename: `skillTracks` → `learningPaths`, `challenges` (merge `quests` array in)
- Add: `batchLeaderboard(batchId)` selector returning composite-ranked entries for that batch only
- Add: `portfolio` slice — handle, headline, visibility, derived getters for top skills / completed paths / shipped labs

`questStore` merges into `progressStore.challenges` then is deleted.

Components touched:
- Delete: `AchievementShowcase`, `RivalCallout`, `RewardUnlockCard`, `WeeklyChallengeFeature`, `MiniLeaderboard`
- Keep but refactor: `StreakMomentumCard` → `StreakCard` (drop momentum half)
- Rewrite: `HeroDashboard` (drop XP bar/level ring, keep gradient + streak chip), `StudentPageHero` (replace Level/Momentum stats with Path %, Active Challenges, Batch Rank — keep Streak), `Dashboard.tsx`, `Profile.tsx` → `Portfolio.tsx`, `SkillTree.tsx` → `Paths.tsx` + `PathDetail.tsx`, `Challenges.tsx`, `Leaderboard.tsx`, `Progress.tsx`; delete `Quests.tsx`
- Update: `AppSidebar.tsx` student nav, `App.tsx` routes + redirects

## 6. Build order

1. Store refactor (`progressStore`, delete `questStore`, redirect imports)
2. Sidebar + routes + redirects in `App.tsx`
3. Rewrite `StudentPageHero` and `Dashboard` (unblocks every other page visually)
4. Portfolio page + public `/p/:handle` route
5. Learning Paths list + detail
6. Merged Challenges page
7. Batch-only Leaderboard
8. Cleaned Progress page (with streak)
9. Delete dead components and unused mock data

## Out of scope (later passes)
Courses, Labs, Assessments, Schedule, Support, Certificates internals — visual sweep already done, no logic changes this round.
