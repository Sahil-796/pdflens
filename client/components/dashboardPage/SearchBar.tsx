'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useSidebar } from '../ui/sidebar'
import { useCommandPalette } from '@/hooks/useCommandPalette'

export default function SearchBar() {
    const { state } = useSidebar()
    const { setOpen } = useCommandPalette()

    return (
        <div className="p-2">
            {state === 'collapsed' ? (
                <div
                    className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors"
                    onClick={() => setOpen(true)}
                >
                    <Search className="size-4 text-sidebar-foreground" />
                </div>
            ) : (
                <div className="relative">
                    <Input
                        type="text"
                        placeholder={`Search or press ⌘K`}
                        onClick={() => {
                            setOpen(true)
                        }}
                        readOnly
                        className="w-full h-8 rounded-md border-sidebar-border bg-sidebar text-sidebar-foreground placeholder:text-sidebar-foreground/60 pr-16 focus:ring-2 focus:ring-sidebar-ring transition-all duration-200 cursor-pointer"
                    />
                </div>
            )}
        </div>
    )
}