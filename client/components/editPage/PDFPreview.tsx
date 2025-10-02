'use client'

import React, { useEffect } from 'react'
import { usePdfStore } from '@/app/store/usePdfStore'

interface PDFPreviewProps {
    loading: boolean
    html: string
    pdfId: string
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ loading, html }) => {
    const { renderedHtml, setRenderedHtml, setSelectedId, setSelectedText, setOriginalHtml, selectedId } = usePdfStore() // store selection globally


    useEffect(() => {
        if (html) setRenderedHtml(html)
    }, [html, setRenderedHtml])

    useEffect(() => {
        if (renderedHtml && selectedId) {
            const prev = document.querySelector(".selected")
            if (prev) prev.classList.remove("selected")

            const el = document.getElementById(selectedId)
            if (el) el.classList.add("selected")
        }
    }, [renderedHtml, selectedId])


    return (
        <div className="flex-1 rounded-md bg-card text-black">
            {loading ?
                <div className="space-y-6 p-4 bg-white rounded-md flex-1">
                    {Array.from({ length: 5 }).map((_, pIndex) => (
                        <div key={pIndex} className="space-y-2">
                            {Array.from({ length: Math.floor(Math.random() * 4) + 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-4 rounded bg-muted animate-pulse"
                                    style={{ width: `${60 + Math.random() * 40}%` }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                : (
                    <div
                        className="mx-auto flex-1 w-full rounded-md p-6 bg-white text-black"
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                        onMouseOver={(e) => {
                            const target = (e.target as HTMLElement).closest(".selectable") as HTMLElement | null
                            if (target) target.classList.add("hovered")
                        }}
                        onMouseOut={(e) => {
                            const target = (e.target as HTMLElement).closest(".selectable") as HTMLElement | null
                            if (target) target.classList.remove("hovered")
                        }}
                        onClick={(e) => {
                            const target = (e.target as HTMLElement).closest(".selectable") as HTMLElement | null
                            if (target) {
                                setSelectedId(target.id)
                                setSelectedText(target.innerText)
                                setOriginalHtml(target.innerHTML)
                            }
                        }}
                    />
                )}
        </div>
    )
}

export default PDFPreview