"use client";

import { PageList } from "@/components/pages/PageList";
import { PageListSkeleton } from "@/components/skeletons/PageListSkeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/contexts/NotesContext";
import { Plus } from "lucide-react";

export function Sidebar() {
  const { createNewPage, isLoadingList, isCreating } = useNotes();

  return (
    <aside className="fixed left-0 top-16 z-40 w-80 h-[calc(100vh-4rem)] border-r border-border bg-background">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg">Entradas</h2>
        <Button
          onClick={createNewPage}
          size="sm"
          className="ml-2 px-3 py-2"
          disabled={isCreating}
        >
          <Plus className="mr-1 h-4 w-4" />
          {isCreating ? "Criando..." : "Novo"}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-9rem)] overflow-y-auto">
        <div className="p-3">
          {isLoadingList ? <PageListSkeleton /> : <PageList />}
        </div>
      </ScrollArea>
    </aside>
  );
}
