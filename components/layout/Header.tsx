"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/contexts/NotesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { BookOpen, Edit3, Moon, Save, Sun, X } from "lucide-react";

export function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const {
    selectedPage,
    isEditing,
    hasUnsavedChanges,
    savePage,
    cancelEdit,
    startEditing,
  } = useNotes();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Noto</h1>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            >
              Não salvo
            </Badge>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9 rounded-lg border border-border hover:bg-accent"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={savePage}
                disabled={!hasUnsavedChanges}
                size="sm"
                className="h-8"
              >
                <Save className="mr-2 h-3 w-3" />
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={cancelEdit}
                size="sm"
                className="h-8"
              >
                <X className="mr-2 h-3 w-3" />
                Cancelar
              </Button>
            </div>
          ) : (
            selectedPage && (
              <Button onClick={() => startEditing()} size="sm" className="h-8">
                <Edit3 className="mr-2 h-3 w-3" />
                Editar
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
