# Student Portal Visual Overhaul — "Arcade Premium"

Repaint the entire student portal to match the reference: deep dark surfaces, vibrant purple → cyan → magenta gradients, neon donut/ring charts, glow-edged cards, rounded-2xl tiles, illustrative hero banner. Full light-mode counterpart so users can toggle. Trainer and admin portals stay untouched.

## Visual language (locked tokens)

Scoped under `.student-portal` only.

**Dark mode (default for student)**
- Canvas: `#0B0B14` → `#11121C` (subtle vertical fade)
- Card surface: `#161826` with 1px inner stroke `rgba(255,255,255,0.04)` and soft outer glow `0 8px 32px rgba(120,80,255,0.10)`
- Primary gradient: `linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #22D3EE 100%)` (hero, CTA)
- Accent gradients: magenta `#EC4899→#8B5CF6`, cyan `#22D3EE→#3B82F6`, lime `#A3E635→#22D3EE`
- Ring/donut colors: violet `#8B5CF6`, magenta `#EC4899`, cyan `#22D3EE`, lime `#A3E635`
- Text: `#F4F4F8` primary, `#8B8FA7` muted

**Light mode**
- Canvas: `#F6F7FB`, cards `#FFFFFF` with `0 4px 20px rgba(99,102,241,0.08)`
- Same gradient family but slightly desaturated (-10% lightness on stops); donut tracks become `#EEF0F7`

All values land in `index.css` under `.student-portal` and `.student-portal.dark` (or default if portal forces dark). User toggles via existing theme switch.

## Scope (entire student portal)

Pages repainted:
- `/student/dashboard` — hero banner + reward unlock card + stat grid (donut + bar tiles)
- `/student/labs`, `/student/courses`, `/student/leaderboard`, `/student/quests`, `/student/profile`, `/student/skill-tree`, `/student/certificates`, `/student/assessments`, `/student/challenges`, `/student/progress`, `/student/schedule`
- Shell: `AppSidebar` (student variant) + `AppHeader` (student variant)

## Component work

**Shell**
- `AppLayout.tsx` — when role=student, apply `.student-portal` + force-dark or respect theme toggle; render soft mesh background (two radial blurs: violet top-left, cyan bottom-right)
- `AppSidebar.tsx` — student variant: dark sidebar card, avatar ring with gradient stroke + XP label under it (`200/300 XP`), gradient-pill active item
- `AppHeader.tsx` — student variant: large page title, right-side icon cluster (apps grid, bell with dot, avatar pill with name)

**New / rebuilt gamification components**
- `HeroDashboard.tsx` — full-width gradient banner (violet→indigo→cyan), greeting headline, sub-copy, gradient pill CTA "Resume lab", decorative illustration slot on right
- `RewardUnlockCard.tsx` (new) — companion card on right of hero, cyan→teal gradient, progress bar, toggle pill, "X / Y" counter
- `StatDonutCard.tsx` (new) — reusable: neon donut (SVG, gradient stroke, rounded cap, glow filter), big % label center, title, secondary metric, "X% until next benefit" sub-line, top-right glyph
- `StatBarCard.tsx` (new) — big number, label, mini gradient bar chart (Recharts, rounded tops, SVG linearGradient), trend chevron
- `TierListCard.tsx` (new) — list rows with right-aligned % values (replaces simple leaderboard tile on dashboard)

**Repainted existing**
- `MasteryTracks`, `MiniLeaderboard`, `AchievementShowcase`, `WeeklyChallengeFeature`, `SkillProgressionPath`, `LabMissions`, `StreakMomentumCard`, `SeasonBanner`, `RivalCallout`, `LevelChip`, `TierBadge` — restyle to new card surface, gradient accents, neon ring/bar visuals; no logic changes
- `Dashboard.tsx` — recompose to mirror reference: row 1 = HeroDashboard (2/3) + RewardUnlockCard (1/3); section header "Your performance"; row 2 = 3× StatDonutCard; row 3 = 2× StatBarCard + 1× TierListCard

**Charts**
Recharts with `<defs><linearGradient/></defs>` for violet→magenta, cyan→indigo, lime→cyan; donut = `PieChart` with `cornerRadius`, single-segment gradient + faint track segment, drop-shadow SVG filter.

## Light/Dark toggle

- Add small theme toggle in student `AppHeader` (sun/moon)
- Persist in existing theme system; `.student-portal` defines both palettes so switch is instant
- Reference image is dark — dark is the default the first time a student lands

## Files touched

Created:
- `src/components/gamification/RewardUnlockCard.tsx`
- `src/components/gamification/StatDonutCard.tsx`
- `src/components/gamification/StatBarCard.tsx`
- `src/components/gamification/TierListCard.tsx`

Edited (style-only, no logic changes):
- `src/index.css` (full `.student-portal` token block, dark + light, gradients, glows, mesh background)
- `tailwind.config.ts` (add gradient utilities if needed)
- `src/components/layout/AppLayout.tsx`, `AppSidebar.tsx`, `AppHeader.tsx`
- `src/components/gamification/*` (all listed above)
- `src/pages/student/Dashboard.tsx` (recompose)
- `src/pages/student/{Labs,Courses,Leaderboard,Quests,Profile,SkillTree,Certificates,Assessments,Challenges,Progress,Schedule}.tsx` (apply new card surfaces, hero strips, gradient CTAs — content unchanged)

## Out of scope
- Trainer + admin portals (untouched)
- Any data, store, or routing changes
- New features beyond visuals
