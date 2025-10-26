'use client'

import React, { useCallback, useEffect } from 'react'
import { useEditPdfStore } from '@/app/store/useEditPdfStore'
import { toast } from 'sonner'

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
    aiResponse,
    showAiResponse,
    setPromptValue,
    setShowAiResponse,
    setAiResponse,
    setStatus,
    setSaveChange
  } = useEditPdfStore()

  useEffect(() => {
    if (html) setRenderedHtml(html)
  }, [html, setRenderedHtml])

  const acceptChanges = useCallback((newContent: string) => {
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
    setSaveChange(true)
  }, [renderedHtml, selectedId, setAiResponse, setPromptValue, setRenderedHtml, setShowAiResponse, setStatus])

  // Handle AI response display inline
  useEffect(() => {
    if (!showAiResponse || !selectedId || !aiResponse) return

    // Use setTimeout to ensure DOM is updated after React render
    const timer = setTimeout(() => {
      const el = document.getElementById(selectedId)
      if (!el) {
        console.error('Selected element not found:', selectedId)
        return
      }

      // Check if AI response is already displayed
      const existingResponse = el.querySelector('.ai-response-container')
      if (existingResponse) return // Don't recreate if already exists

      // Store original content AND classes/id before replacing
      const originalContent = el.innerHTML
      const originalClassName = el.className
      const originalId = el.id

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

      // Replace content with AI response and remove original classes
      el.innerHTML = ''
      el.className = 'ai-response-wrapper' // Replace with neutral class
      el.removeAttribute('id') // Remove ID to avoid conflicts
      el.appendChild(aiResponseDiv)

      // Add event listeners
      const acceptBtn = el.querySelector('.accept-btn')
      const rejectBtn = el.querySelector('.reject-btn')

      acceptBtn?.addEventListener('click', (e) => {
        e.stopPropagation()
        acceptChanges(aiResponse)
      })

      rejectBtn?.addEventListener('click', (e) => {
        e.stopPropagation()
        // Restore original content, classes, and ID
        el.innerHTML = originalContent
        el.className = originalClassName
        el.id = originalId
        setShowAiResponse(false)
        setAiResponse("")
        setStatus('prompt')
        setPromptValue("")
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [showAiResponse, selectedId, aiResponse, acceptChanges, setAiResponse, setShowAiResponse, setStatus, setPromptValue])

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
              if (aiResponse || showAiResponse) {
                toast.info("Accept or reject the current changes.")
                return
              }
              const target = (e.target as HTMLElement).closest(".selectable") as HTMLElement | null
              if (target) {
                const parser = new DOMParser()
                const doc = parser.parseFromString(renderedHtml, 'text/html')

                // Toggle selection if clicking the same element
                if (selectedId === target.id) {
                  // Deselect - remove selected class from HTML string
                  const el = doc.getElementById(target.id)
                  if (el) {
                    el.classList.remove("selected")
                    setRenderedHtml(doc.documentElement.outerHTML)
                  }
                  setSelectedId('')
                  setSelectedText('')
                  setOriginalHtml('')
                } else {
                  // Remove selected class from previously selected element
                  if (selectedId) {
                    const prevEl = doc.getElementById(selectedId)
                    if (prevEl) prevEl.classList.remove("selected")
                  }

                  // Add selected class to new element
                  const el = doc.getElementById(target.id)
                  if (el) {
                    el.classList.add("selected")
                    setRenderedHtml(doc.documentElement.outerHTML)
                    setSelectedId(target.id)
                    setSelectedText(el.innerText)
                    setOriginalHtml(el.outerHTML)
                    // Trigger sidebar open on mobile
                    onTextSelect?.()
                  }
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
