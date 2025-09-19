'use client'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { usePdfStore } from '@/app/store/usePdfStore'

interface GenerateSectionProps {
    input: string
    setInput: (v: string) => void
    files: File[]
    setFiles: (v: File[]) => void
    handleSend: () => void
    loading: boolean
}

const GenerateSection: React.FC<GenerateSectionProps> = ({
    input,
    setInput,
    files,
    setFiles,
    handleSend,
    loading,
}) => {
    const { fileName, setPdf } = usePdfStore()

    return (
        <AnimatePresence mode='wait'>
            <div className={`w-full bg-card p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-border relative overflow-hidden`}>
                <h2 className="text-xl font-semibold">
                    Generate PDF
                </h2>
                <motion.div
                    key="initial"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setPdf({ fileName: e.target.value || "Untitled" })}
                        placeholder="Enter filename"
                        className="bg-muted border border-border rounded-md p-2 w-full 
             focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <textarea
                        id="inputMessage"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your text here..."
                        className="bg-muted border border-border rounded-md p-3 w-full h-40 resize-none 
                         focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
                    />

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate'}
                    </button>

                    <div>
                        <label className="block font-medium mb-2">Upload Files</label>
                        <input
                            type="file"
                            multiple
                            className="block w-full text-sm text-muted-foreground
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-muted file:text-foreground
                             hover:file:bg-accent
                             cursor-pointer"
                        />
                        {files.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                                {files.map((file, idx) => (
                                    <li key={idx} className="truncate">
                                        📄 {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default GenerateSection