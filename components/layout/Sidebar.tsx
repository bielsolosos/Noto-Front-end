"use client";

import { PageList } from "@/components/pages/PageList";
import { PageListSkeleton } from "@/components/skeletons/PageListSkeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/contexts/NotesContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export function Sidebar() {
  const { createNewPage, isLoadingList, isCreating } = useNotes();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-border bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      {/* Header da sidebar */}
      <div
        className={cn(
          "p-4 border-b border-border flex items-center justify-between",
          isCollapsed && "justify-center"
        )}
      >
        {!isCollapsed ? (
          <>
            {/* Botão Novo à esquerda */}
            <Button
              onClick={createNewPage}
              size="sm"
              className="px-3 py-2"
              disabled={isCreating}
            >
              <Plus className="mr-1 h-4 w-4" />
              {isCreating ? "Criando..." : "Novo"}
            </Button>

            {/* Botão toggle à direita */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2 hover:bg-accent"
              title="Recolher sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          /* Quando colapsada, só mostra o botão de expandir */
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-8 h-8 p-2 hover:bg-accent"
            title="Expandir sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Conteúdo da sidebar */}
      {!isCollapsed && (
        <ScrollArea className="h-[calc(100vh-9rem)] overflow-y-auto">
          <div className="p-3">
            {isLoadingList ? <PageListSkeleton /> : <PageList />}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
