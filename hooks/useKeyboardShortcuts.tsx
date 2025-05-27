"use client";

import { useNotes } from "@/contexts/NotesContext";
import { useEffect } from "react";

export function useKeyboardShortcuts() {
  const {
    savePage,
    isEditing,
    cancelEdit,
    startEditing,
    selectedPage,
    createNewPage,
  } = useNotes();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isEditing) {
          console.log("Ctrl+S pressed - saving...");
          savePage();
        }
        return;
      }

      // Escape funciona EM QUALQUER LUGAR
      if (e.key === "Escape" && isEditing) {
        e.preventDefault();
        console.log("Escape pressed - canceling...");
        cancelEdit();
        return;
      }

      // Outros atalhos só funcionam FORA de inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "e":
            e.preventDefault();
            if (!isEditing && selectedPage) {
              console.log("Ctrl+E pressed - starting edit...");
              startEditing();
            }
            break;
          case "n":
            e.preventDefault();
            console.log("Ctrl+N pressed - creating new page...");
            createNewPage();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    savePage,
    isEditing,
    selectedPage,
    cancelEdit,
    startEditing,
    createNewPage,
  ]);
}
