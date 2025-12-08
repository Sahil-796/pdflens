"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TextShimmerWave } from "../motion-primitives/text-shimmer-wave";
import UploadFiles from "@/components/generatePage/UploadFiles";
import AIWorking from "@/components/generatePage/AIWorking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Coins } from "lucide-react";
import { Button } from "../ui/button";
import { useGeneratePdf } from "@/hooks/mutations/useGeneratePdf";
import { useEditorStore } from "@/store/useEditorStore";
import useUser from "@/hooks/useUser";

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
  Agreement: `
Draft a legal agreement with placeholders for:
- Agreement Title: [Agreement Name]
- Parties Involved: [Party A, Party B]
- Date: [Date of Agreement]
- Terms & Conditions: [Key Terms]
- Payment Details: [Payment Structure]
- Duration: [Contract Duration]
- Signatures: [Party A Signature, Party B Signature]
`,
  Report: `
Generate a structured report with placeholders for:
- Report Title: [Title of Report]
- Author: [Your Name]
- Date: [Date of Report]
- Executive Summary: [Summary of Report]
- Body: [Main Content Sections]
- Conclusion: [Final Remarks]
- Appendices: [Supporting Material]
`,
};

const Generate = () => {
  const searchParams = useSearchParams();

  const [input, setInput] = useState("");
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const { user } = useUser();
  const { fileName, updateFileName, contextFiles, resetEditor } =
    useEditorStore();

  const { mutate: generatePdf, isPending } = useGeneratePdf();

  const template = searchParams.get("template");

  useEffect(() => {
    resetEditor();
  }, [resetEditor]);

  useEffect(() => {
    if (template && templatePrompts[template]) {
      setInput(templatePrompts[template].trim());
    }
  }, [template]);

  const handleSend = () => {
    if (!input.trim()) {
      toast.error("Prompt cannot be empty");
      return;
    }

    const currentCredits = user?.creditsLeft ?? 0;
    if (currentCredits < 4) {
      setLimitModalOpen(true);
      return;
    }

    generatePdf(
      {
        userPrompt: input,
        fileName: fileName || "Untitled Document",
        isContext: contextFiles.length > 0,
      },
      {
        onError: (error) => {
          if (
            error.message === "DAILY TOKEN LIMIT REACHED" ||
            error.message === "LIMIT_REACHED"
          ) {
            setLimitModalOpen(true);
          }
        },
      },
    );
  };

  if (isPending) {
    return <AIWorking prompt={input} fileName={fileName} status="working" />;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
      {/* Left Panel */}
      <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col">
        <div className="flex-1 p-4 space-y-6">
          {/* Document Name Input */}
          <div>
            <div className="px-1.5 sm:px-2 text-sm font-medium text-muted-foreground mb-1.5">
              Document Name
            </div>
            <input
              type="text"
              value={fileName}
              onChange={(e) => updateFileName(e.target.value)} // Using Store Action
              placeholder="Enter filename"
              className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              This name will be used for your PDF file
            </p>
          </div>

          {/* Document Description */}
          <div>
            <div className="px-1.5 sm:px-2 text-sm font-medium text-muted-foreground mb-1.5">
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
          <div className="flex items-center gap-4 rounded-md">
            <Badge variant="secondary" className="text-sm">
              <Coins className="h-4 w-4 mr-1" />
              {user?.creditsLeft ?? "..."} credits remaining
            </Badge>
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
            disabled={isPending || !input.trim()}
            className="w-full bg-primary text-primary-foreground rounded-md py-3 px-4 font-medium hover:bg-primary/90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <TextShimmerWave duration={1}>Generating...</TextShimmerWave>
              </div>
            ) : (
              `Generate Document`
            )}
          </button>
        </div>

        {/* File Upload Section */}
        <div className="px-4 pb-4 sm:px-6">
          <UploadFiles />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-8">
        {/* Tips */}
        <div className="space-y-4">
          <h4 className="font-medium mb-3">Tips for better results:</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>Be specific about the
              document type and purpose
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>Include key details like
              names, dates, and requirements
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>Upload reference files for
              better context
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>Use clear, descriptive
              language
            </li>
          </ul>
        </div>

        {/* Available Templates */}
        <div className="space-y-4">
          <h4 className="font-medium mb-3">Available Templates:</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(templatePrompts).map((templateName) => (
              <Button
                key={templateName}
                variant="outline"
                onClick={() => setInput(templatePrompts[templateName].trim())}
                className="cursor-pointer text-xs sm:text-sm justify-start"
              >
                {templateName.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Limit Modal */}
      <AlertDialog open={limitModalOpen} onOpenChange={setLimitModalOpen}>
        <AlertDialogContent className="bg-linear-to-br from-card to-background border-border w-[92%] sm:w-[480px] rounded-2xl shadow-xl">
          <AlertDialogHeader className="space-y-2">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">!</span>
              </div>
            </div>
            <AlertDialogTitle className="text-center text-lg font-semibold text-foreground">
              Daily Token Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-muted-foreground">
              You’ve used up your daily credits. Upgrade to Premium for more.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
            <AlertDialogCancel className="border-border w-full sm:w-auto">
              Close
            </AlertDialogCancel>
            <Link href="/pricing" className="w-full sm:w-auto">
              <AlertDialogAction className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition cursor-pointer">
                View Pricing
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Generate;
