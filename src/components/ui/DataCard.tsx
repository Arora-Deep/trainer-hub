import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface DataCardProps {
  title: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  badge?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

export const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  function DataCard(
    {
      title,
      icon: Icon,
      action,
      badge,
      className,
      contentClassName,
      children,
      noPadding = false,
    },
    ref
  ) {
    return (
      <Card ref={ref} className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="rounded-lg bg-muted p-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            {badge}
          </div>
          {action && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1 -mr-2 text-xs"
              asChild={!!action.href}
              onClick={action.onClick}
            >
              {action.href ? (
                <Link to={action.href}>
                  {action.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : (
                <>
                  {action.label}
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent className={cn(
          noPadding ? "p-0" : "pt-0",
          contentClassName
        )}>
          {children}
        </CardContent>
      </Card>
    );
  }
);
