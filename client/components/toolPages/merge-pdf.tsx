"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Files,
  Download,
  Trash2,
  Loader2,
  Merge,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { Reorder } from "framer-motion";

interface FileItem {
  id: string;
  file: File;
}

const MergePdf = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  // Logic: 20 files for Pro, 5 for Free
  const MAX_FILES = user?.isCreator ? 20 : 5;
  const MAX_SIZE_MB = 10;

  const handleFileValidation = (newFiles: File[]) => {
    const validFiles: FileItem[] = [];
    const remainingSlots = MAX_FILES - files.length;

    if (newFiles.length > remainingSlots) {
      toast.error(
        `Limit exceeded. You can only add ${remainingSlots} more file(s).`,
      );
      return;
    }

    newFiles.forEach((file) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.info(`Skipped "${file.name}": Not a PDF`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.info(`Skipped "${file.name}": Too large (>10MB)`);
        return;
      }
      validFiles.push({
        id: crypto.randomUUID(),
        file,
      });
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setMergedBlob(null);
      toast.success(`Added ${validFiles.length} file(s)`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length)
      handleFileValidation(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length)
      handleFileValidation(Array.from(e.dataTransfer.files));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlob(null);
  };

  // Manual move function for Arrow Buttons
  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= files.length) return;

    // Swap
    [newFiles[index], newFiles[targetIndex]] = [
      newFiles[targetIndex],
      newFiles[index],
    ];

    setFiles(newFiles);
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.info("Please upload at least 2 PDF files to merge");
      return;
    }

    setIsMerging(true);
    setMergedBlob(null);

    try {
      const formData = new FormData();
      files.forEach((item) => {
        formData.append("files", item.file);
      });

      const res = await fetch(`/api/tools/merge-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to merge PDFs");
      }

      const blob = await res.blob();
      setMergedBlob(blob);
      toast.success("PDFs merged successfully!");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Merge Failed");
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    const url = window.URL.createObjectURL(mergedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `merged_${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFiles([]);
    setMergedBlob(null);
    setIsMerging(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      {files.length < MAX_FILES && (
        <div
          className={cn(
            "w-full border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer bg-muted/50",
            dragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-purple-500 hover:bg-muted",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="text-purple-500 mb-4" size={40} />
          <p className="text-lg font-medium text-purple-500">
            Drop PDFs here or click to upload
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            {files.length}/{MAX_FILES} files selected • Max 10MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card className="w-full border border-border bg-card p-4 sm:p-6 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Files className="w-5 h-5 text-purple-600" />
              Files Queue ({files.length}/{MAX_FILES})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isMerging}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <Reorder.Group
              axis="y"
              values={files}
              onReorder={setFiles}
              className="space-y-3"
            >
              {files.map((item, index) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 group select-none cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Drag Handle */}
                    <div className="text-muted-foreground cursor-grab active:cursor-grabbing p-1 hover:text-foreground">
                      <GripVertical size={20} />
                    </div>

                    {/* Number Badge */}
                    <div className="flex items-center justify-center bg-purple-100 text-purple-700 min-w-7 h-7 rounded-md text-sm font-bold border border-purple-200">
                      {index + 1}
                    </div>

                    {/* File Icon */}
                    <div className="p-2 rounded-md bg-purple-500/10 text-purple-600">
                      <FileText size={20} />
                    </div>

                    {/* File Info */}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-medium text-sm">
                        {item.file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  {/* Actions: Arrows + Remove */}
                  <div className="flex items-center gap-1">
                    {/* Up Arrow */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveFile(index, "up")}
                      onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                      disabled={index === 0 || isMerging}
                      title="Move Up"
                      className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer"
                    >
                      <ArrowUp size={16} />
                    </Button>

                    {/* Down Arrow */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveFile(index, "down")}
                      onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                      disabled={index === files.length - 1 || isMerging}
                      title="Move Down"
                      className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer"
                    >
                      <ArrowDown size={16} />
                    </Button>

                    <div className="w-px h-4 bg-border mx-1" />

                    {/* Remove */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFile(item.id)}
                      onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                      disabled={isMerging}
                      title="Remove File"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {/* Global Controls */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end border-t border-border pt-4">
            {mergedBlob && (
              <Button
                variant="outline"
                onClick={handleDownload}
                className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
              >
                <Download size={16} /> Download Merged PDF
              </Button>
            )}

            <Button
              onClick={handleMerge}
              disabled={isMerging || files.length < 2}
              className="gap-2 bg-purple-500 hover:bg-purple-600 text-white shadow-md w-full sm:w-auto cursor-pointer"
            >
              {isMerging ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Merging...
                </>
              ) : (
                <>
                  <Merge size={16} /> Merge {files.length} PDFs
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MergePdf;
