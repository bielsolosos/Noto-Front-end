"use client";

import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteViewer } from "@/components/notes/NoteViewer";
import { useNotes } from "@/contexts/NotesContext";
import { useMobile } from "@/hooks/useMobile";
import { BookOpen } from "lucide-react";

export function MainContent() {
  const { selectedPage, isEditing } = useNotes();
  const isMobile = useMobile();

  if (!selectedPage) {
    return (
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            <BookOpen className="h-16 w-16 md:h-20 md:w-20 text-primary/50 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-semibold">
                Bem-vindo ao seu Noto
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {isMobile
                  ? "Toque no menu para ver suas entradas ou criar uma nova."
                  : "Selecione uma entrada existente ou crie uma nova para começar a escrever seus pensamentos e reflexões."}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto">
        {isEditing ? <NoteEditor /> : <NoteViewer />}
      </div>
    </main>
  );
}
