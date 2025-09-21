'use client'

import React, { useEffect, useState } from 'react'
import { usePdfStore } from '@/app/store/usePdfStore'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'

interface PDFPreviewProps {
    loading: boolean
    html: string
    pdfId: string
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ loading, html }) => {
    const { renderedHtml, setRenderedHtml, setSelectedId, setSelectedText, setOriginalHtml } = usePdfStore() // store selection globally


    useEffect(() => {
        if (html) setRenderedHtml(html)
    }, [html, setRenderedHtml])


    return (
        <div className="flex-1 overflow-y-scroll rounded-md p-6 bg-card text-black">
            {loading ? (
                <TextShimmerWave duration={1} className="left-1/2 -translate-x-1/2">
                    Loading the PDF...
                </TextShimmerWave>
            ) : (
                <div
                    onClick={(e) => {
                        const target = e.target as HTMLElement
                        if (target.id) {
                            setSelectedId(target.id)
                            setSelectedText(target.innerText)
                            setOriginalHtml(target.innerHTML)
                        }
                    }}
                    className="mx-auto flex-1 w-full overflow-y-scroll rounded-md px-6 pb-6 bg-white text-black"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
            )}
        </div>
    )
}

export default PDFPreview