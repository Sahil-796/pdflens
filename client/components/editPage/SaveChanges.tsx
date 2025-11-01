'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Dot, Save } from 'lucide-react'
import { usePdf } from '@/hooks/usePdf'
import { useEditPdfStore } from '@/app/store/useEditPdfStore'
import { Button } from '../ui/button'

const SaveChanges = ({ filename, onSaveSuccess }: { filename: string, onSaveSuccess?: () => void }) => {
  const { pdfId } = usePdfStore()
  const { renderedHtml, saveChange, setSaveChange, setRenderedHtml, setSelectedId, setSelectedText } = useEditPdfStore()
  const { pdfs } = usePdf()
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!renderedHtml) return
    setLoading(true)
    try {
      if (filename.trim() == '') {
        toast.error("Filename can't be empty")
        return
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(renderedHtml, 'text/html')
      const el = doc.querySelector('.selected')
      if (el) el.classList.remove('selected')
      setRenderedHtml(doc.documentElement.outerHTML)
      setSelectedText('')
      setSelectedId('')

      const res = await fetch("/api/updatePdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: doc.documentElement.outerHTML,
          id: pdfId,
          filename
        }),
      })

      if (res.ok) {
        setSaveChange(false)
        toast.success("Changes Saved.")
        onSaveSuccess?.()
        pdfs.forEach(e => {
          if (e.id == pdfId) e.fileName = filename
        })
      }
    } catch (err) {
      console.error(err)
      toast.error("Error while Saving.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant='secondary'
      size='lg'
      onClick={handleSave}
      disabled={loading}
      className="hover:scale-103 cursor-pointer"
    >
      <Save
        className={`
      w-4 h-4 shrink-0
      ${loading ? 'animate-caret-blink' : ''}
    `}
      />
      <span>Save</span>
      {saveChange && (
        <Dot className="text-primary -ml-1 scale-200 animate-caret-blink" />
      )}
    </Button>
  )
}

export default SaveChanges
