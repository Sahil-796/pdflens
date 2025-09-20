"use client";
import React, { useState } from "react";
import { TextShimmerWave } from "../motion-primitives/text-shimmer-wave";

const DownloadPDF = ({ html, pdfName }: { html: string; pdfName?: string }) => {
    const [loading, setLoading] = useState(false)

    async function handleDownload() {
        if (!html) return;

        setLoading(true)
        // ✅ Wrap HTML in a div with padding
        const wrapper = document.createElement("div");
        wrapper.style.padding = "16px";
        wrapper.innerHTML = html;

        // Send wrapped HTML
        const res = await fetch("/api/downloadPdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: wrapper.outerHTML }),
        });

        if (res.ok) {
            setLoading(false)
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${pdfName || "document"}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    return (
        <button
            onClick={handleDownload}
            className="bg-secondary text-secondary-foreground rounded-md py-2 px-4 hover:bg-secondary/90 transition cursor-pointer"
            disabled={loading}
        >
            {loading ? <TextShimmerWave>Downloading...</TextShimmerWave> : "Download"}
        </button>
    );
};

export default DownloadPDF;