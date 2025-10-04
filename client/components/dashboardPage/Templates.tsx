"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Plus, FileText, Briefcase, Mail, BookOpen, FileCheck, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Templates = () => {
    const templates = [
        {
            name: "Resume",
            description: "Professional resume template",
            icon: FileText,
        },
        {
            name: "Business Proposal",
            description: "Comprehensive business proposal",
            icon: Briefcase,
        },
        {
            name: "Cover Letter",
            description: "Professional cover letter",
            icon: Mail,
        },
        {
            name: "Research Paper",
            description: "Academic research document",
            icon: BookOpen,
        },
        {
            name: "Agreement",
            description: "Legal agreement template",
            icon: FileCheck,
        },
        {
            name: "Report",
            description: "Business report template",
            icon: BarChart3,
        },
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
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Templates</h2>
                    <p className="text-sm text-muted-foreground mt-1">Choose a template to get started</p>
                </div>
                <Link href="/generate">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="group bg-primary text-primary-foreground rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-primary/90 transition-all">
                            <Plus className='w-4 h-4' />
                            <span>Create New</span>
                        </Button>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {templates.map((template, idx) => {
                        const IconComponent = template.icon
                        return (
                            <motion.div
                                key={template.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3, ease: "easeOut" }}
                                whileHover={{ y: -2 }}
                            >
                                <Link
                                    href={`/generate?template=${encodeURIComponent(template.name)}`}
                                    className="block"
                                >
                                    <Card className="group h-24 border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer">
                                        <CardContent className="p-4 h-full flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors`}>
                                                <IconComponent className={`w-5 h-5 text-primary`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm text-foreground truncate">
                                                    {template.name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Templates