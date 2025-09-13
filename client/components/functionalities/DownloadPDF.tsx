'use client'
import html2pdf from 'html2pdf.js'
import React from 'react'

const DownloadPDF = ({ html, pdfName }: { html: string, pdfName: string }) => {
    const handleDownload = () => {
        if (!html) return
        const element = document.createElement("div")
        element.innerHTML = html
        element.style.color = "black"; // override problematic styles
        element.style.backgroundColor = 'white'
        html2pdf().from(element).toPdf().save(`${pdfName || "document"}.pdf`)
    }
    return (
        <button
            onClick={handleDownload}
            className="bg-secondary text-secondary-foreground rounded-md py-2 px-4 hover:bg-secondary/90 transition cursor-pointer"
        >
            Download
        </button>
    )
}

export default DownloadPDF