'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useUserStore } from '@/app/store/useUserStore'
import { useAuthRehydrate } from '@/hooks/useAuthRehydrate'
import { usePdfStore } from '@/app/store/usePdfStore'
import { useRouter } from 'next/navigation'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import UploadFiles from '@/components/generatePage/UploadFiles'

const Generate = () => {
  const router = useRouter()
  useAuthRehydrate()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { userId } = useUserStore()
  const { fileName, pdfId, setPdf, clearPdf } = usePdfStore()

  useEffect(() => { clearPdf() }, [])

  useEffect(() => {
    if (success) {
      router.push(`/edit/${pdfId}`)
    }
  }, [success])


  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Prompt is empty dumbass.")
      return
    }
    setLoading(true)

    try {
      let currentPdfId = pdfId

      // Case 2: If no PDF exists, create one
      if (!currentPdfId) {
        const createRes = await fetch('/api/createPdf', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: '',
            pdfName: fileName,
          })
        })
        if (!createRes.ok) throw new Error("Failed to create PDF")
        const createData = await createRes.json()
        if (createData.status !== 200) throw new Error("PDF creation failed")

        currentPdfId = createData.id
        setPdf({ pdfId: currentPdfId })
      }

      // Generate HTML
      const generateRes = await fetch('/api/generateHTML', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          userPrompt: input,
          pdfId: currentPdfId,
          isContext: false
        })
      })
      if (!generateRes.ok) {
        const delRes = await fetch('/api/deletePdf', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdfId: currentPdfId,
          })
        })
        if (!delRes.ok) throw new Error("Failed to delte PDF.")
        throw new Error("Failed to generate HTML")
      }


      const generateData = await generateRes.json()
      setPdf({ htmlContent: generateData.data })

      // Update PDF with generated HTML
      const updateRes = await fetch('/api/updatePdf', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: generateData.data,
          id: currentPdfId
        })
      })
      if (!updateRes.ok) throw new Error("Failed to update PDF")

      const updateData = await updateRes.json()
      if (updateData.status === 200) {
        setSuccess(true)
        toast.success(updateData.message)
      }
    } catch (err) {
      console.error("Error in handleSend:", err)
      toast.error("Error occurred while generating/updating HTML")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full p-4 text-foreground bg-background">
      <div className="relative flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-lg overflow-hidden">
        <motion.div
          key="initial"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4"
        >
          {/* File Name Input */}
          <input
            type="text"
            value={fileName}
            onChange={(e) => setPdf({ fileName: e.target.value })}
            placeholder="Enter filename (Can't change afterwards)"
            className="w-full rounded-md border border-border bg-muted p-2 
             focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Prompt Textarea */}
          <textarea
            id="inputMessage"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your here..."
            className="h-40 w-full resize-none rounded-md border border-border bg-muted p-3 
                     text-foreground placeholder-muted-foreground 
                     focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Generate Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <TextShimmerWave duration={1}>Generating...</TextShimmerWave> : 'Generate'}
          </button>

          <UploadFiles />
        </motion.div>
      </div>
    </div>
  )
}

export default Generate