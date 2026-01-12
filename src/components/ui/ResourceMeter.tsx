import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ResourceMeterProps {
  value: number;
  max?: number;
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "default";
  showValue?: boolean;
  className?: string;
}

export function ResourceMeter({
  value,
  max = 100,
  label,
  icon: Icon,
  variant = "default",
  size = "default",
  showValue = true,
  className,
}: ResourceMeterProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Auto variant based on value
  const autoVariant = variant === "default" 
    ? percentage > 80 ? "danger" : percentage > 60 ? "warning" : "success"
    : variant;

  const variantStyles = {
    default: "bg-foreground/80",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  };

  const isSmall = size === "sm";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Icon && (
        <Icon className={cn(
          "text-muted-foreground shrink-0",
          isSmall ? "h-3 w-3" : "h-3.5 w-3.5"
        )} />
      )}
      {label && (
        <span className={cn(
          "text-muted-foreground shrink-0",
          isSmall ? "text-[10px]" : "text-xs"
        )}>
          {label}
        </span>
      )}
      <div className={cn(
        "flex-1 rounded-full bg-muted/60 overflow-hidden min-w-[40px]",
        isSmall ? "h-1" : "h-1.5"
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variantStyles[autoVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className={cn(
          "font-medium tabular-nums text-muted-foreground shrink-0",
          isSmall ? "text-[10px] w-6" : "text-xs w-8"
        )}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
