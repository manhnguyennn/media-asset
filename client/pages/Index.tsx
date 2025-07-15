import React, { useState } from "react";
import { MediaGrid } from "@/components/MediaGrid";
import { FolderTree } from "@/components/FolderTree";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Plus,
  FolderPlus,
  LayoutSidebar,
  LayoutSidebarClose,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Index() {
  const [selectedFolder, setSelectedFolder] = useState<
    "all" | "user" | "global"
  >("all");
  const [selectedType, setSelectedType] = useState<"all" | "image" | "video">(
    "all",
  );
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [selectedFolderData, setSelectedFolderData] = useState<any>(null);
  const [showFolderTree, setShowFolderTree] = useState(true);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images, videos, and other media assets
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <Tabs
          value={selectedFolder}
          onValueChange={(value) => setSelectedFolder(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="user">User Media</TabsTrigger>
            <TabsTrigger value="global">Global Media</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="all">All Types</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Media Grid */}
      <MediaGrid selectedFolder={selectedFolder} selectedType={selectedType} />
    </div>
  );
}
