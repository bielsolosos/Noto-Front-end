"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { NotesProvider } from "@/contexts/NotesContext";
import { Suspense } from "react";

function EditorContent() {
  return (
    <NotesProvider>
      <MainLayout />
    </NotesProvider>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EditorContent />
    </Suspense>
  );
}
