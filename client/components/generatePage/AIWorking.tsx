'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Eye,
    EyeOff,
    Sparkles,
    CheckCircle,
    AlertCircle,
    Loader2,
    FileText,
    Clock
} from 'lucide-react'

interface AIWorkingProps {
    prompt: string
    fileName: string
    status?: 'working' | 'success' | 'error'
    progress?: number
}

const AIWorking: React.FC<AIWorkingProps> = ({
    prompt,
    fileName,
    status = 'working',
    progress = 0
}) => {
    const [showPrompt, setShowPrompt] = useState(false)

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-primary" />
            case 'error':
                return <AlertCircle className="w-6 h-6 text-destructive" />
            default:
                return <Loader2 className="w-6 h-6 text-primary animate-spin" />
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 'success':
                return 'PDF Generated Successfully!'
            case 'error':
                return 'Generation Failed'
            default:
                return 'AI is working on your PDF...'
        }
    }

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'text-primary'
            case 'error':
                return 'text-destructive'
            default:
                return 'text-primary'
        }
    }

    return (
        <div className="h-full flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-2xl mx-auto p-6"
            >
                <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
                    <CardContent className={`${showPrompt ? 'p-6' : 'p-8'}`}>
                        {/* Header */}
                        <div className={`text-center ${showPrompt ? 'mb-4' : 'mb-8'}`}>
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center justify-center mb-4"
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        {getStatusIcon()}
                                    </div>
                                    {status === 'working' && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-primary/30"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}
                                </div>
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`text-2xl font-bold ${getStatusColor()} mb-2`}
                            >
                                {getStatusText()}
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-muted-foreground"
                            >
                                {status === 'working'
                                    ? `Creating "${fileName}" with AI assistance...`
                                    : status === 'success'
                                        ? `"${fileName}" is ready for editing!`
                                        : `Failed to generate "${fileName}"`
                                }
                            </motion.p>
                        </div>

                        {/* Progress Bar (only when working) */}
                        {status === 'working' && !showPrompt && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mb-8"
                            >
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                    <span>Progress</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <motion.div
                                        className="bg-primary h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Working Steps */}
                        {status === 'working' && !showPrompt && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-4 mb-8"
                            >
                                <div className="flex items-center gap-3 text-sm">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-2 h-2 rounded-full bg-primary"
                                    />
                                    <span>Analyzing your prompt...</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-muted" />
                                    <span>Generating content structure...</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-muted" />
                                    <span>Applying formatting and styling...</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-muted" />
                                    <span>Finalizing your PDF...</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Prompt Visibility Toggle */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mb-6"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPrompt(!showPrompt)}
                                className="w-full"
                            >
                                {showPrompt ? (
                                    <>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Hide Prompt
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Prompt
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        {/* Prompt Display */}
                        <AnimatePresence>
                            {showPrompt && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-6"
                                >
                                    <Card className="bg-muted/30 border-border">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-medium">Your Prompt</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-24 overflow-y-auto">
                                                {prompt}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-3"
                        >
                            {status === 'success' && (
                                <Button
                                    className="flex-1"
                                    onClick={() => window.location.reload()}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Another
                                </Button>
                            )}

                            {status === 'error' && (
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="flex-1"
                                >
                                    Try Again
                                </Button>
                            )}
                        </motion.div>

                        {/* Footer Info */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className={`${showPrompt ? 'mt-4' : 'mt-6'} text-center`}
                        >
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>
                                    {status === 'working'
                                        ? 'This usually takes 10-30 seconds'
                                        : status === 'success'
                                            ? 'Ready to edit and customize'
                                            : 'Please try again or contact support'
                                    }
                                </span>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default AIWorking
