"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
import { TEMPLATE_PROMPTS } from "@/lib/templates";

const CREDIT_COST_PER_GEN = 4;

const Generate = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [input, setInput] = useState("");
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const { user } = useUser();
  const { activePdfId, fileName, updateFileName, contextFiles, resetEditor } =
    useEditorStore();

  const { mutate: generatePdf, isPending } = useGeneratePdf();

  const templateParam = searchParams.get("template");

  useEffect(() => {
    resetEditor();
  }, [resetEditor]);

  useEffect(() => {
    if (templateParam && TEMPLATE_PROMPTS[templateParam]) {
      const promptText = TEMPLATE_PROMPTS[templateParam].trim();
      setInput(promptText);

      if (!fileName || fileName === "Untitled Document") {
        const readableName = templateParam.replace(/-/g, " ") + " Draft";
        updateFileName(readableName);
      }
    }
  }, [templateParam, updateFileName, fileName]);

  const handleTemplateClick = (key: string) => {
    router.replace(`/generate?template=${key}`);
  };

  const handleSend = () => {
    if (!input.trim()) {
      toast.error("Prompt cannot be empty");
      return;
    }

    const currentCredits = user?.creditsLeft ?? 0;
    if (currentCredits < CREDIT_COST_PER_GEN) {
      setLimitModalOpen(true);
      return;
    }

    generatePdf(
      {
        userPrompt: input,
        fileName: fileName || "Untitled Document",
        isContext: contextFiles.length > 0,
        pdfId: activePdfId ?? undefined,
      },
      {
        onError: (error) => {
          if (
            error.message.includes("LIMIT") ||
            error.message.includes("TOKEN")
          ) {
            setLimitModalOpen(true);
          } else {
            toast.error("Something went wrong with generation");
          }
        },
      },
    );
  };

  if (isPending) {
    return <AIWorking prompt={input} fileName={fileName} status="working" />;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-full">
      {/* Added h-full and overflow-hidden to outer container for better scroll handling */}

      {/* Left Panel */}
      <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col h-full overflow-y-auto">
        <div className="flex-1 p-4 space-y-6">
          {/* Document Name Input */}
          <div>
            <div className="px-1.5 sm:px-2 text-sm font-medium text-muted-foreground mb-1.5">
              Document Name
            </div>
            <input
              type="text"
              value={fileName || ""}
              onChange={(e) => updateFileName(e.target.value)}
              placeholder="e.g., Q3 Marketing Report" // Better placeholder
              className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Document Description */}
          <div className="flex-1 flex flex-col">
            <div className="px-1.5 sm:px-2 text-sm font-medium text-muted-foreground mb-1.5 flex justify-between">
              <span>Describe your document</span>
              {templateParam && (
                <span
                  className="text-xs text-primary cursor-pointer hover:underline"
                  onClick={() => setInput("")}
                >
                  Clear Template
                </span>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full min-h-[200px] flex-1 resize-none rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all leading-relaxed"
            />
          </div>

          {/* Token Display & Button */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="text-xs font-normal px-3 py-1"
              >
                <Coins className="h-3.5 w-3.5 mr-1.5 text-secondary-foreground" />
                {user?.creditsLeft ?? 0} credits available
              </Badge>
              <Link
                href="/pricing"
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>

            <Button
              onClick={handleSend}
              disabled={isPending || !input.trim()}
              className="w-full py-6 text-base shadow-sm"
              size="lg"
            >
              Generate Document
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="px-4 pb-4 sm:px-6 border-t border-border/50 pt-4">
          <UploadFiles />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-2/5 flex flex-col p-4 sm:p-6 space-y-8 bg-muted/10 overflow-y-auto h-full">
        {/* Tips */}
        <div className="space-y-4 p-4 rounded-xl bg-card border border-border/50 shadow-sm">
          <h4 className="font-semibold text-sm">PRO Tips</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary text-lg leading-none">•</span>
              <span>
                <strong>Context matters:</strong> Uploading a previous PDF
                allows the AI to mimic your style.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary text-lg leading-none">•</span>
              <span>
                <strong>Be specific:</strong> Mention "Tables", "Bullet points",
                or specific standard clauses.
              </span>
            </li>
          </ul>
        </div>

        {/* Available Templates */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm px-1">Quick Templates</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(TEMPLATE_PROMPTS).map((key) => {
              const isActive = templateParam === key;
              return (
                <Button
                  key={key}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => handleTemplateClick(key)}
                  className={`
                    justify-start text-xs sm:text-sm h-auto py-3 px-4
                    ${isActive ? "border-primary" : "hover:border-primary/50"}
                  `}
                >
                  {key.replace(/-/g, " ")}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

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
