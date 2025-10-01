'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Pdf {
    id: string
    fileName: string
    createdAt: string | null
    url: string
}

export default function SearchBar() {
    const [query, setQuery] = useState('')
    const [pdfs, setPdfs] = useState<Pdf[]>([])
    const [loading, setLoading] = useState(true)
    const [showList, setShowList] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])

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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setShowList(true)
                setTimeout(() => inputRef.current?.focus(), 50)
            } else if (e.key === 'Escape') {
                setQuery('')
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

    useEffect(() => setSelectedIndex(0), [filteredPdfs, showList])

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            })
        }
    }, [selectedIndex])

    if (loading)
        return (
            <div className="flex items-center justify-center w-7/8 mx-auto mt-2">
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

    return (
        <>
            {/* Sidebar Search Input */}
            <div className="relative w-7/8 mx-auto mt-2">
                <motion.div whileFocus={{ scale: 1.02, boxShadow: '0px 5px 15px rgba(0,0,0,0.1)' }}>
                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowList(true)}
                        placeholder="Search PDFs"
                        className="w-full rounded-xl border border-border bg-card shadow-md pr-20 text-primary transition-all duration-200"
                    />
                </motion.div>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
                    ⌘ K
                </span>
            </div>

            {/* Modal Search */}
            <AnimatePresence>
                {showList && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 backdrop-blur-sm"
                        onClick={() => {
                            setShowList(false)
                            setQuery('')
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-lg mt-32 rounded-xl border border-border bg-card shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Search Input */}
                            <div className="relative p-4 border-b border-border shrink-0">
                                <Input
                                    autoFocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search PDFs"
                                    onKeyDown={(e) => {
                                        if (!filteredPdfs.length) return
                                        if (e.key === 'ArrowDown') {
                                            e.preventDefault()
                                            setSelectedIndex((prev) =>
                                                prev < filteredPdfs.length - 1 ? prev + 1 : prev
                                            )
                                        } else if (e.key === 'ArrowUp') {
                                            e.preventDefault()
                                            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
                                        } else if (e.key === 'Enter') {
                                            e.preventDefault()
                                            const selectedPdf = filteredPdfs[selectedIndex]
                                            if (selectedPdf) {
                                                setShowList(false)
                                                setQuery('')
                                                router.push(`/edit/${selectedPdf.id}`)
                                            }
                                        }
                                    }}
                                    className="w-full rounded-xl border border-border bg-card pr-10 text-primary"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    onClick={() => {
                                        setShowList(false)
                                        setQuery('')
                                    }}
                                    className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary cursor-pointer"
                                >
                                    <X className="size-5" />
                                </motion.button>
                            </div>

                            {/* Results */}
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: { transition: { staggerChildren: 0.03 } },
                                }}
                                className="max-h-[28rem] overflow-auto p-2 space-y-1"
                            >
                                {filteredPdfs.length === 0 ? (
                                    <p className="text-sm text-muted-foreground px-2">
                                        No PDFs found.
                                    </p>
                                ) : (
                                    filteredPdfs.map((pdf, idx) => (
                                        <motion.div
                                            key={pdf.id}
                                            ref={(el) => { itemRefs.current[idx] = el }}
                                            tabIndex={0}
                                            role="option"
                                            aria-selected={idx === selectedIndex}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ scale: 1.02, boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}
                                            transition={{ duration: 0.15 }}
                                            className={`cursor-pointer rounded-md p-2 transition-colors ${idx === selectedIndex
                                                ? 'bg-muted text-primary'
                                                : 'hover:bg-muted'
                                                }`}
                                            onClick={() => {
                                                setShowList(false)
                                                setQuery('')
                                                router.push(`/edit/${pdf.id}`)
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setShowList(false)
                                                    setQuery('')
                                                    router.push(`/edit/${pdf.id}`)
                                                }
                                            }}
                                        >
                                            <p className="font-medium">{pdf.fileName}</p>
                                            {pdf.createdAt && (
                                                <p className="text-xs text-muted-foreground">
                                                    Created: {new Date(pdf.createdAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}