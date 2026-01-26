import * as React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "primary" | "default" | "neutral" | "orange";
  label: string;
  size?: "sm" | "default";
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const statusStyles = {
  success: {
    badge: "bg-success/10 text-success",
    dot: "bg-success",
  },
  warning: {
    badge: "bg-warning/10 text-warning",
    dot: "bg-warning",
  },
  error: {
    badge: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  info: {
    badge: "bg-info/10 text-info",
    dot: "bg-info",
  },
  primary: {
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  orange: {
    badge: "bg-orange-500/10 text-orange-500",
    dot: "bg-orange-500",
  },
  default: {
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  neutral: {
    badge: "bg-secondary text-secondary-foreground",
    dot: "bg-secondary-foreground/50",
  },
};

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge(
    {
      status,
      label,
      size = "default",
      dot = true,
      pulse = false,
      className,
    },
    ref
  ) {
    const styles = statusStyles[status];
    const isSmall = size === "sm";

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-semibold",
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
          styles.badge,
          className
        )}
      >
        {dot && (
          <span className="relative flex h-1.5 w-1.5">
            {pulse && (
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
                  styles.dot
                )}
              />
            )}
            <span
              className={cn(
                "relative inline-flex rounded-full h-1.5 w-1.5",
                styles.dot
              )}
            />
          </span>
        )}
        {label}
      </span>
    );
  }
);
