import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGamificationStore, skillColor, rarityStyle, tierColor, tierGradient, type SkillKey } from "@/stores/gamificationStore";
import { useQuestStore, questProgress } from "@/stores/questStore";
import { TierBadge } from "@/components/gamification/TierBadge";
import { SkillRing } from "@/components/gamification/SkillRing";
import { ContributionHeatmap } from "@/components/gamification/ContributionHeatmap";
import {
  Share2, Download, Award, Trophy, Lock, Sparkles, CheckCircle2,
  Cloud, Terminal, Boxes, Shield, Network, Workflow, Brain, Code, Server,
  Rocket, Moon, Clock, Activity, Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { toast } from "sonner";
import { drawRankCard, downloadCard } from "@/lib/rankCard";

const skillIcons: Record<SkillKey, typeof Cloud> = {
  cloud: Cloud, linux: Terminal, kubernetes: Boxes, security: Shield,
  networking: Network, devops: Workflow, ai: Brain, python: Code, infra: Server,
};
const achievementIcons: Record<string, typeof Rocket> = {
  Rocket, Terminal, Boxes, Network, Cloud, Clock, Moon, Server, Workflow, Activity,
};

export default function Profile() {
  const { profile, skills, achievements, titles, heatmap, streak, season } = useGamificationStore();
  const { quests } = useQuestStore();
  const setActiveTitle = useGamificationStore((s) => s.setActiveTitle);
  const navigate = useNavigate();
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  const xpPct = Math.min(100, Math.round((profile.totalXp / profile.nextLevelXp) * 100));
  const unlocked = achievements.filter(a => a.unlocked);
  const topSkills = [...skills].sort((a, b) => b.xp - a.xp).slice(0, 6);
  const activeQuest = quests.find(q => q.status === "in_progress");

  const handleShare = async () => {
    const blob = await drawRankCard({
      name: profile.name,
      handle: profile.handle,
      title: profile.activeTitle,
      level: profile.level,
      tier: profile.tier,
      skill: skills.find(s => s.key === profile.specialization)?.label ?? "",
      seasonRank: season.rank,
      streak: streak.current,
      totalXp: profile.totalXp,
    });
    downloadCard(blob, `${profile.handle.replace("@", "")}-rank-card.png`);
    toast.success("Rank card downloaded");
  };

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="violet"
        eyebrow="Identity"
        icon={Trophy}
        title={<>Your <span className="text-white/95">card</span>. Your story.</>}
        description="Your technical identity, mastery, and proof of work."
        actions={
          <Button onClick={handleShare} className="gap-1.5 bg-white text-foreground hover:bg-white/90">
            <Share2 className="h-4 w-4" /> Share rank card
          </Button>
        }
      />


      {/* Identity */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${tierGradient[profile.tier]} opacity-90`} />
        <CardContent className="relative pt-16 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            <div className="relative -mt-16">
              <div className={`h-24 w-24 rounded-2xl bg-card border-4 border-card flex items-center justify-center text-4xl font-bold shadow-lg`}
                   style={{ color: tierColor[profile.tier] }}>
                {profile.level}
              </div>
              <TierBadge tier={profile.tier} shimmer size="sm" className="absolute -bottom-2 -right-2 shadow" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-semibold tracking-tight">{profile.name}</h2>
                <Badge variant="outline" className="text-[10px]">{profile.handle}</Badge>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-warning">
                  <Flame className="h-3 w-3" /> {streak.current}-day streak
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-primary">{profile.activeTitle}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{profile.identity}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Top {100 - profile.percentile}% globally · Season rank #{season.rank} · {profile.totalLabHours}h in labs
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
              <Mini label="Level" value={profile.level} />
              <Mini label="XP" value={profile.totalXp.toLocaleString()} />
              <Mini label="Achv." value={`${unlocked.length}/${achievements.length}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill rings */}
      <section className="space-y-3">
        <SectionHeader title="Skill mastery" subtitle="Per-track levels with progress to next" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {topSkills.map((s) => {
            const Icon = skillIcons[s.key];
            const pct = Math.min(100, Math.round((s.xp / s.nextLevelXp) * 100));
            return (
              <Card key={s.key}>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <SkillRing value={pct} color={skillColor[s.key]} size={72}>
                    <div className="flex flex-col items-center">
                      <Icon className="h-4 w-4" style={{ color: skillColor[s.key] }} />
                      <span className="text-[10px] font-bold tabular-nums mt-0.5">{s.level}</span>
                    </div>
                  </SkillRing>
                  <div className="text-center">
                    <p className="text-xs font-semibold">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.rank}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contribution heatmap */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">Activity</h3>
              <p className="text-[11px] text-muted-foreground">Labs, lessons, challenges — every day you showed up.</p>
            </div>
            <Badge variant="outline" className="text-[10px] gap-1"><Flame className="h-3 w-3 text-warning" /> longest {streak.longest}d</Badge>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <ContributionHeatmap data={heatmap} />
          </div>
        </CardContent>
      </Card>

      {/* Active quest + Titles */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {activeQuest && (
          <Card className="border-primary/20">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Active quest</h3>
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate("/student/quests")} className="h-7 text-xs">Open</Button>
              </div>
              <div>
                <p className="text-base font-semibold">{activeQuest.title}</p>
                <p className="text-xs text-muted-foreground">{activeQuest.tagline}</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{questProgress(activeQuest).done} / {questProgress(activeQuest).total} steps</span>
                  <span className="tabular-nums">{questProgress(activeQuest).pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${questProgress(activeQuest).pct}%` }} />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Reward: title <span className="text-primary font-medium">{activeQuest.rewardTitle}</span> · {activeQuest.totalXp.toLocaleString()} XP
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="text-sm font-semibold">Titles</h3>
            <p className="text-[11px] text-muted-foreground">Earned through quests and mastery. Equip one to show it next to your name.</p>
            <div className="space-y-1.5">
              {titles.map((t) => (
                <button
                  key={t.id}
                  disabled={t.locked}
                  onClick={() => !t.locked && setActiveTitle(t.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg border text-left transition-colors ${
                    t.active ? "border-primary/40 bg-primary/[0.05]" : t.locked ? "border-border opacity-60 cursor-not-allowed" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <span className={`h-7 w-7 rounded-md flex items-center justify-center ${t.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {t.locked ? <Lock className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{t.description}</p>
                  </div>
                  {t.active && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement wall */}
      <section className="space-y-3">
        <SectionHeader title="Achievement wall" subtitle="Rare proof-of-skill earned through real work" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((a) => {
            const Icon = achievementIcons[a.icon] ?? Rocket;
            const locked = !a.unlocked;
            return (
              <Card key={a.id} className={`relative overflow-hidden ${locked ? "opacity-70" : ""}`}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center bg-gradient-to-br ${
                      a.tier === "platinum" ? "from-primary/20 to-primary/5 border-primary/30 text-primary" :
                      a.tier === "gold" ? "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-600" :
                      a.tier === "silver" ? "from-slate-400/20 to-slate-400/5 border-slate-400/30 text-slate-500" :
                      "from-amber-500/20 to-amber-500/5 border-amber-600/30 text-amber-700"
                    }`}>
                      {locked ? <Lock className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    {a.rarity && (
                      <Badge variant="outline" className={`text-[9px] capitalize ${rarityStyle[a.rarity]}`}>{a.rarity}</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {a.unlocked ? `Unlocked · ${a.holdersPct}% hold this` : `${a.holdersPct}% have earned this`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      <canvas ref={cardCanvasRef} className="hidden" />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2 min-w-[64px]">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-base font-semibold tabular-nums leading-tight">{value}</p>
    </div>
  );
}
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
