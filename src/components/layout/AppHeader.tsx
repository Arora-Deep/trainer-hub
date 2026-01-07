import { useLocation } from "react-router-dom";

// Helper to generate breadcrumb from pathname
function getBreadcrumbFromPath(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return ["Statistics"];
  
  return segments.map((segment, index) => {
    // Capitalize and format segment
    const formatted = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formatted;
  });
}

export function AppHeader() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbFromPath(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center border-b border-border bg-background px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>
    </header>
  );
}
