'use client'
import React, { useState } from 'react'
import PDFPreview from './generatePage/PDFPreview'
import { createContextFile, addContextFile } from '../db/context'
import DownloadPDF from './generatePage/DownloadPDF'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/app/store/useUserStore'
import { useAuthRehydrate } from '@/hooks/useAuthRehydrate'

const Generate = () => {
  useAuthRehydrate()
  const [input, setInput] = useState('')
  const [html, setHtml] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [pdfName, setPdfName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { userId } = useUserStore()

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Prompt is empty dumbass.")
    }
    setLoading(true)
    try {
      const res = await fetch("/api/generateHTML", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          user_prompt: input,
          isContext: false,
          pdfId: 'pdfId'
        }),
      })

      if (!res.ok) throw new Error("Failed to generate HTML")

      const data = await res.json()
      setHtml(data ?? "<p>Failed to generate HTML</p>")
    } catch (err) {
      console.error("Error in handleSend:", err)
      toast.error('Error occurred while generating HTML')
    } finally {
      setLoading(false)
    }
  }


  // handles uploading files to py server on change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (!e.target.files || e.target.files.length === 0) return;

    // const file = e.target.files[0]; // only one file per selection

    // try {
    //   let newPdf = null
    //   if (files.length === 0) {
    //       const id = uuidv4()
    //       newPdf = await createPdfPending(id, userId, pdfName)  
    //   }
    //   // 1. Upload to Python server
    //   const formData = new FormData();
    //   formData.append("file", file);
    //   formData.append("userId", userId); // replace with your current user
    //   formData.append("pdfId", pdfId);   // replace with your current PDF

    //   const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/upload`, {
    //     method: "POST",
    //     body: formData,
    //   });

    //   if (!res.ok) {
    //     console.error("Upload failed for", file.name);
    //     return;
    //   }

    //   // 2. Update SQL context row
    //   if (files.length === 0) {
    //     await createContextFile(pdfId, userId, file.name); // first file → create row
    //   } else {
    //     await addContextFile(pdfId, userId, file.name);    // subsequent files → append
    //   }

    //   // 3. Update UI state
    //   setFiles((prev) => [...prev, file]);
    // } catch (err) {
    //   console.error("Error uploading file:", file.name, err);
    // }

    // // 4. Reset the input so user can select the same file again if needed
    // e.target.value = "";
  };


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

              <div className="flex flex-wrap gap-2">
                {/* <button
                  onClick={() => handleSend('edit')}
                  disabled={loading}
                  className="bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Apply Changes'}
                </button>

                <button
                  onClick={() => handleSend('rewrite')}
                  disabled={loading}
                  className="bg-accent text-accent-foreground rounded-md py-2 px-4 hover:bg-accent/90 transition cursor-pointer disabled:opacity-50"
                >
                  Rewrite
                </button>

                <button
                  onClick={() => handleSend('concise')}
                  disabled={loading}
                  className="bg-secondary text-secondary-foreground rounded-md py-2 px-4 hover:bg-secondary/90 transition cursor-pointer disabled:opacity-50"
                >
                  Make Concise
                </button>

                <button
                  onClick={() => handleSend('similar')}
                  disabled={loading}
                  className="bg-muted text-foreground rounded-md py-2 px-4 hover:bg-muted/70 transition cursor-pointer disabled:opacity-50"
                >
                  Similar
                </button> */}

                <DownloadPDF html={html} />
              </div>
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
            <PDFPreview loading={loading} html={html} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Generate