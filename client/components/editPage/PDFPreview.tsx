'use client'

import React, { useEffect } from 'react'
import { usePdfStore } from '@/app/store/usePdfStore'

interface PDFPreviewProps {
    loading: boolean
    html: string
    pdfId: string
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ loading, html }) => {
    const { 
        renderedHtml, 
        setRenderedHtml, 
        setSelectedId, 
        setSelectedText, 
        setOriginalHtml, 
        selectedId,
        selectedText,
        aiResponse,
        showAiResponse,
        setShowAiResponse,
        setAiResponse
    } = usePdfStore()


    useEffect(() => {
        if (html) setRenderedHtml(html)
    }, [html, setRenderedHtml])

    const applyChanges = (newContent: string) => {
        if (!selectedId || !renderedHtml) return
        const parser = new DOMParser()
        const doc = parser.parseFromString(renderedHtml, "text/html")
        const el = doc.getElementById(selectedId)
        if (el) el.innerHTML = newContent
        setRenderedHtml(doc.documentElement.outerHTML)
        setShowAiResponse(false)
        setAiResponse("")
    }

    const handleAccept = () => {
        applyChanges(aiResponse)
    }

    const handleReject = () => {
        setShowAiResponse(false)
        setAiResponse("")
    }

    useEffect(() => {
        if (renderedHtml && selectedId) {
            const prev = document.querySelector(".selected")
            if (prev) prev.classList.remove("selected")

            const el = document.getElementById(selectedId)
            if (el) el.classList.add("selected")
        }
    }, [renderedHtml, selectedId])

    // Handle AI response display inline
    useEffect(() => {
        if (showAiResponse && selectedId && aiResponse) {
            const el = document.getElementById(selectedId)
            if (el) {
                
                // Create AI response display
                const aiResponseDiv = document.createElement('div')
                aiResponseDiv.className = 'ai-response-container'
                aiResponseDiv.innerHTML = `
                    <div class="ai-response-content">
                        <div class="ai-original">
                            <span class="ai-label">Original:</span>
                            <span class="ai-text original-text">${selectedText}</span>
                        </div>
                        <div class="ai-suggestion">
                            <span class="ai-label">AI Suggestion:</span>
                            <span class="ai-text suggestion-text">${aiResponse}</span>
                        </div>
                        <div class="ai-actions">
                            <button class="ai-btn accept-btn" data-action="accept">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                                Accept
                            </button>
                            <button class="ai-btn reject-btn" data-action="reject">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Reject
                            </button>
                        </div>
                    </div>
                `
                
                // Replace content with AI response
                el.innerHTML = ''
                el.appendChild(aiResponseDiv)
                
                // Add event listeners
                const acceptBtn = el.querySelector('.accept-btn')
                const rejectBtn = el.querySelector('.reject-btn')
                
                acceptBtn?.addEventListener('click', (e) => {
                    e.stopPropagation()
                    handleAccept()
                })
                
                rejectBtn?.addEventListener('click', (e) => {
                    e.stopPropagation()
                    handleReject()
                })
            }
        }
    }, [showAiResponse, selectedId, aiResponse, selectedText, handleAccept, handleReject])


    return (
        <div className="h-full w-full bg-background">
            {loading ?
                <div className="h-full overflow-y-auto p-6">
                    <div className="space-y-6 bg-white rounded-lg p-6">
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
                </div>
                : (
                    <div className="h-full overflow-y-auto">
                        <div
                            className="mx-auto w-full p-6 bg-white text-black"
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
                    </div>
                )}
        </div>
    )
}

export default PDFPreview