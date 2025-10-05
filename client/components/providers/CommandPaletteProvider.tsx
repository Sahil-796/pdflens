'use client'

import React from 'react'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import CommandPalette from '../ui/command-palette'

interface CommandPaletteProviderProps {
  children: React.ReactNode
}

export const CommandPaletteProvider: React.FC<CommandPaletteProviderProps> = ({ children }) => {
  const { open, setOpen } = useCommandPalette()

  return (
    <>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  )
}
