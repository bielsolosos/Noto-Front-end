"use client";

import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteViewer } from "@/components/notes/NoteViewer";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/contexts/NotesContext";
import { useMobile } from "@/hooks/useMobile";
import { BookOpen, Edit3, X } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

export function MainContent() {
  const {
    selectedPage,
    isEditing,
    pageSummaries,
    isLoadingList,
    cancelEdit,
    startEditing,
  } = useNotes();
  const isMobile = useMobile();

  const hasPages = pageSummaries.length > 0;

  if (!selectedPage) {
    return (
      <main className="flex-1 overflow-hidden">
        {!isLoadingList ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
              <BookOpen className="h-16 w-16 md:h-20 md:w-20 text-primary/50 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold">
                  {hasPages ? "Bem-vindo ao seu Noto" : "Nenhuma entrada ainda"}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  {!hasPages
                    ? isMobile
                      ? "Toque no botão lateral e crie sua primeira entrada para começar."
                      : "Use o botão lateral fixo para abrir o menu e criar sua primeira entrada."
                    : isMobile
                    ? "Toque no botão lateral para ver suas entradas ou criar uma nova."
                    : "Abra o menu lateral pelo botão fixo para alternar entradas ou criar uma nova."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-hidden">
      {
        <Button
          onClick={isEditing ? cancelEdit : startEditing}
          size="sm"
          variant={isEditing ? "outline" : "default"}
          className="fixed right-4 top-4 z-[45] h-10 rounded-full px-3 shadow-md"
          aria-label={isEditing ? "Sair do modo de edição" : "Editar entrada"}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sair</span>
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Editar</span>
            </>
          )}
        </Button>
      }

      <div className="h-full overflow-auto">
        {isEditing ? <NoteEditor /> : <NoteViewer />}
      </div>
    </main>
  );
}
