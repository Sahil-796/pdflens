"use client";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, Upload, X } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useEditorStore } from "@/store/useEditorStore";

export default function UploadFiles() {
  const {
    activePdfId,
    fileName,
    contextFiles,
    setContextFiles,
    initializeEditor,
  } = useEditorStore();

  const [loading, setLoading] = useState(false);
  const [, setDragActive] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [limitFilesModalOpen, setLimitFilesModalOpen] = useState(false);

  const uploadFile = async (newFile: File) => {
    if (!newFile || loading) return;

    if (contextFiles.length >= 5) {
      setLimitFilesModalOpen(true);
      return;
    }

    if (newFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (newFile.size > maxSize) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    setLoading(true);

    try {
      let currentPdfId = activePdfId;

      if (!currentPdfId) {
        const currentName = fileName || "Untitled Document";

        const createRes = await fetch("/api/createPdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html: "", pdfName: currentName }),
        });

        if (!createRes.ok) throw new Error("Failed to create PDF session");

        const createData = await createRes.json();
        currentPdfId = createData.id;

        initializeEditor({
          id: createData.id,
          fileName: currentName,
          html: "",
          isContext: true,
        });
      }

      if (!currentPdfId) throw new Error("PDF ID is missing");

      const apiEndpoint =
        contextFiles.length === 0 ? "/api/addContext" : "/api/updateContext";

      const formData = new FormData();
      formData.append("file", newFile, newFile.name);
      formData.append("pdfId", currentPdfId);

      const res = await fetch(apiEndpoint, { method: "POST", body: formData });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setContextFiles([...contextFiles, newFile.name]);

      toast.success(`${newFile.name} uploaded`);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = async (fileToDelete: string) => {
    if (!activePdfId) return;

    try {
      setIsRemoving(true);

      const res = await fetch("/api/removeContext", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfId: activePdfId,
          filename: fileToDelete,
        }),
      });

      if (!res.ok) throw new Error("Remove failed");

      const newFiles = contextFiles.filter((name) => name !== fileToDelete);
      setContextFiles(newFiles);

      toast.success(`${fileToDelete} removed`);
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove file");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-medium">Reference Files</label>
        <span className="text-xs text-muted-foreground">
          {contextFiles.length} uploaded
        </span>
      </div>

      <div className={`flex flex-col sm:flex-row gap-4 transition-all`}>
        {/* Upload Area */}
        <div
          className={`flex-1 ${contextFiles.length > 0 ? "sm:w-1/2" : "w-full"}`}
        >
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all duration-200
                        min-h-[140px] sm:min-h-[180px] flex flex-col items-center justify-center
                        hover:border-primary hover:bg-primary/5 hover:scale-[1.02] border-border
                        ${loading ? "opacity-50 cursor-wait" : ""}
            `}
            onDragOver={(e) => {
              if (!loading) {
                e.preventDefault();
                setDragActive(true);
              }
            }}
            onDragLeave={() => {
              if (!loading) setDragActive(false);
            }}
            onDrop={handleDrop}
            onClick={() => {
              if (!loading) document.getElementById("fileInput")?.click();
            }}
          >
            <Upload
              className={`mx-auto mb-2 text-primary transition-transform ${
                loading ? "animate-bounce" : "group-hover:scale-110"
              }`}
              size={28}
            />
            <p className="text-sm text-primary max-w-[80%] sm:max-w-none mx-auto">
              {loading ? "Uploading..." : "Drop files here or tap to browse"}
            </p>
            <input
              disabled={loading}
              id="fileInput"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
            />
          </div>
        </div>

        {/* Files List */}
        {contextFiles.length > 0 && (
          <div className="sm:w-1/2 flex flex-col">
            <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
            <div className="flex-1 max-h-[150px] overflow-y-auto pr-1 space-y-1">
              {contextFiles.map((fileName, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-sm gap-2"
                >
                  <span className="flex items-center gap-2 truncate">
                    📄 <span className="truncate">{fileName}</span>
                  </span>
                  <button
                    onClick={() => removeFile(fileName)}
                    className="text-destructive hover:bg-destructive/10 p-1 rounded transition"
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <X className="h-4 w-4 cursor-pointer" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Limit Modal */}
      <AlertDialog
        open={limitFilesModalOpen}
        onOpenChange={setLimitFilesModalOpen}
      >
        <AlertDialogContent className="w-[92%] sm:w-[480px] rounded-2xl">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-center">
              File Upload Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You can upload 5 files per document. Upgrade to Premium for more.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Link href="/pricing" className="w-full sm:w-auto">
              <AlertDialogAction className="w-full">
                View Pricing
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
