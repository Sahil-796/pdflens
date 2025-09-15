"use client"

import { useEffect, useState, createContext, useContext } from "react"
import { useTheme } from "next-themes"

const lightThemes = ["Vercel", "t3\ Chat", "Twitter"]
const darkThemes = ["Dark \Vercel", "t3\Dark", "X"]

type ThemeStyleContextType = {
    themeIndex: number
    setThemeIndex: (index: number) => void
    themes: string[]
}

const ThemeStyleContext = createContext<ThemeStyleContextType | null>(null)

export function ThemeStyleProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme()
    const [themeIndex, setThemeIndex] = useState<number>(0)

    // Load saved theme index
    useEffect(() => {
        const saved = localStorage.getItem("themeIndex")
        if (saved) setThemeIndex(Number(saved))
    }, [])

    // Apply theme style
    useEffect(() => {
        const currentThemes = theme === "dark" ? darkThemes : lightThemes
        document.body.className = currentThemes[themeIndex]
        localStorage.setItem("themeIndex", themeIndex.toString())
    }, [theme, themeIndex])

    const value: ThemeStyleContextType = {
        themeIndex,
        setThemeIndex,
        themes: theme === "dark" ? darkThemes : lightThemes,
    }

    return (
        <ThemeStyleContext.Provider value={value}>
            {children}
        </ThemeStyleContext.Provider>
    )
}

export function useThemeStyle() {
    const ctx = useContext(ThemeStyleContext)
    if (!ctx) throw new Error("useThemeStyle must be used inside ThemeStyleProvider")
    return ctx
}