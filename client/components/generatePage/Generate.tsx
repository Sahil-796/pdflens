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
import AIWorking from '@/components/generatePage/AIWorking'

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
  const [showAIWorking, setShowAIWorking] = useState(false)
  const [progress, setProgress] = useState(0)

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
    if (success) {
      // Add a small delay to show the success state before redirecting
      const timer = setTimeout(() => {
        router.push(`/edit/${pdfId}`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, pdfId, router])

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Prompt cannot be empty")
      return
    }
    
    setLoading(true)
    setShowAIWorking(true)
    setProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 1000)

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
        setProgress(100)
        setSuccess(true)
        toast.success("PDF Generated Successfully!")
      }
    } catch (err) {
      console.error("Error in handleSend:", err)
      toast.error("Something went wrong while generating")
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
    }
  }


  // Show AI Working interface when generating
  if (showAIWorking) {
    return (
      <AIWorking
        prompt={input}
        fileName={fileName}
        status={success ? 'success' : loading ? 'working' : 'error'}
        progress={progress}
      />
    )
  }

  return (
    <div className="h-full flex bg-background">
      {/* Left Panel - Generation Form */}
      <div className="w-3/5 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-2">Generate PDF</h2>
          <p className="text-sm text-muted-foreground">Create documents with AI assistance</p>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* File Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setPdf({ fileName: e.target.value })}
              placeholder="Enter filename"
              className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">This name will be used for your PDF file</p>
          </div>

          {/* Prompt Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe your document</label>
            <textarea
              id="inputMessage"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full h-48 resize-none rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Be specific about the content, format, and style you want</p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-full bg-primary text-primary-foreground rounded-md py-3 px-4 font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <TextShimmerWave duration={1}>Generating...</TextShimmerWave>
              </div>
            ) : (
              'Generate PDF'
            )}
          </button>
        </div>

        {/* File Upload Section */}
        <div className="p-6 border-t border-border">
          <UploadFiles />
        </div>
      </div>

      {/* Right Panel - Information */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold mb-2">How it works</h3>
          <p className="text-sm text-muted-foreground">AI-powered document generation</p>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Template Info */}
          {template && (
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">Using Template: {template}</h4>
              <p className="text-sm text-muted-foreground">
                This template will help structure your document. You can modify the content as needed.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="space-y-4">
            <h4 className="font-medium">Tips for better results:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Be specific about the document type and purpose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Include key details like names, dates, and requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Upload reference files for better context</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Use clear, descriptive language</span>
              </li>
            </ul>
          </div>

          {/* Available Templates */}
          <div className="space-y-3">
            <h4 className="font-medium">Available Templates:</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(templatePrompts).map((templateName) => (
                <button
                  key={templateName}
                  onClick={() => setInput(templatePrompts[templateName].trim())}
                  className="text-left p-3 rounded-md border border-border hover:bg-muted/50 transition text-sm"
                >
                  {templateName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Generate