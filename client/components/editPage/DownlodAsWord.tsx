"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEditorStore } from "@/store/useEditorStore";

const DownloadAsWord = () => {
  const [loading, setLoading] = useState(false);
  const { fileName, draftHtml } = useEditorStore();

  async function handleDownload() {
    if (!draftHtml) return;

    setLoading(true);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(draftHtml, "text/html");

      doc.querySelector(".selected")?.classList.remove("selected");
      doc
        .querySelectorAll(".preview-mode")
        .forEach((el) => el.classList.remove("preview-mode"));
      doc
        .querySelectorAll(".ai-response-container")
        .forEach((el) => el.remove());
      doc.querySelectorAll(".ai-action-toolbar").forEach((el) => el.remove());

      doc.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.fontSize = "";
          el.style.margin = "";
          el.style.lineHeight = "";
        }
      });

      const cleanContent = doc.body.innerHTML;

      const pdfRes = await fetch("/api/downloadPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: cleanContent }),
      });

      if (!pdfRes.ok) {
        const errData = await pdfRes.json().catch(() => ({}));
        throw new Error(
          errData.details || "Failed to generate intermediate PDF",
        );
      }

      const pdfBlob = await pdfRes.blob();

      const formData = new FormData();
      formData.append("file", pdfBlob, "document.pdf");

      const docxRes = await fetch(`/api/tools/pdf-to-docx`, {
        method: "POST",
        body: formData,
      });

      if (!docxRes.ok) throw new Error("Failed to convert to DOCX");

      const docxBlob = await docxRes.blob();
      const url = URL.createObjectURL(docxBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName || "document"}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Word Document Downloaded");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to download Word file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleDownload}
      disabled={loading}
      className="hover:scale-105 transition-transform cursor-pointer bg-blue-600/90 hover:bg-blue-600 text-white"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      As Word
    </Button>
  );
};

export default DownloadAsWord;
