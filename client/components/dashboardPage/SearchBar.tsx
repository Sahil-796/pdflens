'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

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
                console.error('Error fetching PDFs:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPdfs()
    }, [])

    // Close dropdown on outside click
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

    // Keyboard shortcuts
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

    const filteredPdfs = query
        ? pdfs.filter((pdf) =>
            pdf.fileName.toLowerCase().includes(query.toLowerCase())
        )
        : pdfs

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full">
                <div className="relative w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Loading PDFs..."
                        disabled
                        className="w-full rounded-xl border-border text-muted-foreground bg-card shadow-sm cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center relative" ref={containerRef}>
            {/* Screen Blur Overlay */}
            {showList && (
                <div 
                className="fixed inset-0 bg-background/60 backdrop-blur-xs z-10" 
                onClick={()=> {
                    setShowList(false)
                    inputRef.current?.blur()
                }}
                />
            )}

            {/* Search Bar */}
            <div className="relative z-20 w-full max-w-md">
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowList(true)}
                    placeholder="Search PDFs"
                    className="w-full rounded-xl border border-border bg-card shadow-md pr-20 text-primary"
                />
                {/* Shortcut Badge */}
                <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
                    ⌘ K
                </span>
            </div>

            {/* Dropdown Results */}
            {showList && (
                <div className="absolute z-30 mt-14 w-full max-w-md overflow-auto rounded-xl border border-border bg-card p-2 shadow-xl max-h-64">
                    {filteredPdfs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No PDFs found.</p>
                    ) : (
                        filteredPdfs.map((pdf) => (
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