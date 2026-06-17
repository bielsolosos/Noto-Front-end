"use client";

import { ContentSkeleton } from "@/components/skeletons/ContentSkeleton";
import { useNotes } from "@/contexts/NotesContext";
import { parseMarkdown } from "@/lib/markdownParser";
import DOMPurify from "dompurify";
import { useMemo, useCallback } from "react";

export function NoteViewer() {
  const { selectedPage, isLoadingPage } = useNotes();

  const sanitizedContent = useMemo(() => {
    const content = selectedPage?.content;
    if (!content) {
      return "<p class='text-muted-foreground italic'>Esta entrada está vazia. Clique em 'Editar' para começar a escrever.</p>";
    }
    const parsed = parseMarkdown(content);
    return DOMPurify.sanitize(parsed);
  }, [selectedPage?.content]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const imgContainer = target.closest('.markdown-img-container') as HTMLElement;
    
    if (imgContainer) {
      const src = imgContainer.getAttribute('data-image-src');
      const alt = imgContainer.getAttribute('data-image-alt');
      
      if (src && window.openImageModal) {
        window.openImageModal(src, alt || '');
      }
    }
  }, []);

  if (isLoadingPage) {
    return <ContentSkeleton />;
  }

  if (!selectedPage) return null;

  return (
    <div className="transition-all duration-300 opacity-100 translate-y-0">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
            {selectedPage.title}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {new Date(selectedPage.updatedAt).toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div
          className="prose prose-sm md:prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          onClick={handleContentClick}
        />
      </div>
    </div>
  );
}
