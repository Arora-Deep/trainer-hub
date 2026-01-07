import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "default" | "primary";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-green-50 text-green-700",
  warning: "bg-orange-50 text-orange-700",
  error: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  default: "bg-muted text-muted-foreground",
  primary: "bg-foreground text-background",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {label}
    </span>
  );
}
