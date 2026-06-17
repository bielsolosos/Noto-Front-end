"use client";

import { PageList } from "@/components/pages/PageList";
import { PageListSkeleton } from "@/components/skeletons/PageListSkeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/contexts/NotesContext";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useState } from "react";

type SortOption = {
  label: string;
  sortBy: "UPDATED_AT" | "CREATED_AT" | "TITLE";
  sortOrder: "DESC" | "ASC";
};

const sortOptions: SortOption[] = [
  { label: "Mais recentes", sortBy: "UPDATED_AT", sortOrder: "DESC" },
  { label: "Mais antigos", sortBy: "UPDATED_AT", sortOrder: "ASC" },
  { label: "Mais novos", sortBy: "CREATED_AT", sortOrder: "DESC" },
  { label: "Mais velhos", sortBy: "CREATED_AT", sortOrder: "ASC" },
  { label: "A-Z", sortBy: "TITLE", sortOrder: "ASC" },
  { label: "Z-A", sortBy: "TITLE", sortOrder: "DESC" },
];

function SortIconComponent({
  sortBy,
  sortOrder,
}: {
  sortBy: "UPDATED_AT" | "CREATED_AT" | "TITLE";
  sortOrder: "DESC" | "ASC";
}) {
  if (sortBy !== "UPDATED_AT") {
    return <ArrowUpDown className="h-4 w-4" />;
  }
  return sortOrder === "DESC" ? (
    <ArrowDown className="h-4 w-4" />
  ) : (
    <ArrowUp className="h-4 w-4" />
  );
}

export function Sidebar() {
  const { createNewPage, isLoadingList, isCreating, sortParams, setSortParams, refreshPageList } =
    useNotes();
  const [isSortOpen, setIsSortOpen] = useState(false);

  const currentSort = sortOptions.find(
    (opt) => opt.sortBy === sortParams.sortBy && opt.sortOrder === sortParams.sortOrder
  );

  const handleSortChange = (option: SortOption) => {
    setSortParams({ sortBy: option.sortBy, sortOrder: option.sortOrder });
    setIsSortOpen(false);
    refreshPageList({ sortParams: { sortBy: option.sortBy, sortOrder: option.sortOrder } });
  };

  return (
    <aside className="hidden md:flex w-80 border-r border-border bg-muted/30 flex-col">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold">Entradas</h2>
        <div className="flex items-center gap-1">
          <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2 py-1">
                <SortIconComponent sortBy={sortParams.sortBy} sortOrder={sortParams.sortOrder} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={`${option.sortBy}-${option.sortOrder}`}
                  onClick={() => handleSortChange(option)}
                  className={
                    currentSort?.sortBy === option.sortBy &&
                    currentSort?.sortOrder === option.sortOrder
                      ? "bg-accent"
                      : ""
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={createNewPage}
            size="sm"
            className="px-2 py-1"
            disabled={isCreating}
          >
            <Plus className="mr-1 h-4 w-4" />
            {isCreating ? "Criando..." : "Novo"}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoadingList ? <PageListSkeleton /> : <PageList />}
        </div>
      </ScrollArea>
    </aside>
  );
}
