'use client'

import React, { useState } from 'react'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const PDFPreview = ({ loading, html, pdfId }: { loading: boolean, html: string, pdfId: string }) => {
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [promptValue, setPromptValue] = useState("")
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [originalContent, setOriginalContent] = useState("")
    const [originalHtml, setOriginalHtml] = useState("")
    const [status, setStatus] = useState('prompt')
    const [renderedHtml, setRenderedHtml] = useState(`${html}`)

    return (
        <div className="relative flex-1 bg-card rounded-xl p-6 overflow-auto">
            {loading ? (
                <TextShimmerWave duration={1} className="left-1/2 -translate-x-1/2">
                    Loading the PDF...
                </TextShimmerWave>
            ) : (
                <div
                    onClick={(e) => {
                        const target = e.target as HTMLElement
                        if (target.id) {
                            document.querySelectorAll(".selected").forEach(el => {
                                el.classList.remove("selected")
                            })
                            target.classList.add("selected")

                            setSelectedId(target.id)
                            setOriginalContent(target.innerText)
                            setOriginalHtml(target.innerHTML)
                            setPromptValue('')
                            setAnchorEl(target)
                            setOpen(true)
                        }
                    }}
                    className="mx-auto flex-1 w-full overflow-y-scroll rounded-md px-6 pb-6 bg-white text-black"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
            )}

            {anchorEl && (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        {/* Hidden trigger, positioning handled manually */}
                        <span
                            className="absolute"
                            style={{
                                top: anchorEl.offsetTop,
                                left: anchorEl.offsetLeft,
                            }}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left side: Original (readonly) */}
                            <div className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                                {originalContent}
                            </div>

                            {/* Right side: Prompt / AI result box */}
                            <textarea
                                value={promptValue}
                                onChange={(e) => setPromptValue(e.target.value)}
                                placeholder="Edit text..."
                                className="w-full h-full border rounded-md p-2 text-sm resize-none"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Button below */}
                        <Button
                            className="mt-4 w-full"
                            onClick={async () => {
                                if (status === 'prompt') {
                                    // Step 1: Send to AI
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
                                        setPromptValue(data) // display AI response
                                        setStatus('aiResult')
                                    } catch (err) {
                                        console.error(err)
                                        setStatus('prompt')
                                    }
                                } else if (status === 'aiResult' && selectedId) {
                                    // Step 2: Apply to actual content
                                    const parser = new DOMParser()
                                    const doc = parser.parseFromString(renderedHtml, "text/html")
                                    const el = doc.getElementById(selectedId)
                                    if (el) {
                                        el.innerHTML = promptValue
                                        setRenderedHtml(doc.documentElement.outerHTML)
                                    }
                                    setOpen(false)
                                    setStatus('prompt')
                                }
                            }}
                        >
                            {status === 'prompt' ? 'Edit' : status === 'loading' ? <TextShimmerWave duration={1}>Editing</TextShimmerWave> : 'Apply'}
                        </Button>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}

export default PDFPreview