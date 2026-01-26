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
  variant?: "default" | "primary" | "success" | "warning" | "info" | "orange";
  size?: "default" | "compact";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  success: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  info: {
    iconBg: "bg-info/10",
    iconColor: "text-info",
  },
  orange: {
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
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
          "card-soft group",
          isCompact ? "p-4" : "p-5",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-1.5">
            <p className={cn(
              "font-medium text-muted-foreground",
              isCompact ? "text-xs" : "text-sm"
            )}>
              {title}
            </p>
            <p className={cn(
              "font-bold text-foreground stat-number",
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
              <div className="flex items-center gap-2 pt-1">
                <div className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                  trend.isPositive 
                    ? "bg-success/10 text-success" 
                    : trend.value === 0 
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive"
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
            "rounded-2xl p-3 transition-transform duration-300 group-hover:scale-105",
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
