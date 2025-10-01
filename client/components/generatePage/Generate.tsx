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
  "Resume": `
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
  "Business-Proposal": `
Create a business proposal with placeholders for:
- Proposal Title: [Proposal Name]
- Client: [Client Name]
- Prepared By: [Your Company Name]
- Executive Summary: [Summary of Proposal]
- Problem Statement: [Problem Definition]
- Solution: [Proposed Solution]
- Pricing: [Pricing Details]
- Timeline: [Delivery Timeline]
- Contact: [Contact Information]
`,
  "Cover-Letter": `
Write a professional cover letter with placeholders for:
- Recipient Name: [Hiring Manager's Name]
- Company: [Company Name]
- Position: [Position Title]
- Applicant Name: [Your Name]
- Introduction: [Short intro about yourself]
- Body: [Why you're a great fit, skills, achievements]
- Closing: [Closing statement + call to action]
- Signature: [Your Full Name]
`,
  "Research-Paper": `
  Generate a structured research paper with placeholders for:
- Title: [Paper Title]
- Author(s): [Author Names]
- Abstract: [Short Summary]
- Introduction: [Introduction Content]
- Methodology: [Method Details]
- Results: [Findings]
- Discussion: [Discussion Points]
- Conclusion: [Concluding Remarks]
- References: [List of References]
  `,
  "Agreement": `
  Draft a legal agreement with placeholders for:
- Agreement Title: [Agreement Name]
- Parties Involved: [Party A, Party B]
- Date: [Date of Agreement]
- Terms & Conditions: [Key Terms]
- Payment Details: [Payment Structure]
- Duration: [Contract Duration]
- Signatures: [Party A Signature, Party B Signature] 
  `,
  "Report": `
  Generate a structured report with placeholders for:
- Report Title: [Title of Report]
- Author: [Your Name]
- Date: [Date of Report]
- Executive Summary: [Summary of Report]
- Body: [Main Content Sections]
- Conclusion: [Final Remarks]
- Appendices: [Supporting Material] 
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
      toast.error("Prompt cannot be empty")
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
      <div className="relative flex-1 flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-lg">
        <motion.div
          key="initial"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col flex-1 gap-6"
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
          <textarea
            id="inputMessage"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want..."
            className="flex-1 w-full resize-none rounded-md border border-border bg-muted p-3 
                         text-foreground placeholder-muted-foreground 
                         focus:outline-none focus:ring-2 focus:ring-ring"
          />

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