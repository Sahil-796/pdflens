'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Plus,
  RotateCcw,
  File,
  ArrowDownLeft,
  Layers
} from 'lucide-react'
import LumaSpin from '../21st/LumaSpin'
import Link from 'next/link'

interface AIWorkingProps {
  prompt: string
  fileName: string
  status?: 'working' | 'success' | 'error'
}

const AIWorking: React.FC<AIWorkingProps> = ({
  prompt,
  fileName,
  status = 'working',
}) => {
  const [showPrompt, setShowPrompt] = useState(false)

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-primary" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-destructive" />
      default:
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'PDF Generated Successfully!'
      case 'error':
        return 'Generation Failed'
      default:
        return `Zendra is creating "${fileName}"...`
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
        <Card className="border-2 border-secondary rounded-lg bg-card/50 backdrop-blur-sm">
          <CardContent className='p-8'>
            {/* Header */}
            <div className={`text-center mb-4`}>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center mb-4"
              >
                {status !== 'working' &&
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {getStatusIcon()}
                    </div>
                  </div>
                }
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
                  ? `It won't take long! while you wait, check out our other tools. we'll let you know when it's ready.`
                  : status === 'success'
                    ? `"${fileName}" is ready! Dive in and start editing right away or make a new one.`
                    : `Oops! "${fileName}" couldn’t be generated. Try again or tweak your input.`
                }
              </motion.p>
            </div>
            {
              status === 'working' &&
              <div className='flex items-center justify-center'>
                <LumaSpin />
              </div>
            }

            {/* Prompt Visibility Toggle */}
            {
              status !== 'success' &&
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="my-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="w-full"
                >
                  {showPrompt ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Prompt
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      View Prompt
                    </>
                  )}
                </Button>
              </motion.div>
            }

            {/* Prompt Display */}
            <AnimatePresence>
              {showPrompt && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
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


            {
              status === "working" && (
                <div>
                  <div className='text-center text-muted-foreground'>It won't take long! while you wait, check out our other tools. we'll let you know when it's ready.</div>
                  <div className='flex items-center gap-4 mt-4'>
                    <Link href={'/pdf-to-word'} className='hover:scale-103 flex gap-2 items-center text-blue-600 dark:text-blue-400 bg-background px-4 py-2 rounded-lg border border-border'>
                      <File className='h-6 w-6' />
                      <span className='text-lg font-semibold'>PDF to Word</span>
                    </Link>
                    <Link href={'/compress-pdf'} className='hover:scale-103 flex gap-2 items-center text-red-600 dark:text-red-400 bg-background px-4 py-2 rounded-lg border border-border'>
                      <ArrowDownLeft className='h-6 w-6' />
                      <span className='text-lg font-semibold'>Compress PDF</span>
                    </Link>
                    <Link href='/merge-pdf' className='hover:scale-104 flex gap-2 items-center text-purple-600 dark:text-purple-400 bg-background px-4 py-2 rounded-lg border border-border'>
                      <Layers className='h-6 w-6' />
                      <span className='text-lg font-semibold'>Merge PDF</span>
                    </Link>
                  </div>
                </div>
              )
            }


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
                  <Plus className="w-4 h-4" />
                  Generate Another
                </Button>
              )}

              {status === 'error' && (
                <Button
                  variant="default"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  <RotateCcw /> Try Again
                </Button>
              )}
            </motion.div>

            {/* Footer Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`mt-4 text-center`}
            >
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {status === 'working'
                    ? 'Your PDF will be ready shortly'
                    : status === 'success'
                      ? 'Ready to edit'
                      : 'Please try again or check your credits'
                  }
                </span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div >
  )
}

export default AIWorking
