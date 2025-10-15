"use client";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePdfStore } from "@/app/store/usePdfStore";
import { toast } from 'sonner'
import { useEditPdfStore } from "@/app/store/useEditPdfStore";

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
    <button
      onClick={handleDownload}
      disabled={loading}
      className="
    group flex items-center justify-center gap-2
    bg-secondary text-secondary-foreground font-medium
    rounded-md px-2.5 py-2 text-sm shadow-sm
    hover:bg-secondary/80 hover:shadow-md
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed

    sm:px-3 sm:py-2
    md:text-base md:px-4 md:py-2.5
  "
    >
      <Download
        className={`
      w-4 h-4 shrink-0
      ${loading ? 'animate-bounce' : ''}
      sm:w-5 sm:h-5
    `}
      />
      <span
        className="
      hidden 
      text-xs sm:text-sm lg:inline md:text-base
    "
      >
        Download
      </span>
    </button>
  );
};

export default DownloadPDF;
