"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { NotesProvider } from "@/contexts/NotesContext";

export default function HomePage() {
  return (
    <NotesProvider>
      <MainLayout />
    </NotesProvider>
  );
}
