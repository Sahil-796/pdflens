'use client'

import { create } from 'zustand'

interface CommandPaletteStore {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const useCommandPalette = create<CommandPaletteStore>((set, get) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set({ open: !get().open }),
}))