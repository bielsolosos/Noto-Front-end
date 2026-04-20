"use client";

import api from "@/lib/api";
import {
  buildPageListSearchParams,
  filterPageSummariesByQuery,
} from "@/lib/pageSearch";
import type { Page, PageSummaryDto } from "@/types/page";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

interface RefreshPageListOptions {
  query?: string;
  useBackendSearch?: boolean;
}

interface NotesContextType {
  // Lista resumida para sidebar
  pageSummaries: PageSummaryDto[];
  filteredPageSummaries: PageSummaryDto[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  isSaving: boolean;
  // Actions
  setSelectedPageId: (pageId: string | null) => void;
  createNewPage: () => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  updatePage: (
    pageId: string,
    data: { title: string; content: string }
  ) => Promise<void>;
  refreshPageList: (options?: RefreshPageListOptions) => Promise<void>;
  // Editor actions
  startEditing: () => void;
  cancelEdit: () => void;
  savePage: () => Promise<void>;
  autoSavePage: () => Promise<void>;
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
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredPageSummaries = useMemo(
    () => filterPageSummariesByQuery(pageSummaries, searchQuery),
    [pageSummaries, searchQuery]
  );

  // Função para atualizar a URL com o pageId
  const updateUrlWithPageId = (pageId: string | null) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (pageId) {
      nextSearchParams.set("pageId", pageId);
    } else {
      nextSearchParams.delete("pageId");
    }

    // Usar replace para não adicionar ao histórico
    const nextSearch = nextSearchParams.toString();
    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname);
  };

  // Função personalizada para setSelectedPageId que também atualiza a URL
  const setSelectedPageIdWithUrl = (pageId: string | null) => {
    setSelectedPageId(pageId);
    updateUrlWithPageId(pageId);
  };

  const resolveSelectedPageId = (
    pages: PageSummaryDto[],
    pageIdFromUrl: string | null,
    currentSelectedPageId: string | null
  ) => {
    const pageExists = (pageId: string | null) =>
      pageId ? pages.some((page) => page.id === pageId) : false;

    if (pageExists(pageIdFromUrl)) {
      return pageIdFromUrl;
    }

    if (pageExists(currentSelectedPageId)) {
      return currentSelectedPageId;
    }

    return pages[0]?.id ?? null;
  };

  const prevPageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedPage) {
      if (selectedPage.id !== prevPageIdRef.current) {
        setEditTitle(selectedPage.title);
        setEditContent(selectedPage.content);
        setHasUnsavedChanges(false);
        setIsEditing(false);
        prevPageIdRef.current = selectedPage.id;
      }
    } else {
      prevPageIdRef.current = null;
    }
  }, [selectedPage]);

  // Carregar lista resumida de páginas
  const refreshPageList = async (options: RefreshPageListOptions = {}) => {
    try {
      setIsLoadingList(true);
      const shouldUseBackendSearch =
        Boolean(options.useBackendSearch) && Boolean(options.query?.trim());
      const listSearchParams = shouldUseBackendSearch
        ? buildPageListSearchParams(options.query || "")
        : "";
      const endpoint = listSearchParams
        ? `api/pages/list?${listSearchParams}`
        : "api/pages/list";

      const response = await api.get<PageSummaryDto[]>(endpoint);
      setPageSummaries(response.data);

      const pageIdFromUrl = searchParams.get("pageId");

      const nextSelectedPageId = resolveSelectedPageId(
        response.data,
        pageIdFromUrl,
        selectedPageId
      );

      if (nextSelectedPageId !== selectedPageId) {
        setSelectedPageId(nextSelectedPageId);
      }

      if (pageIdFromUrl !== nextSelectedPageId) {
        updateUrlWithPageId(nextSelectedPageId);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao carregar páginas";
      toast.error("Erro ao carregar páginas");
    } finally {
      setIsLoadingList(false);
    }
  };

  // Carregar página completa quando ID muda
  useEffect(() => {
    const loadFullPage = async (pageId: string) => {
      try {
        setIsLoadingPage(true);
        const response = await api.get<Page>(`api/pages/${pageId}`);
        setSelectedPage(response.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Erro ao carregar página";
        toast.error("Erro ao carregar página");
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

      const response = await api.post<Page>("api/pages", {
        title: `Entrada - ${today}`,
        content: `# Bem vindo a sua nova página `,
      });

      const newPage = response.data;

      // Atualizar lista e selecionar nova página
      await refreshPageList();
      setSelectedPageIdWithUrl(newPage.id);

      toast.success("Página criada com sucesso");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao criar página";
      toast.error("Erro ao criar página");
    } finally {
      setIsCreating(false);
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      await api.delete(`api/pages/${pageId}`);

      // Se a página deletada estava selecionada, limpar seleção
      if (selectedPageId === pageId) {
        setSelectedPageId(null);
        setSelectedPage(null);
        updateUrlWithPageId(null);
      }

      // Atualizar lista
      await refreshPageList();

      toast.success("Página deletada com sucesso");
    } catch (error) {
      toast.error("Erro ao deletar página");
    }
  };

  const updatePageApi = async (
    pageId: string,
    data: { title: string; content: string },
    silent: boolean = false
  ) => {
    try {
      const response = await api.put<Page>(`api/pages/${pageId}`, data);

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

      if (!silent) {
        toast.success("Página atualizada com sucesso");
      }
    } catch (error) {
      if (!silent) {
        toast.error("Erro ao atualizar página");
      }
      throw error;
    }
  };

  // Editor actions
  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
    }
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  const savePage = async () => {
    if (!selectedPage || !hasUnsavedChanges) {
      return;
    }

    try {
      setIsSaving(true);
      await updatePageApi(selectedPage.id, {
        title: editTitle,
        content: editContent,
      });
      setHasUnsavedChanges(false);
      setIsEditing(false);
    } catch (error) {
      // Error já tratado no updatePageApi
    } finally {
      setIsSaving(false);
    }
  };

  const autoSavePage = async () => {
    if (!selectedPage || !hasUnsavedChanges) {
      return;
    }

    try {
      setIsSaving(true);
      await updatePageApi(
        selectedPage.id,
        {
          title: editTitle,
          content: editContent,
        },
        true // silent parameter
      );
      setHasUnsavedChanges(false);
    } catch (error) {
      // Error já tratado no updatePageApi
    } finally {
      setIsSaving(false);
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
        filteredPageSummaries,
        searchQuery,
        setSearchQuery,
        selectedPage,
        selectedPageId,
        isLoadingList,
        isLoadingPage,
        isCreating,
        isEditing,
        editTitle,
        editContent,
        hasUnsavedChanges,
        isSaving,
        setSelectedPageId: setSelectedPageIdWithUrl,
        createNewPage,
        deletePage,
        updatePage: updatePageApi,
        refreshPageList,
        startEditing,
        cancelEdit,
        savePage,
        autoSavePage,
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
