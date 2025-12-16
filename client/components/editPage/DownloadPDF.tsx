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
      const parser = new DOMParser();
      const doc = parser.parseFromString(draftHtml, "text/html");

      const elementsToRemove = [
        ".ai-response-container",
        ".ai-action-toolbar",
        ".preview-mode",
        ".selected",
      ];

      elementsToRemove.forEach((selector) => {
        doc.querySelectorAll(selector).forEach((el) => el.remove());
      });

      doc.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.fontSize = "";
          el.style.margin = "";
          el.style.lineHeight = "";
          el.classList.remove("selected");
        }
      });

      const cleanContent = doc.body.innerHTML;

      const res = await fetch("/api/downloadPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: cleanContent }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Server failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeName = fileName?.trim()
        ? fileName.replace(/\.pdf$/i, "")
        : "document";
      link.download = `${safeName}.pdf`;

      document.body.appendChild(link);
      link.click();

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
