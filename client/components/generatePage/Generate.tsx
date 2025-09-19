'use client'
import React, { useState } from 'react'
import PDFPreview from './PDFPreview'
import { createContextFile, addContextFile } from '../../db/context'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/app/store/useUserStore'
import { useAuthRehydrate } from '@/hooks/useAuthRehydrate'
import { usePdfStore } from '@/app/store/usePdfStore'

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
      <AnimatePresence mode="wait">
        <div className={`${success ? 'w-1/3' : 'w-full'} bg-card p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-border relative overflow-hidden`}>
          <h2 className="text-xl font-semibold">
            {
              success ? "Edit PDF" : "Generate PDF"
            }
          </h2>

          {/* AnimatePresence handles mounting/unmounting animations */}
          {!success ? (

            // Initial Stage
            <motion.div
              key="initial"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                value={fileName}
                onChange={(e) => setPdf({ fileName: e.target.value || "Untitled" })}
                placeholder="Enter filename"
                className="bg-muted border border-border rounded-md p-2 w-full 
             focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                id="inputMessage"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your text here..."
                className="bg-muted border border-border rounded-md p-3 w-full h-40 resize-none 
                         focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>

              <div>
                <label className="block font-medium mb-2">Upload Files</label>
                <input
                  type="file"
                  multiple
                  className="block w-full text-sm text-muted-foreground
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-muted file:text-foreground
                             hover:file:bg-accent
                             cursor-pointer"
                />
                {files.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {files.map((file, idx) => (
                      <li key={idx} className="truncate">
                        📄 {file.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ) : (
            // Edit Stage
            <motion.div
              key="editing"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Refine, shorten, or edit..."
                className="bg-muted border border-border rounded-md p-3 w-full h-40 resize-none 
                         focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
              />
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Right Side: Preview */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
          >
            <PDFPreview loading={loading} html={htmlContent} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Generate