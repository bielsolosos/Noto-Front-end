"use client";

import { useNotes } from "@/contexts/NotesContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function useKeyboardShortcuts() {
  const {
    isEditing,
    hasUnsavedChanges,
    savePage,
    cancelEdit,
    startEditing,
    createNewPage,
  } = useNotes();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: Salvar
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (isEditing && hasUnsavedChanges) {
          savePage();
          toast.success("Salvando...");
        }
      }

      // Escape: Cancelar edição
      if (e.key === "Escape") {
        if (isEditing) {
          if (hasUnsavedChanges) {
            if (confirm("Você tem alterações não salvas. Deseja descartar?")) {
              cancelEdit();
              toast("Edição cancelada", { icon: "ℹ️" });
            }
          } else {
            cancelEdit();
            toast("Edição cancelada", { icon: "ℹ️" });
          }
        }
      }

      // Ctrl+E: Editar
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        if (!isEditing) {
          startEditing();
          toast("Modo de edição ativado", { icon: "✏️" });
        }
      }

      // Ctrl+N: Nova página
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        createNewPage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isEditing,
    hasUnsavedChanges,
    savePage,
    cancelEdit,
    startEditing,
    createNewPage,
  ]);
}
