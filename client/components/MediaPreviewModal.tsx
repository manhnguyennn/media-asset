import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Copy,
  Share,
  Edit,
  Save,
  X,
  Calendar,
  Folder,
  FileText,
  Image,
  Video,
  Code,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

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
  description?: string;
  alt?: string;
}

interface MediaPreviewModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (item: MediaItem) => void;
}

export function MediaPreviewModal({
  item,
  isOpen,
  onClose,
  onUpdate,
}: MediaPreviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<MediaItem | null>(null);

  React.useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
    }
  }, [item]);

  if (!item || !editedItem) return null;

  const handleSave = () => {
    if (onUpdate && editedItem) {
      onUpdate(editedItem);
      setIsEditing(false);
      toast.success("Media updated successfully");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(item.url);
    toast.success("URL copied to clipboard");
  };

  const handleCopyEmbedCode = (type: "html" | "markdown" | "url") => {
    let code = "";
    switch (type) {
      case "html":
        if (item.type === "image") {
          code = `<img src="${item.url}" alt="${editedItem.alt || item.name}" width="${item.dimensions?.split("x")[0]}" height="${item.dimensions?.split("x")[1]}" />`;
        } else {
          code = `<video src="${item.url}" controls width="${item.dimensions?.split("x")[0]}" height="${item.dimensions?.split("x")[1]}"></video>`;
        }
        break;
      case "markdown":
        if (item.type === "image") {
          code = `![${editedItem.alt || item.name}](${item.url})`;
        } else {
          code = `[${item.name}](${item.url})`;
        }
        break;
      case "url":
        code = item.url;
        break;
    }
    navigator.clipboard.writeText(code);
    toast.success(`${type.toUpperCase()} code copied to clipboard`);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {item.name}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {/* Preview */}
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  {item.type === "image" ? (
                    <Image className="h-4 w-4" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                  <span className="capitalize">{item.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{item.size}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Folder className="h-4 w-4" />
                  <Badge
                    variant={item.folder === "global" ? "default" : "outline"}
                  >
                    {item.folder === "global" ? "Global" : "User"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details and Embed */}
          <div className="space-y-4">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="embed">Embed</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">File Name</Label>
                      <Input
                        id="name"
                        value={editedItem.name}
                        onChange={(e) =>
                          setEditedItem({ ...editedItem, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alt">Alt Text</Label>
                      <Input
                        id="alt"
                        value={editedItem.alt || ""}
                        onChange={(e) =>
                          setEditedItem({ ...editedItem, alt: e.target.value })
                        }
                        placeholder="Describe this media for accessibility"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editedItem.description || ""}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            description: e.target.value,
                          })
                        }
                        placeholder="Add a description for this media"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={editedItem.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedItem({ ...item });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-foreground mb-2">
                        File Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Dimensions:
                          </span>
                          <span>{item.dimensions || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size:</span>
                          <span>{item.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="capitalize">{item.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Folder:</span>
                          <Badge
                            variant={
                              item.folder === "global" ? "default" : "outline"
                            }
                          >
                            {item.folder === "global" ? "Global" : "User"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {editedItem.description && (
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {editedItem.description}
                        </p>
                      </div>
                    )}

                    {editedItem.alt && (
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">
                          Alt Text
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {editedItem.alt}
                        </p>
                      </div>
                    )}

                    {editedItem.tags && editedItem.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {editedItem.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="embed" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">HTML</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyEmbedCode("html")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs text-muted-foreground">
                        {item.type === "image"
                          ? `<img src="${item.url}" alt="${editedItem.alt || item.name}" width="${item.dimensions?.split("x")[0]}" height="${item.dimensions?.split("x")[1]}" />`
                          : `<video src="${item.url}" controls width="${item.dimensions?.split("x")[0]}" height="${item.dimensions?.split("x")[1]}"></video>`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Markdown</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyEmbedCode("markdown")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs text-muted-foreground">
                        {item.type === "image"
                          ? `![${editedItem.alt || item.name}](${item.url})`
                          : `[${item.name}](${item.url})`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Direct URL</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyEmbedCode("url")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs text-muted-foreground break-all">
                        {item.url}
                      </code>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
