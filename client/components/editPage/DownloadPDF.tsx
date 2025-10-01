"use client";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { TextShimmerWave } from "../motion-primitives/text-shimmer-wave";
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
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
        >
            <Download className={`w-4 h-4 ${loading && 'animate-bounce'}`} />
            <span>Download PDF</span>
        </button>
    );
};

export default DownloadPDF;