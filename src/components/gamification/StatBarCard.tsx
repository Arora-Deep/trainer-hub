import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type Variant = "violet" | "cyan" | "lime" | "amber";

const gradients: Record<Variant, { from: string; to: string }> = {
  violet: { from: "#a78bfa", to: "#7c3aed" },
  cyan:   { from: "#22d3ee", to: "#3b82f6" },
  lime:   { from: "#a3e635", to: "#10b981" },
  amber:  { from: "#fbbf24", to: "#ef4444" },
};

interface Props {
  label: string;
  primary: string;          // big number
  subtitle?: string;
  bars: number[];           // 6-12 values
  trend?: { dir: "up" | "down"; pct: number };
  variant?: Variant;
}

export function StatBarCard({ label, primary, subtitle, bars, trend, variant = "violet" }: Props) {
  const grad = gradients[variant];
  const gradId = `bar-${variant}-${label.replace(/\s+/g, "")}`;
  const max = Math.max(...bars, 1);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight">{label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">{primary}</p>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                trend.dir === "up"
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "bg-rose-500/15 text-rose-500"
              }`}
            >
              {trend.dir === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.pct}%
            </span>
          )}
        </div>

        <svg viewBox="0 0 200 56" className="mt-4 w-full h-14">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={grad.from} />
              <stop offset="100%" stopColor={grad.to} />
            </linearGradient>
          </defs>
          {bars.map((b, i) => {
            const w = (200 - (bars.length - 1) * 4) / bars.length;
            const h = (b / max) * 48;
            const x = i * (w + 4);
            const y = 56 - h;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={Math.min(w / 2, 4)}
                fill={`url(#${gradId})`}
                opacity={0.85 + (i / bars.length) * 0.15}
              />
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}
