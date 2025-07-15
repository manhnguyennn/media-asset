import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Folder,
  FolderOpen,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Scissors,
  FileText,
  Globe,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FolderNode {
  id: string;
  name: string;
  type: "user" | "global";
  children?: FolderNode[];
  itemCount?: number;
  isExpanded?: boolean;
  path: string;
}

interface FolderTreeProps {
  selectedPath?: string;
  onFolderSelect?: (path: string, folder: FolderNode) => void;
  onFolderCreate?: (parentPath: string, name: string) => void;
  onFolderRename?: (path: string, newName: string) => void;
  onFolderDelete?: (path: string) => void;
}

// Mock folder structure
const mockFolderStructure: FolderNode[] = [
  {
    id: "user-root",
    name: "User Media",
    type: "user",
    path: "/user",
    itemCount: 24,
    isExpanded: true,
    children: [
      {
        id: "user-projects",
        name: "Projects",
        type: "user",
        path: "/user/projects",
        itemCount: 15,
        isExpanded: false,
        children: [
          {
            id: "user-project-a",
            name: "Project Alpha",
            type: "user",
            path: "/user/projects/project-alpha",
            itemCount: 8,
          },
          {
            id: "user-project-b",
            name: "Project Beta",
            type: "user",
            path: "/user/projects/project-beta",
            itemCount: 7,
          },
        ],
      },
      {
        id: "user-personal",
        name: "Personal",
        type: "user",
        path: "/user/personal",
        itemCount: 9,
        isExpanded: false,
        children: [
          {
            id: "user-photos",
            name: "Photos",
            type: "user",
            path: "/user/personal/photos",
            itemCount: 5,
          },
          {
            id: "user-videos",
            name: "Videos",
            type: "user",
            path: "/user/personal/videos",
            itemCount: 4,
          },
        ],
      },
    ],
  },
  {
    id: "global-root",
    name: "Global Media",
    type: "global",
    path: "/global",
    itemCount: 156,
    isExpanded: true,
    children: [
      {
        id: "global-branding",
        name: "Branding",
        type: "global",
        path: "/global/branding",
        itemCount: 32,
        isExpanded: false,
        children: [
          {
            id: "global-logos",
            name: "Logos",
            type: "global",
            path: "/global/branding/logos",
            itemCount: 12,
          },
          {
            id: "global-colors",
            name: "Color Palette",
            type: "global",
            path: "/global/branding/colors",
            itemCount: 8,
          },
          {
            id: "global-typography",
            name: "Typography",
            type: "global",
            path: "/global/branding/typography",
            itemCount: 12,
          },
        ],
      },
      {
        id: "global-marketing",
        name: "Marketing",
        type: "global",
        path: "/global/marketing",
        itemCount: 68,
        isExpanded: false,
        children: [
          {
            id: "global-campaigns",
            name: "Campaigns",
            type: "global",
            path: "/global/marketing/campaigns",
            itemCount: 45,
          },
          {
            id: "global-social",
            name: "Social Media",
            type: "global",
            path: "/global/marketing/social",
            itemCount: 23,
          },
        ],
      },
      {
        id: "global-products",
        name: "Product Images",
        type: "global",
        path: "/global/products",
        itemCount: 56,
        isExpanded: false,
        children: [
          {
            id: "global-hero",
            name: "Hero Banners",
            type: "global",
            path: "/global/products/hero",
            itemCount: 15,
          },
          {
            id: "global-thumbnails",
            name: "Thumbnails",
            type: "global",
            path: "/global/products/thumbnails",
            itemCount: 41,
          },
        ],
      },
    ],
  },
];

export function FolderTree({
  selectedPath,
  onFolderSelect,
  onFolderCreate,
  onFolderRename,
  onFolderDelete,
}: FolderTreeProps) {
  const [folders, setFolders] = useState<FolderNode[]>(mockFolderStructure);

  const toggleFolder = (path: string) => {
    const updateFolders = (nodes: FolderNode[]): FolderNode[] => {
      return nodes.map((node) => {
        if (node.path === path) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateFolders(node.children) };
        }
        return node;
      });
    };
    setFolders(updateFolders(folders));
  };

  const handleFolderSelect = (folder: FolderNode) => {
    onFolderSelect?.(folder.path, folder);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Folders</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <FolderPlus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onFolderCreate?.("/user", "New Folder")}
            >
              <Folder className="h-4 w-4 mr-2" />
              New User Folder
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFolderCreate?.("/global", "New Folder")}
            >
              <Globe className="h-4 w-4 mr-2" />
              New Global Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Folder Tree */}
      <div className="p-2 overflow-y-auto h-full">
        <div className="space-y-1">
          {folders.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              level={0}
              selectedPath={selectedPath}
              onToggle={toggleFolder}
              onSelect={handleFolderSelect}
              onRename={onFolderRename}
              onDelete={onFolderDelete}
              onCreateChild={onFolderCreate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FolderNodeProps {
  folder: FolderNode;
  level: number;
  selectedPath?: string;
  onToggle: (path: string) => void;
  onSelect: (folder: FolderNode) => void;
  onRename?: (path: string, newName: string) => void;
  onDelete?: (path: string) => void;
  onCreateChild?: (parentPath: string, name: string) => void;
}

function FolderNode({
  folder,
  level,
  selectedPath,
  onToggle,
  onSelect,
  onRename,
  onDelete,
  onCreateChild,
}: FolderNodeProps) {
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedPath === folder.path;
  const paddingLeft = `${level * 16 + 8}px`;

  const handleContextMenuAction = (action: string) => {
    switch (action) {
      case "rename":
        const newName = prompt("Enter new folder name:", folder.name);
        if (newName && newName !== folder.name) {
          onRename?.(folder.path, newName);
        }
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete "${folder.name}"?`)) {
          onDelete?.(folder.path);
        }
        break;
      case "create":
        const childName = prompt("Enter folder name:");
        if (childName) {
          onCreateChild?.(folder.path, childName);
        }
        break;
    }
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center py-1 px-2 rounded-md cursor-pointer transition-colors group hover:bg-accent",
              isSelected && "bg-accent text-accent-foreground",
            )}
            style={{ paddingLeft }}
            onClick={() => onSelect(folder)}
          >
            {/* Expand/Collapse Icon */}
            <div className="w-4 h-4 mr-1 flex items-center justify-center">
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(folder.path);
                  }}
                >
                  {folder.isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              ) : null}
            </div>

            {/* Folder Icon */}
            <div className="w-4 h-4 mr-2 flex items-center justify-center">
              {folder.type === "user" ? (
                <User className="h-3 w-3 text-muted-foreground" />
              ) : folder.type === "global" ? (
                <Globe className="h-3 w-3 text-muted-foreground" />
              ) : hasChildren && folder.isExpanded ? (
                <FolderOpen className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Folder className="h-3 w-3 text-muted-foreground" />
              )}
            </div>

            {/* Folder Name and Count */}
            <div className="flex-1 flex items-center justify-between min-w-0">
              <span className="text-sm font-medium truncate">
                {folder.name}
              </span>
              {folder.itemCount !== undefined && (
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {folder.itemCount}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleContextMenuAction("create")}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Subfolder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleContextMenuAction("rename")}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Scissors className="h-4 w-4 mr-2" />
                    Cut
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleContextMenuAction("delete")}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => onSelect(folder)}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextMenuAction("create")}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Subfolder
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => handleContextMenuAction("rename")}>
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <Scissors className="h-4 w-4 mr-2" />
            Cut
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleContextMenuAction("delete")}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Children */}
      {hasChildren && folder.isExpanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              level={level + 1}
              selectedPath={selectedPath}
              onToggle={onToggle}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onCreateChild={onCreateChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
