import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "info";
  size?: "default" | "compact";
  className?: string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard(
    { 
      title, 
      value, 
      icon: Icon, 
      description, 
      trend, 
      variant = "primary",
      size = "default",
      className 
    },
    ref
  ) {
    const isCompact = size === "compact";
    
    return (
      <div 
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-card",
          isCompact ? "p-4" : "p-5",
          className
        )}
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-1">
            <p className={cn(
              "font-medium text-muted-foreground",
              isCompact ? "text-xs" : "text-sm"
            )}>
              {title}
            </p>
            <p className={cn(
              "font-semibold tracking-tight text-foreground tabular-nums",
              isCompact ? "text-2xl" : "text-3xl"
            )}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className={cn(
                "text-muted-foreground",
                isCompact ? "text-xs" : "text-sm"
              )}>
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-2 pt-0.5">
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  trend.isPositive 
                    ? "text-success" 
                    : trend.value === 0 
                      ? "text-muted-foreground"
                      : "text-destructive"
                )}>
                  {trend.value === 0 ? (
                    <Minus className="h-3 w-3" />
                  ) : trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
            )}
          </div>
          <div className={cn(
            "rounded-xl bg-muted flex items-center justify-center",
            isCompact ? "p-2.5" : "p-3",
          )}>
            <Icon className={cn(
              "text-muted-foreground",
              isCompact ? "h-5 w-5" : "h-5 w-5",
            )} />
          </div>
        </div>
      </div>
    );
  }
);
