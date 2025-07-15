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

  const handleFolderSelect = (path: string, folder: any) => {
    setCurrentPath(path);
    setSelectedFolderData(folder);
    // Update the selected folder type based on path
    if (path.startsWith("/user")) {
      setSelectedFolder("user");
    } else if (path.startsWith("/global")) {
      setSelectedFolder("global");
    } else {
      setSelectedFolder("all");
    }
  };

  const handleFolderCreate = (parentPath: string, name: string) => {
    toast.success(`Created folder "${name}" in ${parentPath}`);
    // In a real app, this would make an API call to create the folder
  };

  const handleFolderRename = (path: string, newName: string) => {
    toast.success(`Renamed folder to "${newName}"`);
    // In a real app, this would make an API call to rename the folder
  };

  const handleFolderDelete = (path: string) => {
    toast.success(`Deleted folder at ${path}`);
    // In a real app, this would make an API call to delete the folder
  };

  const handleBreadcrumbNavigate = (path: string) => {
    setCurrentPath(path);
    if (path === "/") {
      setSelectedFolder("all");
      setSelectedFolderData(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images, videos, and other media assets
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFolderTree(!showFolderTree)}
          >
            {showFolderTree ? (
              <LayoutSidebarClose className="h-4 w-4 mr-2" />
            ) : (
              <LayoutSidebar className="h-4 w-4 mr-2" />
            )}
            {showFolderTree ? "Hide" : "Show"} Folders
          </Button>
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

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Folder Tree Sidebar */}
        {showFolderTree && (
          <div className="w-80 flex-shrink-0">
            <Card className="h-full">
              <FolderTree
                selectedPath={currentPath}
                onFolderSelect={handleFolderSelect}
                onFolderCreate={handleFolderCreate}
                onFolderRename={handleFolderRename}
                onFolderDelete={handleFolderDelete}
              />
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <BreadcrumbNav
              path={currentPath}
              onNavigate={handleBreadcrumbNavigate}
            />

            {selectedFolderData && (
              <div className="text-sm text-muted-foreground">
                {selectedFolderData.itemCount} items
              </div>
            )}
          </div>

          {/* Content Area with Filters and Grid */}
          <div className="flex-1 flex flex-col space-y-4">
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
            <div className="flex-1 overflow-y-auto">
              <MediaGrid
                selectedFolder={selectedFolder}
                selectedType={selectedType}
                currentPath={currentPath}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
