'use client'
import React, { useState } from 'react'
import PDFPreview from './PDFPreview'
import { createContextFile, addContextFile } from '../../db/context'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/app/store/useUserStore'
import { useAuthRehydrate } from '@/hooks/useAuthRehydrate'
import { usePdfStore } from '@/app/store/usePdfStore'
import GenerateSection from './GenerateSection'
import EditSection from './EditSection'

const Generate = () => {
  useAuthRehydrate()
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { userId } = useUserStore()
  const { pdfId, fileName, htmlContent, setPdf } = usePdfStore()

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Prompt is empty dumbass.")
      return
    }
    setLoading(true)
    try {
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
      toast.success("PDF Created")
      setPdf({ pdfId: createData.id })

      if (createData.status === 200) {
        const generateRes = await fetch('/api/generateHTML', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            userPrompt: input,
            pdfId: createData.id,
            isContext: false
          })
        })
        if (!generateRes.ok) throw new Error("Failed to create PDF")

        const generateData = await generateRes.json()
        toast.success("HTML Generated")
        setPdf({ htmlContent: generateData.data })

        const updateRes = await fetch('/api/updatePdf', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: generateData.data,
            id: pdfId
          })
        })
        if (!updateRes.ok) throw new Error("Failed to create PDF")
        const updateData = await updateRes.json()
        if (updateData.status === 200) {
          setSuccess(true)
          toast.success(updateData.message)
        }

      }
    }
    catch (err) {
      console.error("Error in handleSend:", err)
      toast.error("Error occurred while generating HTML")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex p-4 text-foreground gap-6 bg-background h-full">
      {
        !success ?
          <GenerateSection
            input={input}
            setInput={setInput}
            files={files}
            setFiles={setFiles}
            handleSend={handleSend}
            loading={loading}
          />
          :
          <EditSection loading={loading} />
      }
    </div>
  )
}

export default Generate