"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { NotesProvider } from "@/contexts/NotesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function HomePage() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <MainLayout />
      </NotesProvider>
    </ThemeProvider>
  );
}
