"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Templates = () => {
    const templates = [
        "Resume",
        "Business-Proposal",
        "Cover-Letter",
        "Research-Paper",
        "Agreement",
        "Report",
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <h2 className="text-lg font-semibold text-primary">Templates</h2>
                <Link href="/generate">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
                        <Button className="group bg-primary text-primary-foreground rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            <Plus className='w-4 h-4 group-hover:scale-125 transition-transform duration-150' />
                            <span>Create New PDF</span>
                        </Button>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Template Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence>
                    {templates.map((template, idx) => (
                        <motion.div
                            key={template}
                            initial={{ opacity: 0, y: 5, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.97 }}
                            transition={{ delay: idx * 0.03, duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link
                                href={`/generate?template=${encodeURIComponent(template)}`}
                                className="block"
                            >
                                <Card className="h-14 flex items-center justify-center rounded-lg border border-border bg-card text-primary text-center font-medium cursor-pointer hover:bg-muted hover:text-primary transition overflow-hidden text-ellipsis">
                                    {template}
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Templates