import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Upload,
  File,
  Image,
  Video,
  X,
  CheckCircle,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  preview?: string;
}

export default function Upload() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<"user" | "global">(
    "user",
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        handleFiles(files);
      }
    },
    [],
  );

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    const newUploadFiles: UploadFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending",
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setUploadFiles((prev) => [...prev, ...newUploadFiles]);

    // Simulate upload for each file
    newUploadFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (id: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, status: "uploading" } : file,
      ),
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? { ...file, progress: 100, status: "completed" }
              : file,
          ),
        );
      } else {
        setUploadFiles((prev) =>
          prev.map((file) => (file.id === id ? { ...file, progress } : file)),
        );
      }
    }, 200);
  };

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    return File;
  };

  const completedFiles = uploadFiles.filter(
    (f) => f.status === "completed",
  ).length;
  const totalFiles = uploadFiles.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Media</h1>
        <p className="text-muted-foreground">
          Upload images and videos to your media library
        </p>
      </div>

      {/* Upload Settings */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-y-0 sm:space-x-4">
            <div className="space-y-2">
              <Label htmlFor="folder-select">Upload to folder</Label>
              <Select
                value={selectedFolder}
                onValueChange={(value: "user" | "global") =>
                  setSelectedFolder(value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4" />
                      <span>User Media</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="global">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4" />
                      <span>Global Media</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Supported formats: JPG, PNG, GIF, MP4, MOV, AVI</p>
              <p>Maximum file size: 100MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <Card>
        <CardContent className="p-0">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drop files here to upload
            </h3>
            <p className="text-muted-foreground mb-4">
              Or click to browse and select files
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button asChild>
                <span>Choose Files</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Upload Progress ({completedFiles}/{totalFiles})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadFiles([])}
                disabled={uploadFiles.some((f) => f.status === "uploading")}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => {
                const FileIcon = getFileIcon(uploadFile.file);
                return (
                  <div
                    key={uploadFile.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {uploadFile.preview ? (
                        <img
                          src={uploadFile.preview}
                          alt={uploadFile.file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              selectedFolder === "global"
                                ? "default"
                                : "outline"
                            }
                          >
                            {selectedFolder === "global" ? "Global" : "User"}
                          </Badge>
                          {uploadFile.status === "completed" && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {uploadFile.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                            disabled={uploadFile.status === "uploading"}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {uploadFile.status === "uploading"
                            ? `${Math.round(uploadFile.progress)}%`
                            : uploadFile.status === "completed"
                              ? "Complete"
                              : uploadFile.status === "error"
                                ? "Error"
                                : "Pending"}
                        </p>
                      </div>
                      {uploadFile.status === "uploading" && (
                        <Progress
                          value={uploadFile.progress}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
