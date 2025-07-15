import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbNavProps {
  path: string;
  onNavigate?: (path: string) => void;
}

export function BreadcrumbNav({ path, onNavigate }: BreadcrumbNavProps) {
  const pathSegments = path.split("/").filter(Boolean);

  const formatSegmentName = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleNavigate = (index: number) => {
    if (index === -1) {
      onNavigate?.("/");
    } else {
      const newPath = "/" + pathSegments.slice(0, index + 1).join("/");
      onNavigate?.(newPath);
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {/* Home */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => handleNavigate(-1)}
      >
        <Home className="h-3 w-3" />
      </Button>

      {pathSegments.length > 0 && (
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
      )}

      {/* Path segments */}
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 px-2 text-muted-foreground hover:text-foreground",
              index === pathSegments.length - 1 &&
                "text-foreground font-medium",
            )}
            onClick={() => handleNavigate(index)}
          >
            <Folder className="h-3 w-3 mr-1" />
            {formatSegmentName(segment)}
          </Button>

          {index < pathSegments.length - 1 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
