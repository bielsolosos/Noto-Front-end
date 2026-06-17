"use client";

import api from "@/lib/api";
import {
  buildPageListSearchParams,
  type PageSortParams,
} from "@/lib/pageSearch";
import type { Page, PageSummaryDto } from "@/types/page";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

interface RefreshPageListOptions {
  sortParams?: PageSortParams;
}

interface NotesContextType {
  // Lista resumida para sidebar
  pageSummaries: PageSummaryDto[];
  filteredPageSummaries: PageSummaryDto[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortParams: PageSortParams;
  setSortParams: (params: PageSortParams) => void;
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
  const [sortParams, setSortParams] = useState<PageSortParams>({
    sortBy: "UPDATED_AT",
    sortOrder: "DESC",
  });

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredPageSummaries = pageSummaries;

  const initializedRef = useRef(false);

  // Helper para construir URL limpa sem parâmetros internos do Next.js (_rsc)
  const buildUrl = (
    q: string,
    sp: PageSortParams,
    pageId: string | null
  ): string => {
    const params = new URLSearchParams();

    if (q) {
      params.set("q", q);
    }
    if (sp.sortBy !== "UPDATED_AT" || sp.sortOrder !== "DESC") {
      params.set("sortBy", sp.sortBy);
      params.set("sortOrder", sp.sortOrder);
    }
    if (pageId) {
      params.set("pageId", pageId);
    }

    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  };

  // Sincronizar estado com URL (URL é a fonte de verdade para parâmetros de filtro)
  useEffect(() => {
    if (!initializedRef.current) return;

    const newUrl = buildUrl(searchQuery, sortParams, selectedPageId);
    router.replace(newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortParams, selectedPageId]);

  // Função para atualizar searchQuery e URL
  const handleSetSearchQuery = (q: string) => {
    setSearchQuery(q);
  };

  // Função para atualizar sortParams e URL
  const handleSetSortParams = (newSortParams: PageSortParams) => {
    setSortParams(newSortParams);
  };

  // Função para definir página selecionada
  const setSelectedPageIdWithUrl = (pageId: string | null) => {
    setSelectedPageId(pageId);
  };

  const prevPageIdRef = useRef<string | null>(null);
  const refreshInProgressRef = useRef(false);

  // Refs para evitar stale closures
  const sortParamsRef = useRef(sortParams);
  const searchQueryRef = useRef(searchQuery);
  const selectedPageIdRef = useRef(selectedPageId);

  // Manter refs atualizados
  useEffect(() => {
    sortParamsRef.current = sortParams;
  }, [sortParams]);

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    selectedPageIdRef.current = selectedPageId;
  }, [selectedPageId]);

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
  const refreshPageList = useCallback(async (options: RefreshPageListOptions = {}) => {
    if (refreshInProgressRef.current) return;
    refreshInProgressRef.current = true;

    try {
      setIsLoadingList(true);
      const effectiveSortParams = options.sortParams || sortParamsRef.current;
      const listSearchParams = buildPageListSearchParams(searchQueryRef.current, effectiveSortParams);
      const endpoint = `api/pages/list${listSearchParams ? `?${listSearchParams}` : ""}`;

      const response = await api.get<PageSummaryDto[]>(endpoint);
      setPageSummaries(response.data);

      // Se nenhuma página está selecionada, selecionar a primeira
      if (!selectedPageIdRef.current && response.data.length > 0) {
        const firstPageId = response.data[0].id;
        setSelectedPageId(firstPageId);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao carregar páginas";
      toast.error("Erro ao carregar páginas");
    } finally {
      setIsLoadingList(false);
      refreshInProgressRef.current = false;
    }
  }, []);

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

  // Inicializar estado a partir da URL e carregar lista (apenas uma vez no mount)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const qParam = searchParams.get("q");
    const sortByParam = searchParams.get("sortBy") as "UPDATED_AT" | "CREATED_AT" | "TITLE" | null;
    const sortOrderParam = searchParams.get("sortOrder") as "DESC" | "ASC" | null;
    const pageIdFromUrl = searchParams.get("pageId");

    if (qParam) {
      setSearchQuery(qParam);
    }

    if (sortByParam && sortOrderParam) {
      setSortParams({ sortBy: sortByParam, sortOrder: sortOrderParam });
    }

    if (pageIdFromUrl) {
      setSelectedPageId(pageIdFromUrl);
    }

    refreshPageList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-buscar lista quando sortParams ou searchQuery mudam (após inicialização)
  useEffect(() => {
    if (!initializedRef.current) return;
    refreshPageList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortParams, searchQuery]);

  return (
    <NotesContext.Provider
      value={{
        pageSummaries,
        filteredPageSummaries,
        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        sortParams,
        setSortParams: handleSetSortParams,
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
