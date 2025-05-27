"use client"

import { useEffect } from "react"
import { useEditor } from "./useEditor"
import { useNotes } from "@/contexts/NotesContext"

export function useKeyboardShortcuts() {
  const { savePage, isEditing, cancelEdit, setIsEditing } = useEditor()
  const { selectedPage, createNewPage } = useNotes()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Allow Ctrl+S and Escape even in inputs
        if (e.ctrlKey || e.metaKey) {
          if (e.key === "s") {
            e.preventDefault()
            if (isEditing) savePage()
          }
        }
        if (e.key === "Escape" && isEditing) {
          cancelEdit()
        }
        return
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            if (isEditing) savePage()
            break
          case "e":
            e.preventDefault()
            if (!isEditing && selectedPage) setIsEditing(true)
            break
          case "n":
            e.preventDefault()
            createNewPage()
            break
        }
      }

      if (e.key === "Escape" && isEditing) {
        cancelEdit()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [savePage, isEditing, selectedPage, cancelEdit, setIsEditing, createNewPage])
}
