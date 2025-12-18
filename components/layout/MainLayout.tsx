"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "./ErrorBoundary";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  const { isCollapsed } = useSidebar();
  const isMobile = useMobile();
  const { ConfirmDialog } = useKeyboardShortcuts();

  return (
    <ErrorBoundary>
      <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
        <ConfirmDialog />
        <Header />
        <div className="flex pt-16">
          {!isMobile && <Sidebar />}
          <div
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              !isMobile && (isCollapsed ? "ml-16" : "ml-80")
            )}
          >
            <MainContent />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
