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
  variant?: "default" | "primary" | "success" | "warning" | "info" | "coral";
  size?: "default" | "compact";
  className?: string;
}

const variantIconStyles: Record<string, string> = {
  default: "icon-container",
  primary: "icon-container-primary",
  success: "icon-container-success",
  warning: "icon-container",
  info: "icon-container-primary",
  coral: "icon-container-coral",
};

const variantIconColors: Record<string, string> = {
  default: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  coral: "text-coral",
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
          "rounded-2xl border border-border/60 bg-card group transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-border",
          isCompact ? "p-4" : "p-5",
          className
        )}
        style={{ 
          boxShadow: "var(--shadow-card)",
          background: "var(--gradient-surface)",
        }}
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
              "font-bold tracking-tight text-foreground tabular-nums",
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
                  "flex items-center gap-1 text-xs font-semibold rounded-full px-1.5 py-0.5",
                  trend.isPositive 
                    ? "text-success bg-success/8" 
                    : trend.value === 0 
                      ? "text-muted-foreground"
                      : "text-destructive bg-destructive/8"
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
            isCompact ? "p-2.5" : "p-3",
            variantIconStyles[variant] || "icon-container",
          )}>
            <Icon className={cn(
              "h-5 w-5",
              variantIconColors[variant] || "text-muted-foreground",
            )} />
          </div>
        </div>
      </div>
    );
  }
);
