import { Breadcrumbs } from "./Breadcrumbs";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  compact = false,
}: PageHeaderProps) {
  return (
    <div className={cn(
      "space-y-1",
      compact ? "pb-4" : "pb-2",
      className
    )}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 min-w-0">
          <h1 className={cn(
            "font-semibold tracking-tight text-foreground",
            compact ? "text-xl" : "text-2xl"
          )}>
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl text-balance leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
