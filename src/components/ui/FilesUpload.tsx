"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Button } from "./ButtonBussiness";
import { Upload, File, X, Eye, Trash2, Download, Check } from "lucide-react";
import { useState, useRef } from "react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  base64: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: string[]) => void;
}

export function FileUpload({
  accept = "*/*",
  multiple = false,
  onChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFilesList: FileList | null) => {
    if (!selectedFilesList) return;

    const newFiles: UploadedFile[] = [];
    const fileToBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    for (const file of Array.from(selectedFilesList)) {
      const base64 = await fileToBase64(file);
      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        base64: base64 as string,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);

    if (onChange) {
      const allBase64s = [...files, ...newFiles].map((file) => file.base64);
      onChange(allBase64s);
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllFiles = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((file) => file.id)));
    }
  };

  const deleteSelectedFiles = () => {
    setFiles(files.filter((file) => !selectedFiles.has(file.id)));
    setSelectedFiles(new Set());
  };

  const downloadSelectedFiles = () => {
    selectedFiles.forEach((fileId) => {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getTotalSize = () => {
    return files
      .filter((file) => selectedFiles.has(file.id))
      .reduce((total, file) => total + file.size, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Upload Area - Left Side */}
      <motion.div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 min-h-[200px] flex flex-col justify-center ${
          dragOver
            ? "border-white/60 bg-white/10"
            : "border-white/30 hover:border-white/50 hover:bg-white/5"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className="h-8 w-8 text-white/70 mx-auto mb-2" />
        <p className="text-white/70 mb-2">Drag and drop files here, or</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          // onChange={(e) => handleFileSelect(e.target.files)}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </motion.div>

      {/* File Preview - Right Side */}
      <div className="min-h-[200px]">
        {files.length > 0 ? (
          <motion.div
            className="border-2 border-white/30 rounded-lg bg-white/5 min-h-[200px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Header with batch operations */}
            <div className="p-3 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={selectAllFiles}
                  className="text-white/70 hover:text-white hover:bg-white/20 text-xs px-2 py-1"
                >
                  {selectedFiles.size === files.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                {selectedFiles.size > 0 && (
                  <span className="text-white/60 text-xs">
                    {selectedFiles.size} selected (
                    {formatFileSize(getTotalSize())})
                  </span>
                )}
              </div>

              {selectedFiles.size > 0 && (
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={downloadSelectedFiles}
                    className="text-white/70 hover:text-white hover:bg-white/20 p-1"
                    title="Download selected"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={deleteSelectedFiles}
                    className="text-red-300/70 hover:text-red-200 hover:bg-red-500/20 p-1"
                    title="Delete selected"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* File list */}
            <div className="p-3 space-y-2 max-h-[140px] overflow-y-auto">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  className={`flex items-center justify-between p-2 rounded-lg backdrop-blur-sm min-h-[44px] transition-all duration-200 cursor-pointer ${
                    selectedFiles.has(file.id)
                      ? "bg-white/20 border border-white/40"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Selection indicator */}
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedFiles.has(file.id)
                          ? "bg-white/90 border-white/90"
                          : "border-white/40 hover:border-white/60"
                      }`}
                    >
                      {selectedFiles.has(file.id) && (
                        <Check className="h-2.5 w-2.5 text-gray-800" />
                      )}
                    </div>

                    <File className="h-4 w-4 text-white/70 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white/90 text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-white/60 text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {file.type.startsWith("image/") && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="border-2 border-dashed border-white/20 rounded-lg min-h-[200px] flex items-center justify-center">
            <p className="text-white/50 text-sm">No files uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
