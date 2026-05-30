import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface Row {
  label: string;
  value: string;
}

interface Props {
  title: string;
  rows: Row[];
}

export function TierListCard({ title, rows }: Props) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white"
               style={{ background: "linear-gradient(135deg, #a78bfa, #22d3ee)" }}>
            <Wallet className="h-3.5 w-3.5" />
          </div>
        </div>

        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.label} className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <span className="text-foreground/40">›</span>
                <span className="text-foreground/90">{r.label}</span>
              </span>
              <span
                className="font-bold tabular-nums sp-gradient-text"
                style={{
                  // Stagger color a bit per row using opacity for hierarchy
                  opacity: 1 - i * 0.08,
                }}
              >
                {r.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
