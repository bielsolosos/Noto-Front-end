"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import { parseMarkdown } from "@/lib/markdownParser";
import {
  BookOpen,
  Edit3,
  Moon,
  Plus,
  Save,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Page {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/**
 * Página principal do app
 * App inteiro é feita em uma única página pois eu fiz tudo muito rápido.
 * @returns
 */
export default function MainPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(pages[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toastStyle = {
    background: !darkMode ? "#333" : "#fff",
    color: !darkMode ? "#eee" : "#111",
    borderRadius: "8px",
    boxShadow: !darkMode
      ? "0 4px 12px rgba(0,0,0,0.6)"
      : "0 4px 12px rgba(0,0,0,0.1)",
  };

  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
    }
  }, [selectedPage]);

  async function getPages() {
    api.get<Page[]>("/pages").then((response) => {
      setPages(response.data);
    });
  }

  const savePage = useCallback(async () => {
    if (!selectedPage) return;

    const updatedPage = {
      ...selectedPage,
      title: editTitle,
      content: editContent,
    };

    try {
      const response = await api.put(`/pages/${selectedPage.id}`, {
        title: editTitle,
        content: editContent,
      });

      if (response.status === 200) {
        setPages((prev) =>
          prev.map((p) => (p.id === selectedPage.id ? updatedPage : p))
        );
        setSelectedPage(updatedPage);
        setHasUnsavedChanges(false);
        setIsEditing(false);

        toast.success("Atualizado com sucesso");
      } else {
        toast.error("Falhou na hora de salvar");
      }
    } catch (error) {
      console.error("Error saving page:", error);
    }
  }, [selectedPage, editTitle, editContent]);

  // Cancel editing
  function cancelEdit() {
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
    }
    setHasUnsavedChanges(false);
    setIsEditing(false);
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            if (isEditing) savePage();
            break;
          case "e":
            e.preventDefault();
            if (!isEditing && selectedPage) setIsEditing(true);
            break;
        }
      }
      if (e.key === "Escape" && isEditing) {
        cancelEdit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [savePage, isEditing, selectedPage]);

  async function createNewPage() {
    const today = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    api
      .post("/pages", {
        title: `Entrada - ${today}`,
      })
      .then(() => {
        getPages();
        toast.success("Salvo com sucesso");
      });
  }

  async function deletePage(pageId: string) {
    setSelectedPage(null);
    api.delete(`/pages/${pageId}`).then(() => {
      getPages();
      toast.success("Deletado com sucesso");
    });
  }

  function handleTitleChange(newTitle: string) {
    setEditTitle(newTitle);
    setHasUnsavedChanges(true);
  }

  function handleContentChange(newContent: string) {
    setEditContent(newContent);
    setHasUnsavedChanges(true);
  }

  useEffect(() => {
    getPages();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <Toaster toastOptions={{ style: toastStyle }} />
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Noto</h1>
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              >
                Não salvo
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="h-9 w-9 rounded-lg border border-border hover:bg-accent"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={savePage}
                  disabled={!hasUnsavedChanges}
                  size="sm"
                  className="h-8"
                >
                  <Save className="mr-2 h-3 w-3" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                  size="sm"
                  className="h-8"
                >
                  <X className="mr-2 h-3 w-3" />
                  Cancelar
                </Button>
              </div>
            ) : (
              selectedPage && (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="h-8"
                >
                  <Edit3 className="mr-2 h-3 w-3" />
                  Editar
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border bg-muted/30">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Entradas</h2>
            <Button
              onClick={createNewPage}
              size="sm"
              className="ml-2 px-2 py-1"
            >
              <Plus className=" mr-1 h-4 w-4" />
              Novo
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-2">
              {pages
                .filter((p) => !p.archived)
                .map((page) => (
                  <div
                    key={page.id}
                    className={`group relative rounded-lg p-3 mb-2 cursor-pointer transition-colors hover:bg-accent ${
                      selectedPage?.id === page.id
                        ? "bg-accent border border-border"
                        : ""
                    }`}
                    onClick={() => {
                      if (isEditing && hasUnsavedChanges) {
                        if (
                          confirm(
                            "Você tem alterações não salvas. Deseja continuar?"
                          )
                        ) {
                          cancelEdit();
                          setSelectedPage(page);
                        }
                      } else {
                        setSelectedPage(page);
                        setIsEditing(false);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate mb-1">
                          {page.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(page.updatedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "Tem certeza que deseja excluir esta entrada?"
                            )
                          ) {
                            deletePage(page.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {selectedPage ? (
            <div className="h-full overflow-auto">
              {/* View Mode */}
              <div
                className={`transition-all duration-300 ${
                  isEditing
                    ? "opacity-0 translate-y-2 hidden"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <div className="max-w-4xl mx-auto p-8">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-foreground">
                      {selectedPage.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedPage.updatedAt).toLocaleDateString(
                        "pt-BR",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  <div
                    className="prose prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedPage.content
                        ? parseMarkdown(selectedPage.content)
                        : "<p class='text-muted-foreground italic'>Esta entrada está vazia. Clique em 'Editar' para começar a escrever.</p>",
                    }}
                  />
                </div>
              </div>

              {/* Edit Mode */}
              <div
                className={`transition-all duration-300 ${
                  isEditing
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 hidden"
                }`}
              >
                <div className="max-w-4xl mx-auto p-8">
                  <Input
                    value={editTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Título da entrada..."
                    className="text-4xl font-bold border-none p-0 mb-6 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />

                  <textarea
                    ref={textareaRef}
                    value={editContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Escreva seus pensamentos aqui..."
                    className="w-full min-h-[500px] p-4 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    style={{
                      fontFamily: "inherit",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  />

                  <p className="text-xs text-muted-foreground mt-4">
                    Dica: Use Ctrl+S para salvar, Esc para cancelar
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-6">
                <BookOpen className="h-20 w-20 text-primary/50 mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">
                    Bem-vindo ao seu Noto
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Selecione uma entrada existente ou crie uma nova para
                    começar a escrever seus pensamentos e reflexões.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
