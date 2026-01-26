import * as React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "primary" | "default" | "neutral";
  label: string;
  size?: "sm" | "default";
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const statusStyles = {
  success: {
    badge: "bg-success/15 text-success border-success/25",
    dot: "bg-success",
  },
  warning: {
    badge: "bg-warning/15 text-warning border-warning/25",
    dot: "bg-warning",
  },
  error: {
    badge: "bg-destructive/15 text-destructive border-destructive/25",
    dot: "bg-destructive",
  },
  info: {
    badge: "bg-info/15 text-info border-info/25",
    dot: "bg-info",
  },
  primary: {
    badge: "bg-primary/15 text-primary border-primary/25",
    dot: "bg-primary",
  },
  default: {
    badge: "bg-muted text-muted-foreground border-border/50",
    dot: "bg-muted-foreground",
  },
  neutral: {
    badge: "bg-secondary text-secondary-foreground border-border/50",
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
          "inline-flex items-center gap-1.5 rounded-full border font-semibold backdrop-blur-sm",
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
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
