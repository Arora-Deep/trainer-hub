import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
    icon: "bg-muted text-muted-foreground",
    iconHover: "group-hover:bg-muted/80",
    accent: "from-muted/50 to-transparent",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    iconHover: "group-hover:bg-primary/15 group-hover:scale-105",
    accent: "from-primary/5 to-transparent",
  },
  success: {
    icon: "bg-success/10 text-success",
    iconHover: "group-hover:bg-success/15 group-hover:scale-105",
    accent: "from-success/5 to-transparent",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    iconHover: "group-hover:bg-warning/15 group-hover:scale-105",
    accent: "from-warning/5 to-transparent",
  },
  info: {
    icon: "bg-info/10 text-info",
    iconHover: "group-hover:bg-info/15 group-hover:scale-105",
    accent: "from-info/5 to-transparent",
  },
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  variant = "primary",
  size = "default",
  className 
}: StatCardProps) {
  const styles = variantStyles[variant];
  const isCompact = size === "compact";
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/60 bg-card",
        "transition-all duration-200 hover:border-border hover:shadow-md",
        isCompact ? "p-4" : "p-5",
        className
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Subtle gradient accent */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl opacity-50 pointer-events-none",
        styles.accent
      )} />
      
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1">
          <p className={cn(
            "font-medium text-muted-foreground tracking-tight",
            isCompact ? "text-xs" : "text-sm"
          )}>
            {title}
          </p>
          <p className={cn(
            "font-semibold tracking-tight text-foreground stat-number",
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
            <div className="flex items-center gap-1.5 pt-1">
              <div className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium",
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
              <span className="text-xs text-muted-foreground/70">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn(
          "rounded-xl transition-all duration-200",
          isCompact ? "p-2.5" : "p-3",
          styles.icon,
          styles.iconHover
        )}>
          <Icon className={cn(isCompact ? "h-4 w-4" : "h-5 w-5")} />
        </div>
      </div>
    </div>
  );
}
