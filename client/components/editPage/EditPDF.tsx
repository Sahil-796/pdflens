'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfStore } from '@/app/store/usePdfStore'
import { Button } from '@/components/ui/button'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'

const EditPDF = () => {
    const { selectedText, selectedId, originalHtml, renderedHtml, setRenderedHtml, pdfId } = usePdfStore()

    const [promptValue, setPromptValue] = useState("")
    const [status, setStatus] = useState('prompt')

    useEffect(() => {
        setPromptValue('')
        setStatus('prompt')
    }, [selectedText])

    const handleAiEdit = async () => {
        if (status === 'prompt') {
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
                setPromptValue(`${data}`)
                setStatus('aiResult')
            } catch (err) {
                console.error(err)
                setStatus('prompt')
            }
        } else if (status === 'aiResult') {
            // Apply edited HTML
            const parser = new DOMParser()
            const doc = parser.parseFromString(renderedHtml, "text/html")
            const el = doc.getElementById(selectedId)
            if (el) el.innerHTML = promptValue
            setRenderedHtml(doc.documentElement.outerHTML)
            setStatus('prompt')
            setPromptValue('')
        }
    }

    const handleReplace = async () => {
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(renderedHtml, "text/html")
            const el = doc.getElementById(selectedId)
            if (el) el.innerHTML = promptValue
            setRenderedHtml(doc.documentElement.outerHTML)
            setStatus('prompt')
            setPromptValue('')
        } catch (err) {
            console.error(err)
        }
    }

return (
    <div className='flex-1 overflow-y-scroll'>
        <Tabs defaultValue="ai-edit" className="w-full">
            <TabsList>
                <TabsTrigger className='text-lg font-medium' value="ai-edit">AI Edit</TabsTrigger>
                <TabsTrigger className='text-lg font-medium' value="replace">Replace Text</TabsTrigger>
            </TabsList>

            <TabsContent value="ai-edit">
                {selectedText ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                            {selectedText}
                        </div>
                        <textarea
                            rows={6}
                            value={promptValue}
                            onChange={(e) => setPromptValue(e.target.value)}
                            placeholder="Edit text..."
                            className="w-full h-full border rounded-md p-2 text-sm resize-none"
                            disabled={status === 'loading'}
                        />
                        <Button
                            className="mt-4 w-full col-span-2"
                            onClick={handleAiEdit}
                        >
                            {status === 'prompt' ? 'Ask AI' : status === 'loading' ? <TextShimmerWave duration={1}>Editing</TextShimmerWave> : 'Apply'}
                        </Button>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Click a div in the PDF to edit.</p>
                )}
            </TabsContent>

            <TabsContent value="replace">
                {selectedText ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                            {selectedText}
                        </div>
                        <textarea
                            rows={6}
                            value={promptValue}
                            onChange={(e) => setPromptValue(e.target.value)}
                            placeholder="Edit text..."
                            className="w-full h-full border rounded-md p-2 text-sm resize-none"
                            disabled={status === 'loading'}
                        />
                        <Button
                            className="mt-4 w-full col-span-2"
                            onClick={handleReplace}
                        >
                            {status === 'loading' ? <TextShimmerWave duration={1}>Editing</TextShimmerWave> : 'Replace'}
                        </Button>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Click a div in the PDF to edit.</p>
                )}
            </TabsContent>
        </Tabs>
    </div>
)
}

export default EditPDF