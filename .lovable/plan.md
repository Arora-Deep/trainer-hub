
# Gamification Overhaul — Student Portal

Goal: make students *want* to return daily. Blend Apple-minimal restraint, Duolingo's warmth, GitHub's proof-of-skill, and esports ranking — without ever looking childish.

---

## 1. Design language (the "feel")

A single visual layer reused everywhere so gamification feels native, not bolted on.

- **XP color**: electric indigo `--xp` (primary-adjacent) + warning amber for streaks + emerald for mastery gains.
- **Tier ramp** (used for ranks, rarity, skill mastery): Bronze → Silver → Gold → Platinum → Diamond → Architect. Each gets a token (`--tier-bronze` … `--tier-architect`) with paired foreground/glow.
- **Motion primitives** (added to `tailwind.config.ts` + `index.css`):
  - `xp-pop` (number ticks up, +XP chip floats and fades)
  - `level-up-burst` (radial glow, soft confetti — *one* burst, never spam)
  - `streak-flame-pulse` (subtle, 2s)
  - `rank-shimmer` (slow gradient sweep on tier badges)
  - `node-unlock` (skill tree node fills + ring expands)
- **Sound/haptic layer** (opt-in, default ON, toggle in Settings): tasteful clicks for XP gain, level up, mission complete. Web Audio + `navigator.vibrate` fallback. Muted by default on first visit until user opts in via toast.

Result: every reward across the portal uses the same chip, same easing, same sound. Reads as one system.

---

## 2. Core systems (new + upgraded)

### A. Seasons (6-week cycles)
- `gamificationStore` gains `season: { id, name, startsAt, endsAt, weeklyXpCap, theme }`.
- Season banner on Dashboard + Progress page with countdown.
- Season-end recap modal: top skill, XP earned, rank delta, shareable card.

### B. Quests / Storylines
- New `questStore` with multi-step quests chaining existing entities:
  - `steps[]`: each references a course lesson, lab, quiz, or challenge id.
  - Example seeded quests: *"Deploy Your First Cluster"*, *"Linux Black Belt"*, *"From Zero to DevOps"*.
- Quest progress shown as a vertical timeline with locked/active/done states.
- Completing a quest awards a **Title** (e.g., "Cluster Initiate") that appears on profile.

### C. Public Profile + Shareable Rank Card
- New route `/student/profile/:handle` (own profile reachable from header avatar).
- Sections: identity (level, title, tier), skill rings (Cloud/Linux/K8s/…), achievement wall, recent XP feed, active quests, contribution heatmap (GitHub-style, last 6 months).
- "Share rank card" → renders a 1200×630 PNG via canvas (tier gradient, avatar, level, top skill, season rank). Download + copy-link.

### D. Squads-lite (optional, ships disabled-by-default flag)
- Cohort = squad. Squad XP pool aggregated from batch members. Squad row on leaderboard. No chat — just shared progress.

### E. Daily return loop (upgrade)
- Streak freeze tokens (earn 1 per 7-day streak, max 2). One-tap apply.
- Comeback bonus if returning after a break (no shame messaging — "Welcome back, +50 XP").
- Daily missions get a 4th "wildcard" slot tied to weakest skill.

---

## 3. Weaving XP into every page

Every existing student page gets a thin, consistent gamification layer. No page rewrites — additive only.

| Page | Addition |
|------|----------|
| `Dashboard` | Season banner, active quest card, contribution heatmap row, "Today's edge" (weakest skill nudge) |
| `Courses` / `CourseDetail` / `CoursePlayer` | Lesson-complete = `+XP` toast with skill attribution; chapter completion = mini level-up; sidebar shows skill XP gained this session |
| `Labs` / `LabDetail` | Lab finish = XP + possible achievement unlock; difficulty multiplier visible before start |
| `Assessments` / `AssessmentResult` | Score → XP formula shown; perfect score = rare achievement; result page gets shareable card |
| `Challenges` | Already exists — add difficulty-tier visuals (Bronze→Diamond), first-blood bonus, timer-based XP |
| `LiveClass` | Attendance streak chip; "engaged" XP for asking questions (trainer-grantable); end-of-class recap with XP earned |
| `Leaderboard` | Add seasonal view, squad view, skill-specific tabs polished; rival callout ("You're 240 XP behind @arjun") |
| `SkillTree` | Animated node unlocks, mastery tier rings, prerequisite paths visible on hover |
| `Progress` | Heatmap, season recap, title gallery, quest progress, XP feed timeline (richer) |
| `Certificates` | Tie certificate issuance to mastery tier; show on public profile |
| `AppHeader` | LevelChip upgraded: tier ring around avatar, hover reveals streak/momentum/season rank |
| `Sidebar` | New "Profile" + "Quests" + "Season" entries under Progression group |

A single `useXpReward()` hook centralizes: animate chip → update store → play sound → toast → check for level/achievement/quest progress.

---

## 4. Identity & status

- **Titles** (earned via quests/achievements): displayed under name on profile + header hover. Examples: "Cluster Initiate", "Linux Sensei", "Security Sentinel".
- **Technical identity** evolves with dominant skill: e.g., "Cloud Engineer" → "Cloud Architect" at level 30+.
- **Rarity tiers on achievements**: Common / Rare / Epic / Legendary — visible glow + percentage of students who hold it.
- **Season banner** on profile (current + past seasons archived).

---

## 5. Pages/files to add or edit

**New files**
- `src/stores/questStore.ts`
- `src/stores/seasonStore.ts` (or extend `gamificationStore`)
- `src/hooks/useXpReward.ts`
- `src/lib/feedback.ts` (sound + haptic primitives)
- `src/lib/rankCard.ts` (canvas PNG renderer)
- `src/components/gamification/XpToast.tsx`
- `src/components/gamification/LevelUpBurst.tsx`
- `src/components/gamification/ContributionHeatmap.tsx`
- `src/components/gamification/TierBadge.tsx`
- `src/components/gamification/QuestTimeline.tsx`
- `src/components/gamification/SeasonBanner.tsx`
- `src/components/gamification/RankCardPreview.tsx`
- `src/pages/student/Profile.tsx`
- `src/pages/student/Quests.tsx`
- `src/pages/student/Season.tsx` (optional; could be a tab on Progress)

**Edits**
- `tailwind.config.ts`, `src/index.css` — tier tokens + new keyframes
- `src/stores/gamificationStore.ts` — season, titles, streak freezes, rarity, weekly cap
- `src/components/layout/AppHeader.tsx`, `AppSidebar.tsx` — new nav + tier ring on avatar
- `src/App.tsx` — register new routes
- Every student page in the table above — wire `useXpReward()` + display elements

---

## 6. Build order (so you see value quickly)

1. **Foundation**: tokens, keyframes, `useXpReward`, `XpToast`, `LevelUpBurst`, sound layer + Settings toggle.
2. **Store upgrades**: seasons, titles, freezes, rarity, weekly cap in `gamificationStore`; new `questStore`.
3. **Public Profile + Rank Card** (high "wow" deliverable).
4. **Quests page + timeline** + seed 3 quests.
5. **Season banner + recap** on Dashboard and Progress.
6. **Weave XP into every page** (Courses → Labs → Assessments → LiveClass → Challenges).
7. **Polish**: contribution heatmap, rival callouts on Leaderboard, tier rings on SkillTree, micro-animations sweep.
8. **Squads-lite** behind a flag (last, optional).

---

## 7. Guardrails (so it never feels childish)

- No mascots. No cartoon illustrations. No exclamation-heavy copy.
- One celebration per event, never stacked. Level-up burst is ≤900ms.
- XP numbers are tabular, monospaced where shown next to identity.
- All gamification respects the existing Apple-minimal grid, 1px borders, soft shadows.
- Sound + bursts can be disabled in Settings; preference persisted.
- No dark patterns: no "you'll lose your streak!" red alerts — calm, factual nudges.

---

## Technical notes

- All new state is client-side via Zustand (consistent with existing stores). Seasons/quests seeded from mock data, ready to swap to Cloud later.
- Rank card uses `OffscreenCanvas` where available, falls back to `<canvas>`; exported via `toBlob`.
- Heatmap is a pure SVG component, no chart lib needed.
- Sound assets: 3 short WAVs base64-inlined in `feedback.ts` to avoid network cost.
- `useXpReward({ amount, skills, source })` is the single funnel — guarantees consistent toast, sound, store update, level/quest/achievement checks. Every page calls it the same way.
