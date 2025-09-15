"use client";
import React from "react";

const DownloadPDF = ({ html, pdfName }: { html: string; pdfName?: string }) => {
    async function handleDownload() {
        if (!html) return;

        // ✅ Wrap HTML in a div with padding
        const wrapper = document.createElement("div");
        wrapper.style.padding = "16px";
        wrapper.innerHTML = html;

        // Send wrapped HTML
        const res = await fetch("/api/downloadPDF", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: wrapper.outerHTML }),
        });

        if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            console.log(url)

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
        >
            Download
        </button>
    );
};

export default DownloadPDF;