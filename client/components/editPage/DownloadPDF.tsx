"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEditorStore } from "@/store/useEditorStore";

const DownloadPDF = () => {
  const [loading, setLoading] = useState(false);
  const { fileName, draftHtml } = useEditorStore();

  async function handleDownload() {
    if (!draftHtml) {
      toast.error("Document is empty");
      return;
    }

    setLoading(true);
    try {
      // 1. Prepare DOM Parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(draftHtml, "text/html");

      // 2. Clean unnecessary UI elements
      const elementsToRemove = [
        ".ai-response-container",
        ".ai-action-toolbar",
        ".preview-mode",
        ".selected", // remove selection highlights
      ];

      elementsToRemove.forEach((selector) => {
        doc.querySelectorAll(selector).forEach((el) => el.remove());
      });

      // 3. Clean Inline Styles (Optional: Keep this if you want consistent PDF styling via CSS)
      doc.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.fontSize = "";
          el.style.margin = "";
          el.style.lineHeight = "";
          el.classList.remove("selected");
        }
      });

      const cleanContent = doc.body.innerHTML;

      // 4. API Request
      const res = await fetch("/api/downloadPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: cleanContent }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Server failed to generate PDF");
      }

      // 5. Convert Response to Blob & Download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Ensure valid filename ending in .pdf
      const safeName = fileName?.trim()
        ? fileName.replace(/\.pdf$/i, "")
        : "document";
      link.download = `${safeName}.pdf`;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF Downloaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleDownload}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      PDF
    </Button>
  );
};

export default DownloadPDF;
