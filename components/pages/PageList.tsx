"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useNotes } from "@/contexts/NotesContext";
import { Trash2 } from "lucide-react";

interface PageListProps {
  onPageSelect?: () => void; // Callback para fechar drawer no mobile
}

export function PageList({ onPageSelect }: PageListProps) {
  const {
    pageSummaries,
    selectedPageId,
    setSelectedPageId,
    deletePage,
    isEditing,
    hasUnsavedChanges,
    cancelEdit,
  } = useNotes();

  const handlePageSelect = (pageId: string) => {
    if (isEditing && hasUnsavedChanges) {
      if (confirm("Você tem alterações não salvas. Deseja continuar?")) {
        cancelEdit();
        setSelectedPageId(pageId);
        onPageSelect?.(); // Fecha o drawer se estiver no mobile
      }
    } else {
      setSelectedPageId(pageId);
      onPageSelect?.(); // Fecha o drawer se estiver no mobile
    }
  };

  const handleDeletePage = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir esta entrada?")) {
      deletePage(pageId);
    }
  };

  return (
    <>
      {pageSummaries.map((page) => (
        <div
          key={page.id}
          className={`group relative rounded-lg p-3 mb-2 cursor-pointer transition-colors hover:bg-accent ${
            selectedPageId === page.id ? "bg-accent border border-border" : ""
          }`}
          onClick={() => handlePageSelect(page.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate mb-1">
                {page.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {new Date(page.updatedAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleDeletePage(e, page.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
