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
    <aside className="hidden md:flex w-80 border-r border-border bg-muted/30 flex-col">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold">Entradas</h2>
        <Button
          onClick={createNewPage}
          size="sm"
          className="ml-2 px-2 py-1"
          disabled={isCreating}
        >
          <Plus className="mr-1 h-4 w-4" />
          {isCreating ? "Criando..." : "Novo"}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoadingList ? <PageListSkeleton /> : <PageList />}
        </div>
      </ScrollArea>
    </aside>
  );
}
