'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useUserStore } from '@/app/store/useUserStore'
import { useAuthRehydrate } from '@/hooks/useAuthRehydrate'
import { usePdfStore } from '@/app/store/usePdfStore'
import { useRouter } from 'next/navigation'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import UploadFiles from '@/components/generatePage/UploadFiles'
import AIWorking from '@/components/generatePage/AIWorking'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [limitModalOpen, setLimitModalOpen] = useState(false)

  const { userId, creditsLeft, setUser } = useUserStore()
  const { fileName, pdfId, setPdf, clearPdf, isContext, addPdf } = usePdfStore()

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
      router.push(`/edit/${pdfId}`)
    }
  }, [success, pdfId, router])

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Prompt cannot be empty")
      return
    }

    if (creditsLeft == 0) {
      setLimitModalOpen(true)
      return
    }

    setLoading(true)
    setShowAIWorking(true)

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
      setUser({ creditsLeft: generateData.creditsLeft })

      const updateRes = await fetch('/api/updatePdf', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: generateData.data, id: currentPdfId, filename: fileName }),
      })
      const updateData = await updateRes.json()
      const resPdf = updateData.pdf
      if (updateData.status === 200) {
        setSuccess(true)
        toast.success(`"${fileName}" Generated Successfully!`)
        addPdf({ id: resPdf.id, fileName, htmlContent: resPdf.data, createdAt: resPdf.createdAt })
      }
    } catch (err) {
      console.error("Error in handleSend:", err)
      toast.error("Something went wrong while generating")
    } finally {
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
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-background overflow-auto">
      {/* Left Panel */}
      <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col">
        <div className="flex-1 p-4 space-y-8">
          {/* Document Name Input */}
          <div>
            <div className="bg-card px-1.5 sm:px-2 text-sm font-medium text-muted-foreground mb-1.5">
              Document Name
            </div>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setPdf({ fileName: e.target.value })}
              placeholder="Enter filename"
              className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              This name will be used for your PDF file
            </p>
          </div>

          {/* Document Description */}
          <div>
            <div className="bg-card px-1.5 sm:px-2 text-sm font-medium text-muted-foreground mb-1.5">
              Describe your document
            </div>
            <textarea
              id="inputMessage"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full h-40 sm:h-52 resize-none rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground -mt-1">
              Be specific about the content, format, and style you want
            </p>
          </div>

          {/* Token Display */}
          <div className="flex items-center justify-between bg-muted/40 border border-border rounded-md px-3 py-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{creditsLeft}</span> credits remaining today
            </div>
            <Link
              href="/pricing"
              className="text-xs font-medium text-primary hover:underline"
            >
              Get more credits →
            </Link>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-full mt-2 sm:mt-4 bg-primary text-primary-foreground rounded-md py-3 px-4 font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <TextShimmerWave duration={1}>Generating...</TextShimmerWave>
              </div>
            ) : (
              `Generate Document`
            )}
          </button>
        </div>

        {/* File Upload Section */}
        <div className="p-4 sm:p-6 border-t border-border">
          <UploadFiles />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 sm:p-6 space-y-8 overflow-y-auto">
          {template && (
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Using Template: {template}</h4>
              <p className="text-sm text-muted-foreground">
                This template will help structure your document. You can modify the content as needed.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Tips for better results:</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><span className="text-primary">•</span>Be specific about the document type and purpose</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span>Include key details like names, dates, and requirements</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span>Upload reference files for better context</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span>Use clear, descriptive language</li>
            </ul>
          </div>

          {/* Available Templates */}
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Available Templates:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Improved Alert Dialog */}
      <AlertDialog open={limitModalOpen} onOpenChange={setLimitModalOpen}>
        <AlertDialogContent className="bg-gradient-to-br from-card to-background border-border w-[92%] sm:w-[480px] rounded-2xl shadow-xl">
          <AlertDialogHeader className="space-y-2">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">⚠️</span>
              </div>
            </div>
            <AlertDialogTitle className="text-center text-lg font-semibold text-foreground">
              Daily Token Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-muted-foreground">
              You’ve used up your <span className="font-medium text-foreground">20 daily credits</span>.
              Upgrade to <span className="font-medium text-primary">Premium</span> to unlock
              <span className="font-medium text-foreground"> 100 credits per day</span> and more benefits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
            <AlertDialogCancel className="border-border w-full sm:w-auto">
              Close
            </AlertDialogCancel>
            <Link href="/pricing" className="w-full sm:w-auto">
              <AlertDialogAction className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition">
                View Pricing
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Generate
