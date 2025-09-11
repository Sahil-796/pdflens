"use client"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const lightThemes = ["vercel", "t3chat", "doom64"]
const darkThemes = ["verceldark", "t3chatdark", "doom64dark"]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [themeIndex, setThemeIndex] = useState(0)

  // Load saved theme index on mount
  useEffect(() => {
    const saved = localStorage.getItem("themeIndex")
    if (saved) setThemeIndex(Number(saved))
  }, [])

  // Update body class whenever theme or index changes
  useEffect(() => {
    localStorage.setItem("themeIndex", themeIndex.toString())
    const currentThemes = theme === "dark" ? darkThemes : lightThemes
    document.body.className = currentThemes[themeIndex]
  }, [theme, themeIndex])

  return (
    <div className="flex items-center gap-2">
      {/* Theme Selector */}
      <Select
        value={themeIndex.toString()}
        onValueChange={(val) => setThemeIndex(Number(val))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {lightThemes.map((t, i) => (
            <SelectItem key={t} value={i.toString()}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Light/Dark Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle mode</span>
      </Button>
    </div>
  )
}