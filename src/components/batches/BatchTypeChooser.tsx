import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchTypeChooser({ open, onOpenChange }: Props) {
  const navigate = useNavigate();

  const choose = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const options = [
    {
      label: "Live cohort batch",
      desc: "Fixed schedule, trainer-led sessions, participants share a timeline with cloned VMs.",
      icon: Users,
      path: "/batches/create",
      accent: "from-primary/10 to-primary/5",
    },
    {
      label: "Self-paced batch",
      desc: "Always-open enrollment, on-demand labs from your template library, no fixed schedule.",
      icon: Sparkles,
      path: "/batches/create-self-paced",
      accent: "from-violet-500/10 to-violet-500/5",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a new batch</DialogTitle>
          <DialogDescription>Pick the delivery model — you can't change this later.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {options.map((o) => (
            <button
              key={o.label}
              onClick={() => choose(o.path)}
              className={cn(
                "text-left p-5 rounded-2xl border-2 border-border hover:border-primary/40 hover:shadow-sm transition-all bg-gradient-to-br",
                o.accent
              )}
            >
              <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center mb-3 shadow-sm">
                <o.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold">{o.label}</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{o.desc}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
