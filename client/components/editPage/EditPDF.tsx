'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfStore } from '@/app/store/usePdfStore'
import { Button } from '@/components/ui/button'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import { Wand2 } from 'lucide-react'

// Placeholder when no text is selected
const EditPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/30 rounded-lg border-2 border-dashed">
        <Wand2 className="w-10 h-10 mb-2 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">Select an element to edit</p>
        <p className="text-sm text-muted-foreground/80">Click on any text block in the document to begin.</p>
    </div>
)

// Component to show selected text
const SelectedTextView = ({ text }) => (
    <div className="text-sm text-muted-foreground border rounded-md p-3 bg-muted/20 shadow-sm">
        <p className="font-medium mb-1">Selected Text:</p>
        <div className="p-2 rounded border bg-background max-h-32 overflow-y-auto">
            <p className="italic">"{text}"</p>
        </div>
    </div>
)

const EditPDF = () => {
    const { selectedText, selectedId, originalHtml, renderedHtml, setRenderedHtml, pdfId } = usePdfStore()

    const [promptValue, setPromptValue] = useState("")
    const [status, setStatus] = useState<'prompt' | 'loading' | 'aiResult'>('prompt')

    // Reset when selection changes
    useEffect(() => {
        setPromptValue(selectedText || "")
        setStatus('prompt')
    }, [selectedText])

    // Apply changes to the HTML
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

    // Handle AI edit
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
                setPromptValue(data.editedText || data) // handle API response
                setStatus('aiResult')
            } catch (err) {
                console.error(err)
                setStatus('prompt')
            }
        } else if (status === 'aiResult') {
            applyChanges(promptValue)
        }
    }

    // Handle manual replace
    const handleReplace = () => {
        applyChanges(promptValue)
    }

    return (
        <div className='flex-1 overflow-y-auto p-4 bg-background'>
            <Tabs defaultValue="ai-edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai-edit">AI Edit</TabsTrigger>
                    <TabsTrigger value="replace">Replace</TabsTrigger>
                </TabsList>

                {/* AI Edit Tab */}
                <TabsContent value="ai-edit" className="mt-4">
                    {selectedText ? (
                        <div className="space-y-4">
                            <SelectedTextView text={selectedText} />

                            {/* AI result card */}
                            {status === 'aiResult' ? (
                                <div className="p-4 border rounded-md">
                                    <p className="font-medium text-sm mb-2">AI Suggestion:</p>
                                    <div className="p-2 rounded border max-h-32 overflow-y-auto text-sm">{promptValue}</div>
                                    <div className="flex gap-2 mt-3">
                                        <Button className="w-full" onClick={() => applyChanges(promptValue)}>Apply</Button>
                                        <Button className="w-full" variant="outline" onClick={() => setStatus('prompt')}>Discard</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        rows={4}
                                        value={promptValue}
                                        onChange={(e) => setPromptValue(e.target.value)}
                                        placeholder='e.g., "Make this sound more professional"'
                                        className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
                                        disabled={status === 'loading'}
                                    />
                                    <Button onClick={handleAiEdit} disabled={status === 'loading' || !promptValue}>
                                        {status === 'loading' ? <TextShimmerWave duration={1.5}>Generating...</TextShimmerWave> : (status === 'prompt' ? 'Ask AI' : 'Apply')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <EditPlaceholder />
                    )}
                </TabsContent>

                {/* Replace Tab */}
                <TabsContent value="replace" className="mt-4">
                    {selectedText ? (
                        <div className="space-y-4">
                            <SelectedTextView text={selectedText} />
                            <div className="flex flex-col gap-2">
                                <textarea
                                    rows={4}
                                    value={promptValue}
                                    onChange={(e) => setPromptValue(e.target.value)}
                                    placeholder="Enter the new text..."
                                    className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
                                />
                                <Button onClick={handleReplace} disabled={!promptValue || promptValue === selectedText}>
                                    Replace Text
                                </Button>
                            </div>
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