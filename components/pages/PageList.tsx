"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useNotes } from "@/contexts/NotesContext";
import { Trash2 } from "lucide-react";

export function PageList() {
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
      }
    } else {
      setSelectedPageId(pageId);
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
                {new Date(page.updatedAt).toLocaleDateString("pt-BR")}
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
