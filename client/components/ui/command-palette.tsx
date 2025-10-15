'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  User,
  Home,
  BarChart3,
  BookOpen,
  Briefcase,
  Mail,
  FileCheck,
  Loader2,
  LogOut,
  PlaneLanding,
  Plus,
  Pen,
  Sun,
  Moon,
} from 'lucide-react'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { authClient } from '@/lib/auth-client'
import { useUserStore } from '@/app/store/useUserStore'
import useUser from '@/hooks/useUser'
import { usePdfStore } from '@/app/store/usePdfStore'
import { useTheme } from 'next-themes'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onOpenChange }) => {
  const { open, setOpen } = useCommandPalette()
  const [query, setQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { clearUser } = useUserStore()
  const { user } = useUser()
  const { pdfs, loading } = usePdfStore();

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is authenticated first
      if (!user.id) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(true)
      } else if (e.key === 'Escape' && open) {
        e.preventDefault()
        onOpenChange(false)
        setQuery('')
      }
    }

    // Add listener immediately after authentication
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange, setOpen, user.id]) // Add dependencies

  // 🔗 Handle route logic
  const handleSelect = (value: string) => {
    if (value.startsWith('pdf-')) {
      const pdfName = value.replace('pdf-', '')
      const pdf = pdfs.find((p) => p.fileName === pdfName)
      if (pdf) router.push(`/edit/${pdf.id}`)
    } else if (value.startsWith('template-')) {
      const template = value.replace('template-', '')
      router.push(`/generate?template=${template}`)
    } else if (value === '/generate' || value === '/edit' || value === '/dashboard') {
      router.push(value)
    } else {
      router.push(value)
    }

    onOpenChange(false)
    setQuery('')
  }

  // Template definitions with keywords
  const templates = [
    {
      name: 'Resume',
      value: 'Resume',
      icon: FileText,
      keywords: ['cv', 'curriculum vitae', 'job', 'career', 'employment']
    },
    {
      name: 'Business Proposal',
      value: 'Business-Proposal',
      icon: Briefcase,
      keywords: ['pitch', 'business plan', 'project', 'client', 'proposal']
    },
    {
      name: 'Cover Letter',
      value: 'Cover-Letter',
      icon: Mail,
      keywords: ['job application', 'introduction', 'hiring', 'employment']
    },
    {
      name: 'Research Paper',
      value: 'Research-Paper',
      icon: BookOpen,
      keywords: ['academic', 'study', 'thesis', 'paper', 'research']
    },
    {
      name: 'Agreement',
      value: 'Agreement',
      icon: FileCheck,
      keywords: ['contract', 'legal', 'terms', 'conditions', 'document']
    },
    {
      name: 'Report',
      value: 'Report',
      icon: BarChart3,
      keywords: ['analysis', 'summary', 'findings', 'statistics', 'data']
    },
  ]

  const navigationItems = [
    {
      name: 'Dashboard',
      value: '/dashboard',
      icon: Home,
      keywords: ['home', 'main', 'overview', 'start']
    },
    {
      name: 'Generate PDF',
      value: '/generate',
      icon: Plus,
      keywords: ['create', 'new', 'make', 'generate']
    },
    {
      name: 'Edit PDF',
      value: '/edit',
      icon: Pen,
      keywords: ['modify', 'change', 'update', 'edit']
    },
    {
      name: 'Account',
      value: '/account',
      icon: User,
      keywords: ['profile', 'settings', 'user', 'personal']
    },
    {
      name: 'Landing Page',
      value: '/',
      icon: PlaneLanding,
      keywords: ['home', 'welcome', 'start', 'landing']
    },
  ]

  // 🔍 Filter PDFs by name (case-insensitive)
  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.fileName.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 backdrop-blur-sm"
          onClick={() => {
            onOpenChange(false)
            setQuery('')
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xs md:max-w-2xl mt-32 rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="rounded-xl px-2">
              {/* Input section */}
              <div className="flex items-center border-b border-muted px-4 py-3">
                <Search className="size-5 text-muted-foreground mr-2" />
                <Command.Input
                  placeholder="What do you need?"
                  value={query}
                  onValueChange={setQuery}
                  className="h-10 w-full rounded-md bg-transparent text-md outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button>
                  <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    esc
                  </kbd>
                </button>
              </div>

              {/* List */}
              <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden py-4">
                <Command.Empty className="py-2 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                {/* Navigation */}
                <Command.Group className="mb-4">
                  <div className="px-2 pb-2 text-xs font-medium text-muted-foreground tracking-wide">
                    Navigation
                  </div>
                  {navigationItems.map((item) => (
                    <Command.Item
                      key={item.value}
                      value={item.value}
                      keywords={item.keywords}
                      onSelect={() => handleSelect(item.value)}
                      className="flex h-10 items-center rounded-md px-4 text-sm cursor-pointer hover:bg-accent hover:text-primary aria-selected:bg-accent aria-selected:text-primary transition-colors"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* PDFs */}
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                    <Loader2 className='animate-spin' />
                    Loading PDFs
                  </div>
                ) : filteredPdfs.length > 0 && (
                  <Command.Group className="mb-4">
                    <div className="px-2 pb-2 text-xs font-medium text-muted-foreground tracking-wide">
                      Your PDFs
                    </div>
                    {filteredPdfs.slice(0, 10).map((pdf) => (
                      <Command.Item
                        key={pdf.id}
                        value={`pdf-${pdf.fileName}`}
                        onSelect={() => handleSelect(`pdf-${pdf.fileName}`)}
                        className="flex h-10 items-center justify-between rounded-md px-4 text-sm cursor-pointer hover:bg-accent hover:text-primary aria-selected:bg-accent aria-selected:text-primary transition-colors"
                      >
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <div className="truncate font-medium">{pdf.fileName}</div>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Templates */}
                <Command.Group className="mb-4">
                  <div className="px-2 pb-2 text-xs font-medium text-muted-foreground tracking-wide">
                    Templates
                  </div>
                  {templates.map((template) => (
                    <Command.Item
                      key={template.value}
                      value={`template-${template.value}`}
                      keywords={template.keywords}
                      onSelect={() => handleSelect(`template-${template.value}`)}
                      className="flex h-10 items-center rounded-md px-4 text-sm cursor-pointer hover:bg-accent hover:text-primary aria-selected:bg-accent aria-selected:text-primary transition-colors"
                    >
                      <template.icon className="mr-2 h-4 w-4" />
                      <span>{template.name}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Actions Group */}
                <Command.Group>
                  <Command.Item
                    key='theme'
                    onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
                    keywords={['theme', 'light', 'dark', 'system']}
                    className="flex h-10 items-center rounded-md px-4 text-sm cursor-pointer hover:bg-accent hover:text-primary aria-selected:bg-accent aria-selected:text-primary transition-colors"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    <span>Toggle Theme</span>
                  </Command.Item>
                  <Command.Item
                    key='signout'
                    onSelect={async () => {
                      setOpen(false)
                      await authClient.signOut()
                      clearUser()
                      router.push('/')
                    }}
                    keywords={['sign out', 'log out', 'exit', 'leave']}
                    className="flex h-10 items-center rounded-md px-4 text-sm cursor-pointer hover:bg-accent hover:text-primary aria-selected:bg-accent aria-selected:text-primary transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette