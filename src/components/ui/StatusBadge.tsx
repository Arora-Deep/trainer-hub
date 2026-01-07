import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "default" | "primary";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showDot?: boolean;
  className?: string;
}

const statusStyles: Record<StatusType, { bg: string; text: string; dot: string }> = {
  success: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  error: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
  },
  default: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
  },
};

export function StatusBadge({ status, label, showDot = true, className }: StatusBadgeProps) {
  const styles = statusStyles[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles.bg,
        styles.text,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      )}
      {label}
    </span>
  );
}
