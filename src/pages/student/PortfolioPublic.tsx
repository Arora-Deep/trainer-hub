import { useParams, Link } from "react-router-dom";
import { useGamificationStore, pathProgress } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ExternalLink, FlaskConical, Swords, Lock } from "lucide-react";

export default function PortfolioPublic() {
  const { handle } = useParams<{ handle: string }>();
  const { profile, portfolio, skillMastery, learningPaths, challenges, completedLabs } = useGamificationStore();

  // In a real app you'd fetch the user by handle. Mock: only "sarah" resolves.
  const isMatch = handle === portfolio.handle;
  if (!isMatch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-2">
            <h1 className="text-xl font-semibold">Portfolio not found</h1>
            <p className="text-sm text-muted-foreground">No portfolio exists for @{handle}.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!portfolio.isPublic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-2">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
            <h1 className="text-xl font-semibold">This portfolio is private</h1>
            <p className="text-sm text-muted-foreground">@{handle} has not made their portfolio public.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topSkills = [...skillMastery].sort((a, b) => b.mastery - a.mastery).slice(0, 5);
  const completedPaths = learningPaths.filter((p) => pathProgress(p).pct === 100);
  const inProgressPaths = learningPaths.filter((p) => pathProgress(p).pct > 0 && pathProgress(p).pct < 100);
  const completedChallenges = challenges.filter((c) => c.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <Briefcase className="h-4 w-4 text-primary" /> Platform Portfolio
          </Link>
          <span className="text-[11px] text-muted-foreground">@{portfolio.handle}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-primary-foreground text-3xl font-bold shrink-0">
            {profile.avatarInitials}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{portfolio.headline}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{profile.batchName}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {portfolio.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-[11px] inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border hover:bg-muted/40">
                  <ExternalLink className="h-3 w-3" /> {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Top skills */}
        <PublicSection title="Top skills">
          <Card><CardContent className="p-5 space-y-3">
            {topSkills.map((s) => (
              <div key={s.key} className="space-y-1.5">
                <div className="flex justify-between text-xs"><span className="font-medium">{s.label}</span><span className="tabular-nums text-muted-foreground">{s.mastery}%</span></div>
                <Progress value={s.mastery} className="h-1.5" />
              </div>
            ))}
          </CardContent></Card>
        </PublicSection>

        {/* Paths */}
        <PublicSection title="Learning paths">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...completedPaths, ...inProgressPaths].map((p) => {
              const pp = pathProgress(p);
              return (
                <Card key={p.slug}><CardContent className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <Badge variant="outline" className={`text-[10px] ${pp.pct === 100 ? "text-success border-success/30 bg-success/10" : ""}`}>
                      {pp.pct === 100 ? "Completed" : `${pp.pct}%`}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{p.tagline}</p>
                  <Progress value={pp.pct} className="h-1.5" />
                </CardContent></Card>
              );
            })}
          </div>
        </PublicSection>

        {/* Labs */}
        <PublicSection title="Labs shipped">
          <Card><CardContent className="p-2">
            {completedLabs.map((l, i) => (
              <div key={l.id} className={`p-3 flex items-start gap-3 ${i !== completedLabs.length - 1 ? "border-b border-border/50" : ""}`}>
                <FlaskConical className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{l.title}</p>
                  <p className="text-[11px] text-muted-foreground">{l.outcome}</p>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">{l.completedAt}</span>
              </div>
            ))}
          </CardContent></Card>
        </PublicSection>

        {/* Challenges */}
        {completedChallenges.length > 0 && (
          <PublicSection title="Challenges won">
            <Card><CardContent className="p-2">
              {completedChallenges.map((c, i) => (
                <div key={c.id} className={`p-3 flex items-center gap-3 ${i !== completedChallenges.length - 1 ? "border-b border-border/50" : ""}`}>
                  <Swords className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.difficulty} · {c.reward ?? "Cleared"}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{c.completedAt}</span>
                </div>
              ))}
            </CardContent></Card>
          </PublicSection>
        )}

        <footer className="pt-8 pb-12 text-center text-[11px] text-muted-foreground">
          Powered by <Link to="/" className="text-primary hover:underline">Platform</Link>
        </footer>
      </main>
    </div>
  );
}

function PublicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
