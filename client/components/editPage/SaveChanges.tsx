'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { usePdf } from '@/hooks/usePdf'
import { useEditPdfStore } from '@/app/store/useEditPdfStore'
import { Button } from '../ui/button'

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
      Save
    </Button>
  )
}

export default SaveChanges
