"use client";

import api from "@/lib/api";
import type { Page, PageSummaryDto } from "@/types/page";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

interface NotesContextType {
  // Lista resumida para sidebar
  pageSummaries: PageSummaryDto[];
  // Página completa selecionada
  selectedPage: Page | null;
  selectedPageId: string | null;
  // Loading states
  isLoadingList: boolean;
  isLoadingPage: boolean;
  isCreating: boolean;
  // Editor state - MOVIDO PARA CÁ
  isEditing: boolean;
  editTitle: string;
  editContent: string;
  hasUnsavedChanges: boolean;
  // Actions
  setSelectedPageId: (pageId: string | null) => void;
  createNewPage: () => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  updatePage: (
    pageId: string,
    data: { title: string; content: string }
  ) => Promise<void>;
  refreshPageList: () => Promise<void>;
  // Editor actions
  startEditing: () => void;
  cancelEdit: () => void;
  savePage: () => Promise<void>;
  handleTitleChange: (title: string) => void;
  handleContentChange: (content: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [pageSummaries, setPageSummaries] = useState<PageSummaryDto[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
      setHasUnsavedChanges(false);
      setIsEditing(false);
    }
  }, [selectedPage]);

  // Carregar lista resumida de páginas
  const refreshPageList = async () => {
    try {
      setIsLoadingList(true);
      const response = await api.get<PageSummaryDto[]>("/pages");
      setPageSummaries(response.data);

      // Se não há página selecionada e temos páginas, selecionar a primeira
      if (!selectedPageId && response.data.length > 0) {
        setSelectedPageId(response.data[0].id);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao carregar páginas";
      toast.error("Um erro inesperado aconteceu");
      console.error("Error fetching page list:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  // Carregar página completa quando ID muda
  useEffect(() => {
    const loadFullPage = async (pageId: string) => {
      try {
        setIsLoadingPage(true);
        const response = await api.get<Page>(`/pages/${pageId}`);
        setSelectedPage(response.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Erro ao carregar página";
        toast.error("Um erro inesperado aconteceu");
        console.error("Error fetching page:", error);
        // Se der erro, limpar seleção
        setSelectedPage(null);
        setSelectedPageId(null);
      } finally {
        setIsLoadingPage(false);
      }
    };

    if (selectedPageId) {
      loadFullPage(selectedPageId);
    } else {
      setSelectedPage(null);
      setIsLoadingPage(false);
    }
  }, [selectedPageId]);

  const createNewPage = async () => {
    try {
      setIsCreating(true);
      const today = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const response = await api.post<Page>("/pages", {
        title: `Entrada - ${today}`,
        content: `# ${today}\n\n## Como me sinto hoje\n\n\n\n## O que aconteceu\n\n\n\n## Reflexões\n\n\n\n## Gratidão\n\n- `,
      });

      const newPage = response.data;

      // Atualizar lista e selecionar nova página
      await refreshPageList();
      setSelectedPageId(newPage.id);

      toast.success("Página criada com sucesso");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao criar página";
      toast.error("Um erro inesperado aconteceu");
      console.error("Error creating page:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      await api.delete(`/pages/${pageId}`);

      // Se a página deletada estava selecionada, limpar seleção
      if (selectedPageId === pageId) {
        setSelectedPageId(null);
        setSelectedPage(null);
      }

      // Atualizar lista
      await refreshPageList();

      toast.success("Página deletada com sucesso");
    } catch (error) {
      toast.error("Um erro inesperado aconteceu");
      console.error("Error deleting page:", error);
    }
  };

  const updatePageApi = async (
    pageId: string,
    data: { title: string; content: string }
  ) => {
    try {
      const response = await api.put<Page>(`/pages/${pageId}`, data);

      // Atualizar página selecionada
      if (selectedPageId === pageId) {
        setSelectedPage(response.data);
      }

      // Atualizar lista resumida (só o título e updatedAt mudam)
      setPageSummaries((prev) =>
        prev.map((p) =>
          p.id === pageId
            ? {
                ...p,
                title: data.title,
                updatedAt: response.data.updatedAt,
              }
            : p
        )
      );

      toast.success("Página atualizada com sucesso");
    } catch (error) {
      toast.error("Um erro inesperado aconteceu");
      console.error("Error updating page:", error);
      throw error;
    }
  };

  // Editor actions
  const startEditing = () => {
    console.log("Starting edit mode from context");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    console.log("Canceling edit from context");
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
    }
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  const savePage = async () => {
    if (!selectedPage || !hasUnsavedChanges) {
      console.log("Save skipped:", {
        selectedPage: !!selectedPage,
        hasUnsavedChanges,
      });
      return;
    }

    console.log("Saving page from context...");
    try {
      await updatePageApi(selectedPage.id, {
        title: editTitle,
        content: editContent,
      });
      setHasUnsavedChanges(false);
      setIsEditing(false);
      console.log("Page saved successfully");
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  const handleTitleChange = (title: string) => {
    setEditTitle(title);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (content: string) => {
    setEditContent(content);
    setHasUnsavedChanges(true);
  };

  // Carregar lista inicial
  useEffect(() => {
    refreshPageList();
  }, []);

  return (
    <NotesContext.Provider
      value={{
        pageSummaries,
        selectedPage,
        selectedPageId,
        isLoadingList,
        isLoadingPage,
        isCreating,
        isEditing,
        editTitle,
        editContent,
        hasUnsavedChanges,
        setSelectedPageId,
        createNewPage,
        deletePage,
        updatePage: updatePageApi,
        refreshPageList,
        startEditing,
        cancelEdit,
        savePage,
        handleTitleChange,
        handleContentChange,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
