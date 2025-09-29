'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Pdf {
    id: string
    fileName: string
    createdAt: string | null
    url: string
}

export default function PdfSearch() {
    const [query, setQuery] = useState('')
    const [pdfs, setPdfs] = useState<Pdf[]>([])
    const [loading, setLoading] = useState(true)
    const [showList, setShowList] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Fetch PDFs
    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/getAll`)
                const data: Pdf[] = await res.json()
                setPdfs(data)
            } catch (error) {
                console.error("Error fetching PDFs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPdfs()
    }, [])

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowList(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Keyboard shortcuts: Cmd+K / Ctrl+K to open, Esc to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                inputRef.current?.focus()
                setShowList(true)
            } else if (e.key === 'Escape') {
                setShowList(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Initial PDFs to show on focus

    // Filter PDFs based on query
    const filteredPdfs = query
        ? pdfs.filter(pdf =>
            pdf.fileName.toLowerCase().includes(query.toLowerCase())
        )
        : pdfs

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full py-8 text-neutral-400">
                Loading PDFs...
            </div>
        )
    }

    return (
        <div className="w-full relative" ref={containerRef}>
            {/* Search and Create New PDF on same row */}
            <div className="flex items-center gap-4 w-full">
                <div className="relative flex-1">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowList(true)}
                        placeholder="Search PDFs"
                        className="w-full border-border text-primary bg-card pr-20"
                    />
                    {/* Shortcut Badge */}
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
                        ⌘ K
                    </span>
                </div>

                <Link href="/generate">
                    <Button
                        variant="secondary"
                        className="bg-card text-primary border border-border whitespace-nowrap"
                    >
                        + Create New PDF
                    </Button>
                </Link>
            </div>

            {/* PDF Results Dropdown */}
            {showList && (
                <div className="absolute z-10 w-full max-h-64 overflow-auto rounded-md border border-border bg-card p-2 shadow-lg mt-1">
                    {filteredPdfs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No PDFs found.</p>
                    ) : (
                        filteredPdfs.map(pdf => (
                            <Link key={pdf.id} href={`/edit/${pdf.id}`}>
                                <div className="cursor-pointer rounded-md p-2 hover:bg-muted transition">
                                    <p className="font-medium">{pdf.fileName}</p>
                                    {pdf.createdAt && (
                                        <p className="text-xs text-muted-foreground">
                                            Created: {new Date(pdf.createdAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}