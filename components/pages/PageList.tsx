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
    <div className="space-y-2">
      {pageSummaries.map((page) => (
        <div
          key={page.id}
          className={`group relative rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-accent/80 ${
            selectedPageId === page.id
              ? "bg-accent border border-primary/20 shadow-sm"
              : "hover:shadow-sm"
          }`}
          onClick={() => handlePageSelect(page.id)}
        >
          {/* Container principal com flexbox */}
          <div className="flex items-start gap-3">
            {/* Conteúdo da nota - ocupa o espaço disponível */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3
                className="font-medium text-sm leading-tight mb-2 line-clamp-2"
                title={page.title}
              >
                {page.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {new Date(page.updatedAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Botão de deletar - sempre visível e fixo */}
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                onClick={(e) => handleDeletePage(e, page.id)}
                title="Excluir entrada"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
