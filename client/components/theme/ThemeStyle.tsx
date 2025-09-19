"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useThemeStyle } from "./ThemeStyleProvider"
import { useEffect, useState } from "react"

export default function ThemeStyle() {
  const { themeIndex, setThemeIndex, themes } = useThemeStyle()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // ✅ prevents hydration mismatch

  return (
    <Select
      value={themeIndex.toString()}
      onValueChange={(val) => setThemeIndex(Number(val))}
    >
      <SelectTrigger className="min-w-[8rem]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((t, i) => (
          <SelectItem key={t} value={i.toString()}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}