"use client";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePdfStore } from "@/app/store/usePdfStore";
import { toast } from 'sonner'
import { useEditPdfStore } from "@/app/store/useEditPdfStore";
import { Button } from "../ui/button";

const DownloadAsWord = () => {
  const [loading, setLoading] = useState(false);

  const { fileName, htmlContent } = usePdfStore();
  const { renderedHtml, setRenderedHtml } = useEditPdfStore();

  useEffect(() => {
    if (htmlContent) setRenderedHtml(htmlContent);
  }, [htmlContent, setRenderedHtml]);

  async function handleDownload() {
    if (!renderedHtml) return;

    setLoading(true);
    try {
      const wrapper = document.createElement("div");
      wrapper.style.padding = "16px";
      wrapper.innerHTML = renderedHtml;

      // 1️⃣ Send HTML → PDF
      const res = await fetch("/api/downloadPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: wrapper.outerHTML }),
      });

      if (!res.ok) throw new Error("Failed to convert to PDF");

      const pdfBlob = await res.blob();

      // 2️⃣ Send PDF → DOCX
      const formData = new FormData();
      formData.append("file", pdfBlob, "document.pdf");

      const finalRes = await fetch(`/api/tools/pdf-to-docx`, {
        method: "POST",
        body: formData,
      });

      if (!finalRes.ok) throw new Error("Failed to convert to DOCX");

      const docxBlob = await finalRes.blob();
      const url = URL.createObjectURL(docxBlob);

      // 3️⃣ Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName || "documentFromPDFLens"}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to download file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleDownload}
      disabled={loading}
      className="hover:scale-103 cursor-pointer text-foreground/80 bg-blue-500/70 hover:bg-blue-500 hover:text-foreground"
    >
      <Download
        className={`
      w-4 h-4 shrink-0
      ${loading ? 'animate-bounce' : ''}
    `}
      />
      As Word
    </Button>
  );
};

export default DownloadAsWord;
