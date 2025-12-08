"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TextShimmerWave } from "../motion-primitives/text-shimmer-wave";
import { Wand2, RotateCcw, Coins } from "lucide-react";
import Link from "next/link";
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

import { useEditorStore } from "@/store/useEditorStore";
import useUser from "@/hooks/useUser";
import { useAiEdit } from "@/hooks/mutations/useAiEdit";

const EditPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-32 text-center rounded-lg border border-dashed border-border bg-muted/20 backdrop-blur-sm">
    <Wand2 className="w-6 h-6 mb-2 text-muted-foreground" />
    <p className="text-sm font-medium text-muted-foreground">
      Select text to edit
    </p>
  </div>
);

const SelectedTextView = ({ text }: { text: string }) => (
  <div className="text-sm text-muted-foreground border border-border/70 rounded-lg p-3 bg-card/60 backdrop-blur-sm shadow-inner">
    <p className="font-medium mb-1 text-foreground/80">Selected Text</p>
    <p className="italic text-xs leading-relaxed max-h-40 overflow-y-auto text-muted-foreground">
      {text}
    </p>
  </div>
);

export default function EditPDF({
  onSidebarToggle,
  pdfId,
}: {
  onSidebarToggle?: () => void;
  pdfId: string;
}) {
  const { user } = useUser();

  const {
    promptValue,
    selectedText,
    selectedId,
    draftHtml,
    setPromptValue,
    updateDraftHtml,
    setAiStatus,
    showAiResponse,

    clearSelection,
  } = useEditorStore();

  const { mutate: requestAiEdit, isPending } = useAiEdit();

  const [activeTab, setActiveTab] = useState<"ai-edit" | "replace">("ai-edit");
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "replace") {
      setAiStatus("prompt");
    }
  }, [activeTab, setAiStatus]);

  useEffect(() => {
    if (!selectedText) return;
    if (activeTab === "replace" && !promptValue) {
      setPromptValue(selectedText);
    }
  }, [selectedText, activeTab, setPromptValue, promptValue]);

  const handleReplace = (newContent: string) => {
    if (!selectedId || !draftHtml) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(draftHtml, "text/html");
      const el = doc.getElementById(selectedId);
      if (el) {
        const formatted = newContent
          .replace(/\n/g, "<br>")
          .replace(/ {2}/g, "&nbsp;&nbsp;");
        el.innerHTML = formatted;
        el.classList.remove("selected");
      }
      updateDraftHtml(doc.documentElement.outerHTML);
      clearSelection();
      onSidebarToggle?.();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAiEdit = () => {
    if (!user || user.creditsLeft <= 0) {
      setLimitModalOpen(true);
      return;
    }
    if (!promptValue) return;

    // Mutation handles the status updates (loading -> aiResult)
    requestAiEdit({ pdfId });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-wide flex items-center gap-1.5">
          Tools
        </h2>
        <Badge variant="secondary">
          <Coins className="h-4 w-4 mr-1" />
          {user?.creditsLeft ?? 0} credits left
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "ai-edit" | "replace")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-8 rounded-md bg-muted/40 border border-border/50">
          <TabsTrigger value="ai-edit" className="text-xs">
            AI Edit
          </TabsTrigger>
          <TabsTrigger value="replace" className="text-xs">
            Replace
          </TabsTrigger>
        </TabsList>

        {/* --- AI Edit Tab --- */}
        <TabsContent value="ai-edit" className="mt-3 space-y-3">
          {selectedText ? (
            <>
              <SelectedTextView text={selectedText} />

              {/* 3. Use 'showAiResponse' to toggle the UI */}
              {showAiResponse ? (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm">
                  <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                    ✅ AI Response Ready
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-300 mb-3">
                    Your suggestion has been applied to the preview.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-xs"
                    onClick={handleAiEdit}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Regenerate
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={7}
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder='e.g., "Make this more formal"'
                    className="w-full border border-border/70 rounded-lg bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition shadow-sm"
                    disabled={isPending}
                  />
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs font-medium shadow-md"
                    onClick={handleAiEdit}
                    disabled={isPending || !promptValue}
                  >
                    {isPending ? (
                      <TextShimmerWave duration={1.2}>
                        Generating...
                      </TextShimmerWave>
                    ) : (
                      "Ask AI"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EditPlaceholder />
          )}
        </TabsContent>

        {/* --- Replace Tab --- */}
        <TabsContent value="replace" className="mt-3 space-y-2">
          {selectedText ? (
            <>
              <textarea
                rows={14}
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder="Type replacement text..."
                className="w-full border border-border/70 rounded-lg bg-background p-3 text-sm resize-none"
              />
              <Button
                size="sm"
                className="w-full h-8 text-xs font-medium shadow-md"
                onClick={() => handleReplace(promptValue)}
                disabled={!promptValue || promptValue === selectedText}
              >
                Replace Text
              </Button>
            </>
          ) : (
            <EditPlaceholder />
          )}
        </TabsContent>
      </Tabs>

      {/* --- Modal --- */}
      <AlertDialog open={limitModalOpen} onOpenChange={setLimitModalOpen}>
        <AlertDialogContent className="w-[92%] sm:w-[480px] rounded-2xl">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-center">
              Daily Token Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You need more credits to use AI tools.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Link href="/pricing" className="w-full sm:w-auto">
              <AlertDialogAction className="w-full">
                View Pricing
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
