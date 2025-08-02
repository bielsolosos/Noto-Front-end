"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useMobile } from "@/hooks/useMobile";
import {
  BookOpen,
  Edit3,
  LogOut,
  Menu,
  Moon,
  Save,
  Sun,
  X,
} from "lucide-react";
import { useState } from "react";
import { MobileSidebar } from "./MobileSidebar";

export function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout, user } = useAuth();
  const {
    selectedPage,
    isEditing,
    hasUnsavedChanges,
    savePage,
    cancelEdit,
    startEditing,
  } = useNotes();
  const isMobile = useMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <MobileSidebar onClose={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          )}

          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Noto</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {hasUnsavedChanges && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs"
            >
              {isMobile ? "•" : "Não salvo"}
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

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-9 w-9 rounded-lg border border-border hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          {isEditing ? (
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={savePage}
                disabled={!hasUnsavedChanges}
                size="sm"
                className="h-8"
              >
                <Save className="h-3 w-3 md:mr-2" />
                <span className="hidden md:inline">Salvar</span>
              </Button>
              <Button
                variant="outline"
                onClick={cancelEdit}
                size="sm"
                className="h-8"
              >
                <X className="h-3 w-3 md:mr-2" />
                <span className="hidden md:inline">Cancelar</span>
              </Button>
            </div>
          ) : (
            selectedPage && (
              <Button onClick={startEditing} size="sm" className="h-8">
                <Edit3 className="h-3 w-3 md:mr-2" />
                <span className="hidden md:inline">Editar</span>
              </Button>
            )
          )}
          <div>{user?.username}</div>
        </div>
      </div>
    </header>
  );
}
