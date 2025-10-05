'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { Command } from 'cmdk'

interface CommandTriggerProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
}

export const CommandTrigger: React.FC<CommandTriggerProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showText = true
}) => {
  const { setOpen } = useCommandPalette()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setOpen(true)}
      className={`gap-2 ${className}`}
    >
      <Search className="h-4 w-4" />
      {showText && (
        <>
          <span>Search</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs"><Command /></span>K
          </kbd>
        </>
      )}
    </Button>
  )
}

export default CommandTrigger
