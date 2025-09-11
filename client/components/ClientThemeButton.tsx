"use client"
import { useState, useEffect } from "react"

const themes = [
    { name: "blue", bg: "bg-blue-600", text: "text-blue-100" },
    { name: "red", bg: "bg-red-600", text: "text-red-100" },
    { name: "green", bg: "bg-green-600", text: "text-green-100" },
    { name: "purple", bg: "bg-purple-600", text: "text-purple-100" },
    { name: "orange", bg: "bg-orange-600", text: "text-orange-100" },
]

export default function ClientThemeToggle() {
    const [themeIndex, setThemeIndex] = useState(0)

    // save theme to localStorage so it persists after reload
    useEffect(() => {
        const saved = localStorage.getItem("themeIndex")
        if (saved) setThemeIndex(Number(saved))
    }, [])

    useEffect(() => {
        localStorage.setItem("themeIndex", themeIndex.toString())
    }, [themeIndex])

    const handleThemeChange = () => {
        setThemeIndex((prev) => (prev + 1) % themes.length)
    }

    const theme = themes[themeIndex]

    return (
        <nav
            className={`flex items-center justify-between p-4 ${theme.bg} ${theme.text}`}
        >

            <button
                onClick={handleThemeChange}
                className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-80 transition"
            >
                Change Theme
            </button>
        </nav>
    )
}