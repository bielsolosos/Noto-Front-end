"use client";

import { Button } from "@/components/ui/button";
import { useNotes } from "@/contexts/NotesContext";
import { Trash2 } from "lucide-react";
import type React from "react";

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
        onPageSelect?.();
      }
    } else {
      setSelectedPageId(pageId);
      onPageSelect?.();
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
          className={`group relative rounded-lg p-4 mb-2 cursor-pointer transition-colors hover:bg-accent ${
            selectedPageId === page.id ? "bg-accent border border-border" : ""
          }`}
          onClick={() => handlePageSelect(page.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate mb-1">
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
              className="h-8 w-8 ml-2 md:h-6 md:w-6 
                         md:opacity-0 md:group-hover:opacity-100 
                         transition-opacity"
              onClick={(e) => handleDeletePage(e, page.id)}
            >
              <Trash2 className="h-4 w-4 md:h-3 md:w-3" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
