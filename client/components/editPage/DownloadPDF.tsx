"use client";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePdfStore } from "@/app/store/usePdfStore";
import { toast } from 'sonner'
import { useEditPdfStore } from "@/app/store/useEditPdfStore";
import { Button } from "../ui/button";

const DownloadPDF = () => {
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

      const res = await fetch("/api/downloadPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: wrapper.outerHTML }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName || "documentFromPDFLens"}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err.message)
      toast.error("Failed to download PDF.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleDownload}
      disabled={loading}
      className="hover:scale-103 cursor-pointer"
    >
      <Download
        className={`
      w-4 h-4 shrink-0
      ${loading ? 'animate-bounce' : ''}
    `}
      />
      Download
    </Button>
  );
};

export default DownloadPDF;
