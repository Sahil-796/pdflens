"use client";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePdfStore } from "@/app/store/usePdfStore";

const DownloadPDF = ({ html, pdfName }: { html: string; pdfName?: string }) => {
    const [loading, setLoading] = useState(false);

    const { renderedHtml, setRenderedHtml } = usePdfStore();

    useEffect(() => {
        if (html) setRenderedHtml(html);
    }, [html, setRenderedHtml]);

    async function handleDownload() {
        if (!renderedHtml) return;

        setLoading(true);
        const wrapper = document.createElement("div");
        wrapper.style.padding = "16px";
        wrapper.innerHTML = renderedHtml;

        const res = await fetch("/api/downloadPDF", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: wrapper.outerHTML }),
        });

        if (res.ok) {
            setLoading(false);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${pdfName || "documentFromPDFLens"}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="group flex items-center gap-2 bg-secondary text-secondary-foreground font-medium rounded-md px-3 py-2 text-sm shadow-sm hover:bg-secondary/80 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Download</span>
        </button>
    );
};

export default DownloadPDF;