"use client";

import { PageList } from "@/components/pages/PageList";
import { PageListSkeleton } from "@/components/skeletons/PageListSkeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { BookOpen, LogOut, Moon, Plus, Search, Settings, Shield, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

interface SidebarPanelProps {
  isMobileLayout: boolean;
}

function SidebarPanel({ isMobileLayout }: SidebarPanelProps) {
  const {
    createNewPage,
    isLoadingList,
    isCreating,
    filteredPageSummaries,
    searchQuery,
    setSearchQuery,
  } = useNotes();
  const { closeSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const isAdmin = user?.roles?.includes("ROLE_ADMIN") ?? false;
  const userInitial = useMemo(
    () => user?.username?.charAt(0).toUpperCase() || "U",
    [user?.username]
  );

  const closeAfterAction = () => {
    if (isMobileLayout) {
      closeSidebar();
    }
  };

  const handleCreateNew = async () => {
    await createNewPage();
    closeAfterAction();
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
    closeAfterAction();
  };

  const handleLogout = () => {
    closeAfterAction();
    logout();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">Noto</span>
          </div>

          <Button
            onClick={handleCreateNew}
            size="sm"
            className="px-3"
            disabled={isCreating}
          >
            <Plus className="mr-1 h-4 w-4" />
            {isCreating ? "Criando..." : "Novo"}
          </Button>
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar por titulo, data ou hora"
            className="h-9 pl-8"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-3">
          {isLoadingList ? (
            <PageListSkeleton />
          ) : (
            <PageList
              pages={filteredPageSummaries}
              onPageSelect={isMobileLayout ? closeSidebar : undefined}
            />
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full p-0"
                aria-label="Abrir menu de conta"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium">{user?.username || "Usuário"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email || "-"}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/settings" onClick={closeAfterAction}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" onClick={closeAfterAction}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Administração</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-600"
              onClick={handleLogout}
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen, closeSidebar } = useSidebar();
  const isMobile = useMobile();
  const desktopDrawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isMobile || !isSidebarOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (desktopDrawerRef.current?.contains(target)) {
        return;
      }

      const toggleButton = document.querySelector('[data-sidebar-toggle="true"]');
      if (toggleButton?.contains(target)) {
        return;
      }

      closeSidebar();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobile, isSidebarOpen, closeSidebar]);

  if (isMobile) {
    return (
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 [&>button]:hidden">
          <SidebarPanel isMobileLayout />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      ref={desktopDrawerRef}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-80 border-r border-border bg-background transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarPanel isMobileLayout={false} />
    </aside>
  );
}
