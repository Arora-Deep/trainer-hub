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

const variantStyles = {
  default: {
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    accentGlow: "from-muted/50 to-transparent",
  },
  primary: {
    iconBg: "bg-gradient-to-br from-primary/15 to-primary/5",
    iconColor: "text-primary",
    accentGlow: "from-primary/10 via-primary/5 to-transparent",
  },
  success: {
    iconBg: "bg-gradient-to-br from-success/15 to-success/5",
    iconColor: "text-success",
    accentGlow: "from-success/10 via-success/5 to-transparent",
  },
  warning: {
    iconBg: "bg-gradient-to-br from-warning/15 to-warning/5",
    iconColor: "text-warning",
    accentGlow: "from-warning/10 via-warning/5 to-transparent",
  },
  info: {
    iconBg: "bg-gradient-to-br from-info/15 to-info/5",
    iconColor: "text-info",
    accentGlow: "from-info/10 via-info/5 to-transparent",
  },
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
    const styles = variantStyles[variant];
    const isCompact = size === "compact";
    
    return (
      <div 
        ref={ref}
        className={cn(
          "stat-card-premium group relative",
          isCompact ? "p-4" : "p-5",
          className
        )}
      >
        {/* Animated gradient accent */}
        <div className={cn(
          "absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl opacity-60 pointer-events-none transition-opacity duration-500 group-hover:opacity-100",
          styles.accentGlow
        )} />
        
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-1.5">
            <p className={cn(
              "font-medium text-muted-foreground tracking-tight",
              isCompact ? "text-xs" : "text-sm"
            )}>
              {title}
            </p>
            <p className={cn(
              "font-bold tracking-tight text-foreground stat-number",
              isCompact ? "text-2xl" : "text-3xl"
            )}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className={cn(
                "text-muted-foreground/80",
                isCompact ? "text-xs" : "text-sm"
              )}>
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-2 pt-1">
                <div className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                  trend.isPositive 
                    ? "bg-success/15 text-success" 
                    : trend.value === 0 
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/15 text-destructive"
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
                <span className="text-xs text-muted-foreground/60">vs last week</span>
              </div>
            )}
          </div>
          <div className={cn(
            "rounded-2xl transition-all duration-300 group-hover:scale-105",
            isCompact ? "p-3" : "p-3.5",
            styles.iconBg
          )}>
            <Icon className={cn(
              isCompact ? "h-5 w-5" : "h-6 w-6",
              styles.iconColor
            )} />
          </div>
        </div>
      </div>
    );
  }
);
