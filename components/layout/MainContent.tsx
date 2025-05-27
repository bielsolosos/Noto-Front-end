"use client";

import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteViewer } from "@/components/notes/NoteViewer";
import { useNotes } from "@/contexts/NotesContext";
import { BookOpen } from "lucide-react";
import { useEffect } from "react";

export function MainContent() {
  const { selectedPage, isEditing } = useNotes();

  useEffect(() => {
    console.log(isEditing);
  }, [isEditing]);

  if (!selectedPage) {
    return (
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-6">
            <BookOpen className="h-20 w-20 text-primary/50 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Bem-vindo ao seu Noto</h2>
              <p className="text-muted-foreground max-w-md">
                Selecione uma entrada existente ou crie uma nova para começar a
                escrever seus pensamentos e reflexões.
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
