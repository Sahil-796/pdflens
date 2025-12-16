"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Code,
  Download,
  Trash2,
  Loader2,
  Play,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/useUser";

interface FileItem {
  id: string;
  file: File;
  status: "idle" | "converting" | "success" | "error";
  convertedBlob?: Blob;
}

const PDF2MD = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isGlobalConverting, setIsGlobalConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const MAX_FILES = user?.isPro ? 20 : 5;
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
      if (
        files.some(
          (f) => f.file.name === file.name && f.file.size === file.size,
        )
      ) {
        toast.info(`Skipped "${file.name}": Already added`);
        return;
      }

      validFiles.push({
        id: crypto.randomUUID(),
        file,
        status: "idle",
      });
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
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
  };

  const convertSingleFile = async (item: FileItem) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: "converting" } : f)),
    );

    try {
      const formData = new FormData();
      formData.append("file", item.file);

      const res = await fetch(`/api/tools/pdf-to-md`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: "success", convertedBlob: blob }
            : f,
        ),
      );
    } catch (err) {
      console.error(err);
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "error" } : f)),
      );
      toast.error(`Failed to convert ${item.file.name}`);
    }
  };

  const handleConvertAll = async () => {
    setIsGlobalConverting(true);
    const filesToConvert = files.filter(
      (f) => f.status === "idle" || f.status === "error",
    );

    setFiles((prev) =>
      prev.map((f) =>
        f.status === "idle" || f.status === "error"
          ? { ...f, status: "converting" }
          : f,
      ),
    );

    await Promise.all(filesToConvert.map((f) => convertSingleFile(f)));

    setIsGlobalConverting(false);
    toast.success("Batch processing complete");
  };

  const downloadFile = (item: FileItem) => {
    if (!item.convertedBlob) return;
    const url = window.URL.createObjectURL(item.convertedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.file.name.replace(/\.pdf$/i, ".md");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    files.forEach((f) => {
      if (f.status === "success") downloadFile(f);
    });
  };

  const clearAll = () => {
    setFiles([]);
    setIsGlobalConverting(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      {files.length < MAX_FILES && (
        <div
          className={cn(
            "w-full border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer bg-card/50",
            dragActive
              ? "border-green-500 bg-green-500/10"
              : "border-border hover:bg-muted/30",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="text-muted-foreground mb-4" size={40} />
          <p className="text-lg font-medium">
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
              <Code className="w-5 h-5 text-green-600" />
              Files Queue ({files.length}/{MAX_FILES})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isGlobalConverting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      item.status === "success"
                        ? "bg-green-500/10 text-green-600"
                        : item.status === "error"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-primary/10 text-primary",
                    )}
                  >
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-sm">
                      {item.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Action 1: Convert / Retry (If Idle or Error) */}
                  {(item.status === "idle" || item.status === "error") && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => convertSingleFile(item)}
                      title={
                        item.status === "error"
                          ? "Retry Conversion"
                          : "Convert File"
                      }
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      {item.status === "error" ? (
                        <RefreshCw size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                    </Button>
                  )}

                  {/* Action 2: Spinner (If Converting) */}
                  {item.status === "converting" && (
                    <div className="p-2">
                      <Loader2 className="animate-spin text-primary w-5 h-5" />
                    </div>
                  )}

                  {/* Action 3: Download (If Success) */}
                  {item.status === "success" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => downloadFile(item)}
                      title="Download"
                      className="text-green-600 hover:text-green-700 hover:bg-green-100"
                    >
                      <Download size={18} />
                    </Button>
                  )}

                  {/* Action 4: Remove (Always unless converting) */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(item.id)}
                    disabled={item.status === "converting"}
                    title="Remove File"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Global Controls */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end border-t border-border pt-4">
            {files.some((f) => f.status === "success") && (
              <Button variant="outline" onClick={downloadAll} className="gap-2">
                <Download size={16} /> Download All
              </Button>
            )}

            {files.some((f) => f.status === "idle" || f.status === "error") && (
              <Button
                onClick={handleConvertAll}
                disabled={isGlobalConverting}
                className="gap-2 bg-green-500 hover:bg-green-600 text-white shadow-md w-full sm:w-auto"
              >
                {isGlobalConverting
                  ? "Converting..."
                  : `Convert All Remaining (${files.filter((f) => f.status === "idle" || f.status === "error").length})`}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PDF2MD;
