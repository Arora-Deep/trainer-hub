import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "info";
  showValue?: boolean;
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  default: "bg-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

const sizeStyles = {
  sm: "h-1",
  default: "h-1.5",
  lg: "h-2.5",
};

export function ProgressBar({
  value,
  max = 100,
  size = "default",
  variant = "primary",
  showValue = false,
  className,
  animated = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "flex-1 rounded-full bg-muted/80 overflow-hidden",
        sizeStyles[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[variant],
            animated && "relative overflow-hidden"
          )}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
      {showValue && (
        <span className="text-xs font-medium tabular-nums text-muted-foreground w-9 text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
