"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Settings,
  Shield,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleDarkMode}>
                {darkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Modo Escuro</span>
                  </>
                )}
              </DropdownMenuItem>
              {user?.role_admin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Administração</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
