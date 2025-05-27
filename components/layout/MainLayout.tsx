"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./ErrorBoundary";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  const { darkMode } = useTheme();
  useKeyboardShortcuts();

  const toastStyle = {
    background: !darkMode ? "#333" : "#fff",
    color: !darkMode ? "#eee" : "#111",
    borderRadius: "8px",
    boxShadow: !darkMode
      ? "0 4px 12px rgba(0,0,0,0.6)"
      : "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Toaster toastOptions={{ style: toastStyle }} />
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </ErrorBoundary>
  );
}
