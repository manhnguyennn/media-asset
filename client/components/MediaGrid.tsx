import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Image,
  Video,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Copy,
  Share,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MediaPreviewModal } from "./MediaPreviewModal";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  size: string;
  dimensions?: string;
  url: string;
  thumbnail: string;
  folder: "user" | "global";
  createdAt: string;
  tags?: string[];
}

interface MediaGridProps {
  selectedFolder?: "user" | "global" | "all";
  selectedType?: "all" | "image" | "video";
  currentPath?: string;
}

// Mock data for demonstration
const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    name: "hero-banner.jpg",
    type: "image",
    size: "2.4 MB",
    dimensions: "1920x1080",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    folder: "global",
    createdAt: "2024-01-15",
    tags: ["banner", "hero"],
  },
  {
    id: "2",
    name: "product-demo.mp4",
    type: "video",
    size: "15.2 MB",
    dimensions: "1280x720",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    folder: "user",
    createdAt: "2024-01-14",
    tags: ["demo", "product"],
  },
  {
    id: "3",
    name: "team-photo.jpg",
    type: "image",
    size: "1.8 MB",
    dimensions: "1600x900",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    folder: "global",
    createdAt: "2024-01-13",
    tags: ["team", "about"],
  },
  {
    id: "4",
    name: "tutorial-intro.mp4",
    type: "video",
    size: "8.7 MB",
    dimensions: "1920x1080",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    folder: "user",
    createdAt: "2024-01-12",
    tags: ["tutorial", "intro"],
  },
  {
    id: "5",
    name: "logo-variations.jpg",
    type: "image",
    size: "890 KB",
    dimensions: "800x600",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    folder: "global",
    createdAt: "2024-01-11",
    tags: ["logo", "branding"],
  },
  {
    id: "6",
    name: "user-avatar.jpg",
    type: "image",
    size: "156 KB",
    dimensions: "400x400",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    folder: "user",
    createdAt: "2024-01-10",
    tags: ["avatar", "profile"],
  },
];

export function MediaGrid({
  selectedFolder = "all",
  selectedType = "all",
  currentPath = "/",
}: MediaGridProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter items based on selected folder and type
  const filteredItems = mockMediaItems.filter((item) => {
    const folderMatch =
      selectedFolder === "all" || item.folder === selectedFolder;
    const typeMatch = selectedType === "all" || item.type === selectedType;
    return folderMatch && typeMatch;
  });

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const openPreview = (item: MediaItem) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewItem(null);
  };

  const updateMediaItem = (updatedItem: MediaItem) => {
    // In a real app, this would update the backend
    console.log("Updated item:", updatedItem);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} items
            {selectedItems.length > 0 && (
              <span className="ml-2">• {selectedItems.length} selected</span>
            )}
          </p>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredItems.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onToggleSelection={toggleSelection}
            onPreview={openPreview}
          />
        ))}
      </div>

      {/* Preview Modal */}
      <MediaPreviewModal
        item={previewItem}
        isOpen={isPreviewOpen}
        onClose={closePreview}
        onUpdate={updateMediaItem}
      />

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Image className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No media found
          </h3>
          <p className="text-muted-foreground">
            No media files match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onPreview: (item: MediaItem) => void;
}

function MediaCard({
  item,
  isSelected,
  onToggleSelection,
  onPreview,
}: MediaCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
      )}
      onClick={() => onToggleSelection(item.id)}
    >
      {/* Thumbnail */}
      <div className="aspect-square relative bg-muted">
        <img
          src={item.thumbnail}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/* Type indicator */}
        <div className="absolute top-2 left-2">
          {item.type === "video" ? (
            <Badge variant="secondary" className="text-xs">
              <Video className="h-3 w-3 mr-1" />
              Video
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              <Image className="h-3 w-3 mr-1" />
              Image
            </Badge>
          )}
        </div>

        {/* Folder indicator */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={item.folder === "global" ? "default" : "outline"}
            className="text-xs"
          >
            {item.folder === "global" ? "Global" : "User"}
          </Badge>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(item);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPreview(item)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 border-2 border-primary" />
        )}
      </div>

      {/* Card info */}
      <div className="p-3 space-y-1">
        <h3 className="font-medium text-sm truncate" title={item.name}>
          {item.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{item.size}</span>
          {item.dimensions && <span>{item.dimensions}</span>}
        </div>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{item.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
