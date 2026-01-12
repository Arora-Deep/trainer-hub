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
    badge: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  warning: {
    badge: "bg-warning/10 text-warning border-warning/20",
    dot: "bg-warning",
  },
  error: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  info: {
    badge: "bg-info/10 text-info border-info/20",
    dot: "bg-info",
  },
  primary: {
    badge: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  default: {
    badge: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  neutral: {
    badge: "bg-secondary text-secondary-foreground border-border",
    dot: "bg-secondary-foreground/50",
  },
};

export function StatusBadge({
  status,
  label,
  size = "default",
  dot = true,
  pulse = false,
  className,
}: StatusBadgeProps) {
  const styles = statusStyles[status];
  const isSmall = size === "sm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        styles.badge,
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-50 animate-ping",
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
