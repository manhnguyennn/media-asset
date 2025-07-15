import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Folder,
  Image,
  Video,
  Upload,
  Search,
  Grid3X3,
  List,
  Settings,
  User,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Media Library", icon: Folder, href: "/", current: true },
    { name: "Upload", icon: Upload, href: "/upload", current: false },
    { name: "Settings", icon: Settings, href: "/settings", current: false },
  ];

  const mediaTypes = [
    { name: "All Media", icon: Grid3X3, count: 1248 },
    { name: "Images", icon: Image, count: 892 },
    { name: "Videos", icon: Video, count: 356 },
  ];

  const folders = [
    { name: "User Media", icon: User, type: "user" },
    { name: "Global Media", icon: Globe, type: "global" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
      >
        <div
          className="fixed inset-0 bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border">
          <SidebarContent
            navigation={navigation}
            mediaTypes={mediaTypes}
            folders={folders}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block">
        <div className="bg-sidebar border-r border-sidebar-border h-full">
          <SidebarContent
            navigation={navigation}
            mediaTypes={mediaTypes}
            folders={folders}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-card border-b border-border px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <h1 className="text-xl font-semibold text-foreground">
                Media Asset Manager
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search media..."
                  className="pl-9 w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  navigation: Array<{
    name: string;
    icon: any;
    href: string;
    current: boolean;
  }>;
  mediaTypes: Array<{ name: string; icon: any; count: number }>;
  folders: Array<{ name: string; icon: any; type: string }>;
  onClose?: () => void;
}

function SidebarContent({
  navigation,
  mediaTypes,
  folders,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo and close button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Folder className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            MediaCMS
          </span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.current
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Media Types */}
        <div>
          <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
            Media Types
          </h3>
          <div className="space-y-1">
            {mediaTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{type.name}</span>
                  </div>
                  <span className="text-xs text-sidebar-foreground/60">
                    {type.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Folders */}
        <div>
          <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
            Folders
          </h3>
          <div className="space-y-1">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <div
                  key={folder.name}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{folder.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
