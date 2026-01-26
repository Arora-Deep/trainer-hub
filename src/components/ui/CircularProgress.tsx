import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  color?: "primary" | "orange" | "success";
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  showValue = true,
  color = "primary"
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  const colorClasses = {
    primary: "stroke-primary",
    orange: "stroke-[hsl(32,95%,55%)]",
    success: "stroke-success"
  };

  return (
    <div className={cn("circular-progress", className)}>
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          className="stroke-muted"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn(colorClasses[color], "transition-all duration-700 ease-out")}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{value}%</span>
          <span className="text-xs text-muted-foreground">this week</span>
        </div>
      )}
    </div>
  );
}
