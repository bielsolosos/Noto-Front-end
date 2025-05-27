"use client";

import { Input } from "@/components/ui/input";
import { useNotes } from "@/contexts/NotesContext";
import { useEffect, useRef } from "react";

export function NoteEditor() {
  const { editTitle, editContent, handleTitleChange, handleContentChange } =
    useNotes();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus no textarea quando entra em modo de edição
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="transition-all duration-300 opacity-100 translate-y-0">
      <div className="max-w-4xl mx-auto p-8">
        <Input
          value={editTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título da entrada..."
          className="text-4xl font-bold border-none p-0 mb-6 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <textarea
          value={editContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Escreva seus pensamentos aqui..."
          className="w-full min-h-[500px] p-4 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          style={{
            fontFamily: "inherit",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        />

        <p className="text-xs text-muted-foreground mt-4">
          Dica: Use Ctrl+S para salvar, Esc para cancelar
        </p>
      </div>
    </div>
  );
}
