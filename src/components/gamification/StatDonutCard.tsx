import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type Variant = "violet" | "magenta" | "cyan" | "lime" | "amber";

const gradients: Record<Variant, { from: string; to: string; id: string }> = {
  violet:  { from: "#a78bfa", to: "#ec4899", id: "g-v" },
  magenta: { from: "#f0abfc", to: "#a855f7", id: "g-m" },
  cyan:    { from: "#22d3ee", to: "#6366f1", id: "g-c" },
  lime:    { from: "#a3e635", to: "#22d3ee", id: "g-l" },
  amber:   { from: "#fbbf24", to: "#f43f5e", id: "g-a" },
};

interface Props {
  label: string;
  value: number;        // 0-100 (percent)
  primary: string;      // big text (e.g. "58 sales")
  secondary?: string;   // sub line
  icon?: LucideIcon;
  variant?: Variant;
}

export function StatDonutCard({ label, value, primary, secondary, icon: Icon, variant = "violet" }: Props) {
  const grad = gradients[variant];
  const gradId = `${grad.id}-${label.replace(/\s+/g, "")}`;
  const R = 36;
  const C = 2 * Math.PI * R;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * C;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold tracking-tight">{label}</p>
          {Icon && (
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="relative h-[92px] w-[92px] shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={grad.from} />
                  <stop offset="100%" stopColor={grad.to} />
                </linearGradient>
                <filter id={`${gradId}-glow`}>
                  <feGaussianBlur stdDeviation="1.4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="50" cy="50" r={R} fill="none" className="sp-donut-track" strokeWidth="8" />
              <circle
                cx="50" cy="50" r={R} fill="none"
                stroke={`url(#${gradId})`} strokeWidth="8" strokeLinecap="round"
                filter={`url(#${gradId}-glow)`}
                strokeDasharray={`${dash} ${C}`}
                style={{ transition: "stroke-dasharray .7s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold tabular-nums">{value}%</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">{primary}</p>
            {secondary && (
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{secondary}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
