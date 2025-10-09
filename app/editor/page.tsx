"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { NotesProvider } from "@/contexts/NotesContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Suspense } from "react";

function EditorContent() {
  return (
    <SidebarProvider>
      <NotesProvider>
        <MainLayout />
      </NotesProvider>
    </SidebarProvider>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EditorContent />
    </Suspense>
  );
}
