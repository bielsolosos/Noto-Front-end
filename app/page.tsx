"use client"

import { NotesProvider } from "@/contexts/NotesContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { MainLayout } from "@/components/layout/MainLayout"

export default function HomePage() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <MainLayout />
      </NotesProvider>
    </ThemeProvider>
  )
}
