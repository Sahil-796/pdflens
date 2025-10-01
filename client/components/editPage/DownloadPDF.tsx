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

        const res = await fetch("/api/downloadPdf", {
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
            className="group flex items-center bg-primary text-primary-foreground font-medium rounded-lg py-2 px-4 shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
            <Download className={`w-4 h-4 shrink-0 ${loading && 'animate-bouncee'}`} />

            <span
                className="ml-2 max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden"
            >
                Download PDF
            </span>
        </button>
    );
};

export default DownloadPDF;