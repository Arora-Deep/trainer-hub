import { useGamificationStore, pathProgress } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { useNavigate } from "react-router-dom";
import { Share2, ExternalLink, Settings as SettingsIcon, Award, Route, Swords, FlaskConical, BadgeCheck, Globe, Lock, Copy, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Portfolio() {
  const { profile, skillMastery, learningPaths, challenges, completedLabs, portfolio, setPortfolio } = useGamificationStore();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(portfolio);

  const topSkills = [...skillMastery].sort((a, b) => b.mastery - a.mastery).slice(0, 5);
  const completedPaths = learningPaths.filter((p) => pathProgress(p).pct === 100);
  const inProgressPaths = learningPaths.filter((p) => pathProgress(p).pct > 0 && pathProgress(p).pct < 100);
  const completedChallenges = challenges.filter((c) => c.status === "completed");

  const publicUrl = `${window.location.origin}/p/${portfolio.handle}`;

  const copy = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Portfolio link copied");
  };

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="violet"
        eyebrow="Portfolio"
        icon={Briefcase}
        title={<>Your <span className="text-white/95">proof of work</span>.</>}
        description="Public portfolio — what you've shipped, mastered, and won. Share it with recruiters and your network."
        actions={
          <>
            <Button onClick={copy} className="gap-1.5 bg-white text-foreground hover:bg-white/90">
              <Share2 className="h-4 w-4" /> Share portfolio
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/p/${portfolio.handle}`, "_blank")}
              className="gap-1.5 bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              <ExternalLink className="h-4 w-4" /> Preview public
            </Button>
          </>
        }
      />

      {/* Header card */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
            {profile.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-semibold tracking-tight">{profile.name}</h2>
              <Badge variant="outline" className="text-[10px]">@{portfolio.handle}</Badge>
              {portfolio.isPublic ? (
                <Badge variant="outline" className="text-[10px] gap-1 text-success border-success/30 bg-success/10">
                  <Globe className="h-3 w-3" /> Public
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Lock className="h-3 w-3" /> Private
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{portfolio.headline}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{profile.batchName}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {portfolio.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border hover:bg-muted/40"
                >
                  <ExternalLink className="h-3 w-3" /> {l.label}
                </a>
              ))}
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <SettingsIcon className="h-3.5 w-3.5" /> Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Portfolio settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="handle">Handle</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">/p/</span>
                    <Input id="handle" value={draft.handle} onChange={(e) => setDraft({ ...draft, handle: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="headline">Headline</Label>
                  <Input id="headline" value={draft.headline} onChange={(e) => setDraft({ ...draft, headline: e.target.value })} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Public portfolio</p>
                    <p className="text-[11px] text-muted-foreground">Anyone with the link can view.</p>
                  </div>
                  <Switch checked={draft.isPublic} onCheckedChange={(v) => setDraft({ ...draft, isPublic: v })} />
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Public URL</Label>
                  <div className="flex items-center gap-2">
                    <Input readOnly value={publicUrl} className="font-mono text-xs" />
                    <Button size="icon" variant="outline" onClick={copy} className="shrink-0"><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <Button className="w-full" onClick={() => { setPortfolio(draft); toast.success("Portfolio updated"); }}>
                  Save changes
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      {/* Top Skills */}
      <Section title="Top skills" subtitle="Where your mastery is concentrated">
        <Card>
          <CardContent className="p-5 space-y-3">
            {topSkills.map((s) => (
              <div key={s.key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{s.label}</span>
                  <span className="tabular-nums text-muted-foreground">{s.mastery}% mastery</span>
                </div>
                <Progress value={s.mastery} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      {/* Learning paths */}
      <Section title="Learning paths" subtitle="Completed and in-progress journeys">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...completedPaths, ...inProgressPaths].map((p) => {
            const pp = pathProgress(p);
            return (
              <Card key={p.slug} className="cursor-pointer" onClick={() => navigate(`/student/paths/${p.slug}`)}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{p.tagline}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${pp.pct === 100 ? "text-success border-success/30 bg-success/10" : ""}`}>
                      {pp.pct === 100 ? "Completed" : `${pp.pct}%`}
                    </Badge>
                  </div>
                  <Progress value={pp.pct} className="h-1.5" />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{pp.done} / {pp.total} modules</span>
                    <span>{p.mastery}% mastery</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Certificates teaser */}
      <Section
        title="Certificates"
        subtitle="Earned credentials"
        action={<Button variant="ghost" size="sm" onClick={() => navigate("/student/certificates")}>View all</Button>}
      >
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Your certificates live in the Trophy Room.</p>
              <p className="text-[11px] text-muted-foreground">Each completion adds a verifiable certificate to your portfolio.</p>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Labs shipped */}
      <Section title="Labs shipped" subtitle="Hands-on engineering with outcomes">
        <Card>
          <CardContent className="p-2">
            {completedLabs.map((l, i) => (
              <div key={l.id} className={`p-3 flex items-start gap-3 ${i !== completedLabs.length - 1 ? "border-b border-border/50" : ""}`}>
                <FlaskConical className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{l.title}</p>
                  <p className="text-[11px] text-muted-foreground">{l.outcome}</p>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{l.completedAt}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      {/* Challenges won */}
      <Section title="Challenges won" subtitle="Scenarios cleared end-to-end">
        {completedChallenges.length === 0 ? (
          <Card><CardContent className="p-5 text-sm text-muted-foreground">No challenges cleared yet — <button onClick={() => navigate("/student/challenges")} className="text-primary hover:underline">browse open challenges</button>.</CardContent></Card>
        ) : (
          <Card>
            <CardContent className="p-2">
              {completedChallenges.map((c, i) => (
                <div key={c.id} className={`p-3 flex items-center gap-3 ${i !== completedChallenges.length - 1 ? "border-b border-border/50" : ""}`}>
                  <Swords className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.difficulty} · {c.reward ?? "Cleared"}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{c.completedAt}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </Section>
    </div>
  );
}

function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
