"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Scissors,
  Download,
  Trash2,
  Loader2,
  Play,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/useUser";

interface FileItem {
  id: string;
  file: File;
  status: "idle" | "converting" | "success" | "error";
  convertedBlob?: Blob;
  downloadName?: string;
  mode: "range" | "pages";
  configValue: string;
}

const SplitPDF = () => {
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

      validFiles.push({
        id: crypto.randomUUID(),
        file,
        status: "idle",
        mode: "range", // Default mode
        configValue: "", // Empty input by default
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

  // Helper to update specific file settings
  const updateFileSetting = (
    id: string,
    key: "mode" | "configValue",
    value: string,
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, [key]: value, status: "idle" } : f,
      ),
    );
  };

  const convertSingleFile = async (item: FileItem) => {
    // Validation
    if (!item.configValue.trim()) {
      toast.error(`Please enter pages for "${item.file.name}"`);
      return;
    }

    // Validate Input Format
    const valid = /^[0-9,\-]*$/.test(item.configValue);
    if (!valid) {
      toast.error(
        `Invalid format in "${item.file.name}". Use numbers, commas, and hyphens.`,
      );
      return;
    }

    setFiles((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: "converting" } : f)),
    );

    try {
      const formData = new FormData();
      formData.append("file", item.file);

      let url = "";

      if (item.mode === "pages") {
        // Exclude Pages Logic
        formData.append("exclude", item.configValue);
        url = "/api/tools/split-pages";
      } else {
        // Extract Range Logic
        formData.append("ranges", item.configValue);
        url = "/api/tools/split-range";
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Split failed");

      const blob = await res.blob();

      // Determine Filename (Zip or PDF)
      const isZip = item.mode === "range" && item.configValue.includes(",");
      const ext = isZip ? ".zip" : ".pdf";
      const downloadName = item.file.name.replace(
        ".pdf",
        `_${item.mode}${ext}`,
      );

      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: "success", convertedBlob: blob, downloadName }
            : f,
        ),
      );
    } catch (err) {
      console.error(err);
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "error" } : f)),
      );
      toast.error(`Failed to split ${item.file.name}`);
    }
  };

  const handleConvertAll = async () => {
    // Check if inputs are filled
    const idleFiles = files.filter(
      (f) => f.status === "idle" || f.status === "error",
    );
    if (idleFiles.some((f) => !f.configValue.trim())) {
      toast.error("Please fill in page numbers for all files.");
      return;
    }

    setIsGlobalConverting(true);

    // Set status
    setFiles((prev) =>
      prev.map((f) =>
        f.status === "idle" || f.status === "error"
          ? { ...f, status: "converting" }
          : f,
      ),
    );

    await Promise.all(idleFiles.map((f) => convertSingleFile(f)));

    setIsGlobalConverting(false);
    toast.success("Batch processing complete");
  };

  const downloadFile = (item: FileItem) => {
    if (!item.convertedBlob) return;
    const url = window.URL.createObjectURL(item.convertedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.downloadName || "split_document.pdf";
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
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-6">
      {/* Upload Area */}
      {files.length < MAX_FILES && (
        <div
          className={cn(
            "w-full border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer bg-background",
            dragActive
              ? "border-orange-400 bg-orange-500/10 scale-102"
              : "border-orange-300 hover:bg-background/30",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="text-orange-300 mb-4" size={40} />
          <p className="text-lg font-medium text-orange-300">
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
              <Scissors className="w-5 h-5 text-orange-300" />
              Files Queue ({files.length}/{MAX_FILES})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isGlobalConverting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 gap-4"
              >
                {/* Left: File Info */}
                <div className="flex items-center gap-3 w-full md:w-1/4 overflow-hidden">
                  <div
                    className={cn(
                      "p-2 rounded-md transition-colors shrink-0",
                      item.status === "success"
                        ? "bg-green-500/10 text-green-600"
                        : item.status === "error"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-orange-500/10 text-orange-300",
                    )}
                  >
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className="truncate font-medium text-sm"
                      title={item.file.name}
                    >
                      {item.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                {/* Middle: Configuration (Input & Select) */}
                <div className="flex items-center gap-2 w-full md:flex-1">
                  <Select
                    value={item.mode}
                    onValueChange={(val: "range" | "pages") =>
                      updateFileSetting(item.id, "mode", val)
                    }
                    disabled={
                      item.status === "converting" || item.status === "success"
                    }
                  >
                    <SelectTrigger className="w-[110px] h-9 text-xs cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="range">Extract</SelectItem>
                      <SelectItem value="pages">Exclude</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex-1 relative">
                    <Input
                      value={item.configValue}
                      onChange={(e) =>
                        updateFileSetting(
                          item.id,
                          "configValue",
                          e.target.value,
                        )
                      }
                      placeholder={
                        item.mode === "range" ? "e.g., 1-3, 5" : "e.g., 2, 4"
                      }
                      disabled={
                        item.status === "converting" ||
                        item.status === "success"
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Action 1: Convert / Retry */}
                  {(item.status === "idle" || item.status === "error") && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => convertSingleFile(item)}
                      title="Split File"
                      className="text-orange-300 hover:text-orange-400 hover:bg-orange-500/10 cursor-pointer"
                    >
                      {item.status === "error" ? (
                        <RefreshCw size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                    </Button>
                  )}

                  {/* Action 2: Spinner */}
                  {item.status === "converting" && (
                    <div className="p-2">
                      <Loader2 className="animate-spin text-orange-300 w-5 h-5" />
                    </div>
                  )}

                  {/* Action 3: Download */}
                  {item.status === "success" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => downloadFile(item)}
                      title="Download"
                      className="text-green-600 hover:text-green-700 hover:bg-green-100 cursor-pointer"
                    >
                      <Download size={18} />
                    </Button>
                  )}

                  {/* Action 4: Remove */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(item.id)}
                    disabled={item.status === "converting"}
                    title="Remove File"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
              <Button
                variant="outline"
                onClick={downloadAll}
                className="gap-2 cursor-pointer"
              >
                <Download size={16} /> Download All
              </Button>
            )}

            {files.some((f) => f.status === "idle" || f.status === "error") && (
              <Button
                onClick={handleConvertAll}
                disabled={isGlobalConverting}
                className="gap-2 bg-linear-to-br from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-md w-full sm:w-auto cursor-pointer"
              >
                {isGlobalConverting
                  ? "Processing..."
                  : `Split All Remaining (${files.filter((f) => f.status === "idle" || f.status === "error").length})`}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SplitPDF;
