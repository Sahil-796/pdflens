'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfStore } from '@/app/store/usePdfStore'
import { useUserStore } from '@/app/store/useUserStore'
import { Button } from '@/components/ui/button'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import { Wand2, RotateCcw, Coins } from 'lucide-react'
import Link from 'next/link'
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
import { useEditPdfStore } from '@/app/store/useEditPdfStore'
import { Badge } from '../ui/badge'

const EditPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-32 text-center rounded-lg border border-dashed border-border bg-muted/20 backdrop-blur-sm">
    <Wand2 className="w-6 h-6 mb-2 text-muted-foreground" />
    <p className="text-sm font-medium text-muted-foreground">Select text to edit</p>
    <p className="text-xs text-muted-foreground/60">Click on any text in the document</p>
  </div>
)

const SelectedTextView = ({ text }) => (
  <div className="text-sm text-muted-foreground border border-border/70 rounded-lg p-3 bg-card/60 backdrop-blur-sm shadow-inner">
    <p className="font-medium mb-1 text-foreground/80">Selected Text</p>
    <p className="italic text-xs leading-relaxed max-h-20 overflow-y-auto text-muted-foreground">
      {text}
    </p>
  </div>
)

interface EditPDFProps {
  onSidebarToggle?: () => void
}

const EditPDF = ({ onSidebarToggle }: EditPDFProps) => {
  const { pdfId } = usePdfStore()

  const {
    promptValue,
    status,
    selectedText,
    selectedId,
    originalHtml,
    renderedHtml,
    setPromptValue,
    setRenderedHtml,
    setAiResponse,
    setShowAiResponse,
    setStatus
  } = useEditPdfStore()

  const { setUser, creditsLeft } = useUserStore()

  const [activeTab, setActiveTab] = useState<'ai-edit' | 'replace'>('ai-edit')
  const [limitModalOpen, setLimitModalOpen] = useState(false)

  useEffect(() => {
    if (!selectedText) return
    setPromptValue(activeTab === 'replace' ? selectedText : "")
  }, [selectedText, activeTab, setPromptValue])

  const applyChanges = useCallback((newContent: string) => {
    if (!selectedId || !renderedHtml) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(renderedHtml, "text/html")
    const el = doc.getElementById(selectedId)
    if (el) {
      // Preserve line breaks and multiple spaces
      const formatted = newContent
        .replace(/\n/g, "<br>")
        .replace(/ {2}/g, "&nbsp;&nbsp;")
      el.innerHTML = formatted
    }
    setRenderedHtml(doc.documentElement.outerHTML)
    setPromptValue("")
    setStatus('prompt')
  }, [selectedId, renderedHtml, setRenderedHtml, setPromptValue, setStatus])

  const handleAiEdit = async () => {
    if (creditsLeft === 0) {
      setLimitModalOpen(true)
      return
    }
    if (!promptValue) return

    try {
      setStatus('loading')
      const res = await fetch('/api/editHTML', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: promptValue,
          html: originalHtml,
          pdfId,
          isContext: false,
        }),
      })
      if (!res.ok) throw new Error('API failed')
      const data = await res.json()
      setUser({ creditsLeft: data.creditsLeft })
      setAiResponse(data.data)
      setShowAiResponse(true)
      setStatus('aiResult')
    } catch (err) {
      console.error(err)
      setStatus('prompt')
    }
  }

  const handleRegenerate = () => {
    setStatus('loading')
    handleAiEdit()
  }

  const handleReplace = () => {
    applyChanges(promptValue)
    // Close sidebar on mobile after replace
    onSidebarToggle?.()
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-wide flex items-center gap-1.5">
          Tools
        </h2>
        <Badge variant='secondary'>
          <Coins className='h-4 w-4' />{creditsLeft} credits left
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'ai-edit' | 'replace')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-8 rounded-md bg-muted/40 border border-border/50">
          <TabsTrigger
            value="ai-edit"
            className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            AI Edit
          </TabsTrigger>
          <TabsTrigger
            value="replace"
            className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Replace
          </TabsTrigger>
        </TabsList>

        {/* --- AI Edit --- */}
        <TabsContent value="ai-edit" className="mt-3 space-y-3">
          {selectedText ? (
            <>
              <SelectedTextView text={selectedText} />

              {status === 'aiResult' ? (
                <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border border-green-300 dark:border-green-800 rounded-lg shadow-sm">
                  <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                    ✅ AI Response Ready
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-300 mb-3">
                    Your suggestion has been applied to the preview. Review it and confirm.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-xs"
                    onClick={handleRegenerate}
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
                    placeholder='e.g., "Make this more formal and concise"'
                    className="w-full border border-border/70 rounded-lg bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition shadow-sm"
                    disabled={status === 'loading'}
                  />
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs font-medium shadow-md"
                    onClick={handleAiEdit}
                    disabled={status === 'loading' || !promptValue}
                  >
                    {status === 'loading' ? (
                      <TextShimmerWave duration={1.2}>Generating...</TextShimmerWave>
                    ) :
                      'Ask AI'
                    }
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EditPlaceholder />
          )}
        </TabsContent>

        {/* --- Replace --- */}
        <TabsContent value="replace" className="mt-3 space-y-2">
          {selectedText ? (
            <>
              <textarea
                rows={10}
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder="Type the replacement text here..."
                className="w-full border border-border/70 rounded-lg bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition shadow-sm"
              />
              <Button
                size="sm"
                className="w-full h-8 text-xs font-medium shadow-md"
                onClick={handleReplace}
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

      {/* --- Credit Limit Modal --- */}
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

export default EditPDF
