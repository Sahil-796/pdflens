'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfStore } from '@/app/store/usePdfStore'
import { Button } from '@/components/ui/button'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import { Wand2, Check, X, RotateCcw } from 'lucide-react'

const EditPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-32 text-center">
        <Wand2 className="w-6 h-6 mb-2 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">Select text to edit</p>
        <p className="text-xs text-muted-foreground/60">Click on any text in the document</p>
    </div>
)

const SelectedTextView = ({ text }) => (
    <div className="text-sm text-muted-foreground border rounded p-3 bg-muted/30">
        <p className="font-medium mb-2 text-sm">Selected Text:</p>
        <p className="italic text-xs leading-relaxed max-h-20 overflow-y-auto">{text}</p>
    </div>
)


const EditPDF = () => {
    const { 
        selectedText, 
        selectedId, 
        originalHtml, 
        renderedHtml, 
        setRenderedHtml, 
        pdfId,
        aiResponse,
        setAiResponse,
        showAiResponse,
        setShowAiResponse
    } = usePdfStore()

    const [promptValue, setPromptValue] = useState("")
    const [status, setStatus] = useState<'prompt' | 'loading' | 'aiResult'>('prompt')
    const [activeTab, setActiveTab] = useState<'ai-edit' | 'replace'>('ai-edit')

    // reset promptValue depending on tab + selectedText
    useEffect(() => {
        if (!selectedText) return

        if (activeTab === 'replace') {
            setPromptValue(selectedText)   // show selected text
        } else {
            setPromptValue("")             // empty for AI edit
        }
        setStatus('prompt')
    }, [selectedText, activeTab])

    const applyChanges = useCallback((newContent: string) => {
        if (!selectedId || !renderedHtml) return
        const parser = new DOMParser()
        const doc = parser.parseFromString(renderedHtml, "text/html")
        const el = doc.getElementById(selectedId)
        if (el) el.innerHTML = newContent
        setRenderedHtml(doc.documentElement.outerHTML)
        setPromptValue("")
        setStatus('prompt')
    }, [selectedId, renderedHtml, setRenderedHtml])

    const handleAiEdit = async () => {
        if (status === 'prompt') {
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
                const response = data.editedText || data
                setAiResponse(response)
                setShowAiResponse(true)
                setStatus('aiResult')
            } catch (err) {
                console.error(err)
                setStatus('prompt')
            }
        }
    }

    const handleAccept = () => {
        applyChanges(aiResponse)
        setShowAiResponse(false)
    }

    const handleReject = () => {
        setStatus('prompt')
        setAiResponse("")
        setShowAiResponse(false)
    }

    const handleRegenerate = () => {
        setStatus('loading')
        handleAiEdit()
    }

    const handleReplace = () => {
        applyChanges(promptValue)
    }

    return (
        <div className='space-y-4'>
            <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as 'ai-edit' | 'replace')}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger value="ai-edit" className="text-xs">AI Edit</TabsTrigger>
                    <TabsTrigger value="replace" className="text-xs">Replace</TabsTrigger>
                </TabsList>

                {/* AI Edit Tab */}
                <TabsContent value="ai-edit" className="mt-3">
                    {selectedText ? (
                        <div className="space-y-3">
                            <SelectedTextView text={selectedText} />

                            {status === 'aiResult' ? (
                                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                                    <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">AI Response Generated</div>
                                    <div className="text-xs text-green-600 dark:text-green-300 mb-3">Check the PDF to see the suggestion and accept/reject it.</div>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="w-full h-7 text-xs" 
                                        onClick={handleRegenerate}
                                    >
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        Regenerate
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <textarea
                                        rows={8}
                                        value={promptValue}
                                        onChange={(e) => setPromptValue(e.target.value)}
                                        placeholder='e.g., "Make this sound more professional"'
                                        className="w-full border rounded p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition"
                                        disabled={status === 'loading'}
                                    />
                                    <Button 
                                        size="sm" 
                                        className="w-full h-7 text-xs" 
                                        onClick={handleAiEdit} 
                                        disabled={status === 'loading' || !promptValue}
                                    >
                                        {status === 'loading' ? (
                                            <TextShimmerWave duration={1.5}>Generating...</TextShimmerWave>
                                        ) : (
                                            'Ask AI'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <EditPlaceholder />
                    )}
                </TabsContent>

                {/* Replace Tab */}
                <TabsContent value="replace" className="mt-3">
                    {selectedText ? (
                        <div className="space-y-2">
                            <textarea
                                rows={10}
                                value={promptValue}
                                onChange={(e) => setPromptValue(e.target.value)}
                                placeholder="Enter the new text..."
                                className="w-full border rounded p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition"
                            />
                            <Button 
                                size="sm" 
                                className="w-full h-7 text-xs" 
                                onClick={handleReplace} 
                                disabled={!promptValue || promptValue === selectedText}
                            >
                                Replace Text
                            </Button>
                        </div>
                    ) : (
                        <EditPlaceholder />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditPDF