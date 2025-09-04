"use client";

import { PageList } from "@/components/pages/PageList";
import { PageListSkeleton } from "@/components/skeletons/PageListSkeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/contexts/NotesContext";
import { Plus } from "lucide-react";

interface MobileSidebarProps {
  onClose: () => void;
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const { createNewPage, isLoadingList, isCreating } = useNotes();

  const handleCreateNew = async () => {
    await createNewPage();
    onClose(); // Fecha o drawer após criar
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Entradas</h2>
          <Button
            onClick={handleCreateNew}
            size="sm"
            className="ml-2 px-3 py-2"
            disabled={isCreating}
          >
            <Plus className="mr-1 h-4 w-4" />
            {isCreating ? "Criando..." : "Novo"}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-3">
          {isLoadingList ? (
            <PageListSkeleton />
          ) : (
            <PageList onPageSelect={onClose} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
