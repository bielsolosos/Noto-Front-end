"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { ErrorBoundary } from "./ErrorBoundary";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  const { isSidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar();
  const isMobile = useMobile();
  const { ConfirmDialog } = useKeyboardShortcuts();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile, setSidebarOpen]);

  return (
    <ErrorBoundary>
      <div className="relative bg-background text-foreground transition-colors duration-300 min-h-screen">
        <ConfirmDialog />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          data-sidebar-toggle="true"
          className={cn(
            "fixed top-4 z-[45] h-10 w-10 rounded-full shadow-md transition-all duration-300 ease-in-out",
            !isMobile && isSidebarOpen ? "left-[20.75rem]" : "left-4"
          )}
          aria-label={isSidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>

        <div className="flex">
          <Sidebar />
          <div
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              !isMobile && (isSidebarOpen ? "ml-80" : "ml-0")
            )}
          >
            <MainContent />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
