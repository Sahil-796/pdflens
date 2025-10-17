'use client'

import React, { useCallback, useEffect } from 'react'
import { useEditPdfStore } from '@/app/store/useEditPdfStore'

interface PDFPreviewProps {
  loading: boolean
  html: string
  pdfId: string
  onTextSelect?: () => void
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ loading, html, onTextSelect }) => {
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
    setPromptValue,
    setShowAiResponse,
    setAiResponse,
    setStatus
  } = useEditPdfStore()

  useEffect(() => {
    if (html) setRenderedHtml(html)
  }, [html, setRenderedHtml])

  const applyChanges = useCallback(
    (newContent: string) => {
      if (!selectedId || !renderedHtml) return
      const parser = new DOMParser()
      const doc = parser.parseFromString(renderedHtml, 'text/html')
      const el = doc.getElementById(selectedId)
      if (el) el.outerHTML = newContent
      setRenderedHtml(doc.documentElement.outerHTML)
      setShowAiResponse(false)
      setAiResponse('')
      setStatus('prompt')
      setPromptValue('')
    },
    [selectedId, renderedHtml, setRenderedHtml, setShowAiResponse, setAiResponse, setStatus, setPromptValue]
  )

  // Handle selection styling
  useEffect(() => {
    if (renderedHtml && selectedId) {
      const prev = document.querySelector(".selected")
      if (prev) prev.classList.remove("selected")

      const el = document.getElementById(selectedId)
      if (el) el.classList.add("selected")
    }
  }, [renderedHtml, selectedId])

  // Handle AI response display inline - PERSIST until accept/reject
  useEffect(() => {
    if (showAiResponse && selectedId && aiResponse) {
      const el = document.getElementById(selectedId)
      // Check if AI response is already displayed
      const existingResponse = el.querySelector('.ai-response-container')
      if (existingResponse) return // Don't recreate if already exists

      // Store original content
      const originalContent = el.innerHTML

      // Create AI response display
      const aiResponseDiv = document.createElement('div')
      aiResponseDiv.className = 'ai-response-container'
      aiResponseDiv.innerHTML = `
        <div class="ai-response-content">
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
        applyChanges(aiResponse)
      })

      rejectBtn?.addEventListener('click', (e) => {
        e.stopPropagation()
        // Restore original content
        el.innerHTML = originalContent
        setShowAiResponse(false)
        setAiResponse("")
        setStatus('prompt')
        setPromptValue("")
      })
    }
  }, [showAiResponse, selectedId, aiResponse, applyChanges, setAiResponse, setShowAiResponse, setStatus, setPromptValue])

  return (
    <div className="h-full w-full bg-background">
      {loading ? (
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
      ) : (
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
                // Toggle selection if clicking the same element
                if (selectedId === target.id) {
                  // Deselect
                  target.classList.remove("selected")
                  setSelectedId('')
                  setSelectedText('')
                  setOriginalHtml('')
                } else {
                  // Select new element
                  setSelectedId(target.id)
                  setSelectedText(target.innerText)
                  setOriginalHtml(target.outerHTML)
                  // Trigger sidebar open on mobile
                  onTextSelect?.()
                }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

export default PDFPreview
