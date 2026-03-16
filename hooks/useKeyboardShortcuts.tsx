"use client";

import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNotes } from "@/contexts/NotesContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useEffect } from "react";
import { toast } from "sonner";

export function useKeyboardShortcuts() {
  const {
    selectedPage,
    isEditing,
    hasUnsavedChanges,
    savePage,
    cancelEdit,
    startEditing,
    createNewPage,
  } = useNotes();

  const { toggleSidebar } = useSidebar();
  const { confirm, ConfirmDialog } = useConfirmDialog();

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
            confirm({
              title: "Descartar alterações?",
              description: "Você tem alterações não salvas. Deseja descartar?",
              confirmText: "Descartar",
              cancelText: "Continuar editando",
            }).then((confirmed) => {
              if (confirmed) {
                cancelEdit();
                toast("Edição cancelada");
              }
            });
          } else {
            cancelEdit();
            toast("Edição cancelada");
          }
        }
      }

      // Ctrl+E: Editar
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        if (!isEditing && selectedPage) {
          startEditing();
          toast("Modo de edição ativado");
        }
      }

      // Ctrl+N: Nova página
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        createNewPage();
      }

      // Ctrl+Q: Toggle menu lateral
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        toggleSidebar();
        toast("Menu lateral alternado");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isEditing,
    selectedPage,
    hasUnsavedChanges,
    savePage,
    cancelEdit,
    startEditing,
    createNewPage,
    toggleSidebar,
    confirm,
  ]);

  return { ConfirmDialog };
}
