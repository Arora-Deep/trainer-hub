import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "default",
}: EmptyStateProps) {
  const sizes = {
    sm: {
      padding: "py-8",
      icon: "h-10 w-10",
      iconWrapper: "h-16 w-16",
      title: "text-base",
      desc: "text-xs",
    },
    default: {
      padding: "py-12",
      icon: "h-10 w-10",
      iconWrapper: "h-20 w-20",
      title: "text-lg",
      desc: "text-sm",
    },
    lg: {
      padding: "py-16",
      icon: "h-12 w-12",
      iconWrapper: "h-24 w-24",
      title: "text-xl",
      desc: "text-sm",
    },
  };

  const s = sizes[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.padding,
        className
      )}
    >
      {Icon && (
        <div className={cn(
          "rounded-2xl bg-muted/50 flex items-center justify-center mb-4",
          s.iconWrapper
        )}>
          <Icon className={cn("text-muted-foreground/60", s.icon)} />
        </div>
      )}
      <h3 className={cn("font-semibold text-foreground", s.title)}>
        {title}
      </h3>
      {description && (
        <p className={cn("text-muted-foreground max-w-sm mt-1.5 text-balance", s.desc)}>
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}
