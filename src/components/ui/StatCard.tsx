import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
  className?: string;
}

const variantStyles = {
  default: {
    icon: "bg-muted text-muted-foreground",
    value: "text-foreground",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
  },
  success: {
    icon: "bg-success/10 text-success",
    value: "text-foreground",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    value: "text-foreground",
  },
  info: {
    icon: "bg-info/10 text-info",
    value: "text-foreground",
  },
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  variant = "primary",
  className 
}: StatCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5",
        "transition-all duration-200 hover:border-border/80 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground tracking-tight">
            {title}
          </p>
          <p className={cn("mt-2 text-3xl font-semibold tracking-tight", styles.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground/80">
              {description}
            </p>
          )}
          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              {trend.isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-muted-foreground/70">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-xl p-3 transition-transform duration-200 group-hover:scale-105", styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
