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

const variantAccent: Record<string, string> = {
  default: "from-muted-foreground/20 to-muted-foreground/5",
  primary: "from-primary/30 to-primary/5",
  success: "from-success/30 to-success/5",
  warning: "from-warning/30 to-warning/5",
  info: "from-info/30 to-info/5",
};

const variantIcon: Record<string, string> = {
  default: "bg-muted/60 text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

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
          "relative rounded-2xl border border-black/[0.06] bg-white/25 backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:bg-white/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:bg-white/[0.04] dark:hover:bg-white/[0.06]",
          isCompact ? "p-4" : "p-5",
          className
        )}
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Top accent gradient line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r",
          variantAccent[variant]
        )} />

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
            "rounded-xl flex items-center justify-center",
            isCompact ? "p-2.5" : "p-3",
            variantIcon[variant]
          )}>
            <Icon className={cn(
              isCompact ? "h-5 w-5" : "h-5 w-5",
            )} />
          </div>
        </div>
      </div>
    );
  }
);
