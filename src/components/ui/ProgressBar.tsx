import * as React from "react";
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

const sizeStyles = {
  sm: "h-1.5",
  default: "h-2",
  lg: "h-3",
};

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    {
      value,
      max = 100,
      size = "default",
      variant = "primary",
      showValue = false,
      className,
      animated = true,
    },
    ref
  ) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn("flex items-center gap-3", className)}>
        <div className={cn(
          "flex-1 rounded-full bg-muted/60 overflow-hidden",
          sizeStyles[size]
        )}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out relative",
              variant === "primary" && "progress-gradient",
              variant === "success" && "bg-success",
              variant === "warning" && "bg-warning",
              variant === "info" && "bg-info",
              variant === "default" && "bg-foreground",
            )}
            style={{ 
              width: `${percentage}%`,
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {animated && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                style={{
                  animation: "shimmer 2s infinite linear",
                }}
              />
            )}
          </div>
        </div>
        {showValue && (
          <span className="text-xs font-semibold tabular-nums text-muted-foreground w-10 text-right">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
