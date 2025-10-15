'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { usePdf } from '@/hooks/usePdf'
import { useEditPdfStore } from '@/app/store/useEditPdfStore'

const SaveChanges = ({ filename, onSaveSuccess }: { filename: string, onSaveSuccess?: () => void }) => {
  const { pdfId } = usePdfStore()
  const { renderedHtml } = useEditPdfStore()
  const { pdfs } = usePdf()
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!renderedHtml) return

    setLoading(true)
    if (filename.trim() == '') {
      toast.error("Filename can't be empty")
      return
    }
    const res = await fetch("/api/updatePdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: renderedHtml,
        id: pdfId,
        filename
      }),
    })

    if (res.ok) {
      setLoading(false)
      toast.success("Changes Saved.")
      onSaveSuccess?.()
      pdfs.forEach(e => {
        if (e.id == pdfId) e.fileName = filename
      })
    } else {
      setLoading(false)
      toast.error("Error while Saving.")
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className="
    group flex items-center justify-center gap-2
    bg-secondary text-secondary-foreground font-medium
    rounded-md px-2.5 py-2 text-sm shadow-sm
    hover:bg-secondary/80 hover:shadow-md
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed

    sm:px-3 sm:py-2
    md:text-base md:px-4 md:py-2.5
  "
    >
      <Save
        className={`
      w-4 h-4 shrink-0
      ${loading ? 'animate-caret-blink' : ''}
      sm:w-5 sm:h-5
    `}
      />
      <span
        className="
      hidden 
      text-xs sm:text-sm lg:inline md:text-base
    "
      >
        Save
      </span>
    </button>
  )
}

export default SaveChanges
