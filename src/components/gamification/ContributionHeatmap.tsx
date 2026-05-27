import { useMemo } from "react";

interface Props {
  data: number[]; // length = weeks * 7, values 0-4
  cellSize?: number;
  gap?: number;
  className?: string;
}

const intensityClass = [
  "fill-muted",
  "fill-primary/25",
  "fill-primary/45",
  "fill-primary/70",
  "fill-primary",
];

export function ContributionHeatmap({ data, cellSize = 11, gap = 3, className }: Props) {
  const weeks = useMemo(() => {
    const w: number[][] = [];
    for (let i = 0; i < data.length; i += 7) w.push(data.slice(i, i + 7));
    return w;
  }, [data]);

  const totals = useMemo(() => {
    const active = data.filter((v) => v > 0).length;
    const sum = data.reduce((a, b) => a + b, 0);
    return { active, sum, days: data.length };
  }, [data]);

  const monthLabels = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
        <span>{totals.active} active days in the last 6 months</span>
        <span className="flex items-center gap-1">
          Less
          <svg width={cellSize * 5 + gap * 4} height={cellSize}>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={i * (cellSize + gap)} y={0} width={cellSize} height={cellSize} rx={2} className={intensityClass[i]} />
            ))}
          </svg>
          More
        </span>
      </div>
      <svg
        width={weeks.length * (cellSize + gap)}
        height={7 * (cellSize + gap) + 16}
        className="block max-w-full"
      >
        {monthLabels.map((m, i) => (
          <text
            key={m}
            x={(weeks.length / 6) * (cellSize + gap) * i}
            y={10}
            className="fill-muted-foreground text-[9px]"
          >
            {m}
          </text>
        ))}
        <g transform="translate(0, 16)">
          {weeks.map((week, x) =>
            week.map((v, y) => (
              <rect
                key={`${x}-${y}`}
                x={x * (cellSize + gap)}
                y={y * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                rx={2}
                className={intensityClass[v]}
              >
                <title>Day {x * 7 + y + 1} · intensity {v}</title>
              </rect>
            ))
          )}
        </g>
      </svg>
    </div>
  );
}
