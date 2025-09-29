'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useUserStore } from '@/app/store/useUserStore'
import { useAuthRehydrate } from '@/hooks/useAuthRehydrate'
import { usePdfStore } from '@/app/store/usePdfStore'
import { useRouter } from 'next/navigation'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import UploadFiles from '@/components/generatePage/UploadFiles'

const templatePrompts: Record<string, string> = {
  Resume: `
Create a professional resume with the following details:
- Name: [Your Name]
- Email: [Your Email]
- Phone: [Your Phone Number]
- Address: [Your Address]
- Education: [Your College/University, Degree, Year]
- Skills: [List of Skills]
- Projects: [Project Name, Description, Technologies]
- Experience: [Company Name, Role, Duration, Responsibilities]
- Achievements: [Any awards or certifications]
- Objective: [Short career objective]
`,
  Invoice: `
Generate a professional invoice with placeholders for:
- Invoice Number: [Invoice Number]
- Date: [Invoice Date]
- Bill To: [Client Name and Address]
- From: [Your Company Name and Address]
- Itemized List: [Item, Description, Quantity, Price]
- Subtotal: [Subtotal Amount]
- Taxes: [Applicable Taxes]
- Total Amount: [Total Amount]
- Payment Terms: [Payment Terms]
- Notes: [Additional Notes]
`,
  Certificate: `
Generate a certificate template with placeholders for:
- Recipient Name: [Name of Recipient]
- Course/Event Name: [Course or Event Title]
- Date: [Date of Completion]
- Issuer: [Organization or Person Issuing Certificate]
- Additional Notes: [Any remarks or achievements]
`
}

const Generate = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  useAuthRehydrate()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { userId } = useUserStore()
  const { fileName, pdfId, setPdf, clearPdf, isContext } = usePdfStore()

  const template = searchParams.get('template') // Check for template param

  useEffect(() => {
    clearPdf()
    // If template exists, pre-fill prompt
    if (template && templatePrompts[template]) {
      setInput(templatePrompts[template].trim())
    }
  }, [clearPdf, template])

  useEffect(() => {
    if (success) router.push(`/edit/${pdfId}`)
  }, [success, pdfId, router])

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Prompt cannot be empty️")
      return
    }
    setLoading(true)

    try {
      let currentPdfId = pdfId
      if (!currentPdfId) {
        const createRes = await fetch('/api/createPdf', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html: '', pdfName: fileName }),
        })
        if (!createRes.ok) throw new Error("Failed to create PDF")
        const createData = await createRes.json()
        currentPdfId = createData.id
        setPdf({ pdfId: currentPdfId })
      }

      const generateRes = await fetch('/api/generateHTML', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userPrompt: input, pdfId: currentPdfId, isContext }),
      })
      if (!generateRes.ok) throw new Error("Failed to generate HTML")

      const generateData = await generateRes.json()
      setPdf({ htmlContent: generateData.data })

      const updateRes = await fetch('/api/updatePdf', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: generateData.data, id: currentPdfId }),
      })
      const updateData = await updateRes.json()

      if (updateData.status === 200) {
        setSuccess(true)
        toast.success("PDF Generated Successfully!")
      }
    } catch (err) {
      console.error("Error in handleSend:", err)
      toast.error("Something went wrong while generating")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full p-4 text-foreground bg-background">
      <div className="relative flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-lg">
        <motion.div
          key="initial"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* File Name Input */}
          <div className="relative">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setPdf({ fileName: e.target.value })}
              placeholder="Enter filename"
              className="w-full rounded-md border border-border bg-muted p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">Filename can't be changed later</p>
          </div>

          {/* Prompt Textarea */}
          <div className="relative">
            <textarea
              id="inputMessage"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want..."
              className="h-40 w-full resize-none rounded-md border border-border bg-muted p-3 
                         text-foreground placeholder-muted-foreground 
                         focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {input.length}/500
            </span>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <TextShimmerWave duration={1}>Generating...</TextShimmerWave> : 'Generate PDF'}
          </button>

          {/* File Upload */}
          <UploadFiles />
        </motion.div>
      </div>
    </div>
  )
}

export default Generate