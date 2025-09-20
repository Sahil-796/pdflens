'use client'
import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { createContextFile, addContextFile } from '../../db/context'
import { toast } from 'sonner'
import { useUserStore } from '@/app/store/useUserStore'
import { useAuthRehydrate } from '@/hooks/useAuthRehydrate'
import { usePdfStore } from '@/app/store/usePdfStore'
import { useRouter } from 'next/navigation'

const Generate = () => {
  const router = useRouter()
  useAuthRehydrate()
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { userId } = useUserStore()
  const { fileName, pdfId, setPdf } = usePdfStore()

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
      setPdf({ pdfId: createData.id })
      toast.success("PDF Created")

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
        setPdf({ htmlContent: generateData.data })

        const updateRes = await fetch('/api/updatePdf', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: generateData.data,
            id: createData.id
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

  useEffect(() => {
    if (success) {
      router.push(`/edit/${pdfId}`)
    }
  }, [success])

  return (
    <div className="flex p-4 text-foreground gap-6 bg-background h-full">
      <div className={`w-full bg-card p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-border relative overflow-hidden`}>
        <h2 className="text-xl font-semibold">
          Generate PDF
        </h2>
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
            onChange={(e) => setPdf({ fileName: e.target.value })}
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
      </div>
    </div>
  )
}

export default Generate