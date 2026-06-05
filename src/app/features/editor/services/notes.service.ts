import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageResponse, PageSummaryResponse } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Lista de páginas
  pageSummaries = signal<PageSummaryResponse[]>([]);
  searchQuery = signal<string>('');

  // Sinais Calculados (Computed)
  filteredPageSummaries = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.pageSummaries();
    if (!query) return list;
    return list.filter(
      (page) =>
        page.title.toLowerCase().includes(query) ||
        page.updatedAt.toLowerCase().includes(query)
    );
  });

  // Página Selecionada
  selectedPage = signal<PageResponse | null>(null);
  selectedPageId = signal<string | null>(null);

  // Sinais de controle de sincronismo e rotas
  isLoadingList = signal<boolean>(true);
  isLoadingPage = signal<boolean>(false);
  isCreating = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  // Estados temporários do Editor
  editTitle = signal<string>('');
  editContent = signal<string>('');
  hasUnsavedChanges = signal<boolean>(false);

  constructor() {
    // Escuta mudanças de selectedPageId para carregar a nota completa automaticamente
    effect(() => {
      const pageId = this.selectedPageId();
      if (pageId) {
        this.loadFullPage(pageId);
      } else {
        this.selectedPage.set(null);
        this.editTitle.set('');
        this.editContent.set('');
        this.hasUnsavedChanges.set(false);
      }
    }, { allowSignalWrites: true });
  }

  refreshPageList(): void {
    this.isLoadingList.set(true);
    this.http.get<PageSummaryResponse[]>(`${this.apiUrl}/api/pages/list`).subscribe({
      next: (pages) => {
        this.pageSummaries.set(pages);
        this.isLoadingList.set(false);
      },
      error: () => {
        this.isLoadingList.set(false);
      }
    });
  }

  loadFullPage(pageId: string): void {
    this.isLoadingPage.set(true);
    this.http.get<PageResponse>(`${`${this.apiUrl}/api/pages`}/${pageId}`).subscribe({
      next: (page) => {
        this.selectedPage.set(page);
        this.editTitle.set(page.title);
        this.editContent.set(page.content);
        this.hasUnsavedChanges.set(false);
        this.isLoadingPage.set(false);
      },
      error: () => {
        this.selectedPage.set(null);
        this.selectedPageId.set(null);
        this.isLoadingPage.set(false);
      }
    });
  }

  createNewPage(callback?: (newPage: PageResponse) => void): void {
    if (this.isCreating()) return;

    this.isCreating.set(true);
    const today = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const body = {
      title: `Entrada - ${today}`,
      content: '# Bem vindo a sua nova página '
    };

    this.http.post<PageResponse>(`${this.apiUrl}/api/pages`, body).subscribe({
      next: (newPage) => {
        this.isCreating.set(false);
        this.refreshPageList();
        if (callback) {
          callback(newPage);
        } else {
          this.selectedPageId.set(newPage.id);
          this.isEditing.set(true);
        }
      },
      error: () => {
        this.isCreating.set(false);
      }
    });
  }

  deletePage(pageId: string, successCallback?: () => void): void {
    this.http.delete(`${this.apiUrl}/api/pages/${pageId}`).subscribe({
      next: () => {
        if (successCallback) {
          successCallback();
        } else {
          if (this.selectedPageId() === pageId) {
            this.selectedPageId.set(null);
          }
          this.refreshPageList();
        }
      }
    });
  }

  savePage(): void {
    const pageId = this.selectedPageId();
    if (!pageId || !this.hasUnsavedChanges() || this.isSaving()) return;

    this.isSaving.set(true);
    const body = {
      title: this.editTitle(),
      content: this.editContent()
    };

    this.http.put<PageResponse>(`${this.apiUrl}/api/pages/${pageId}`, body).subscribe({
      next: (updatedPage) => {
        this.selectedPage.set(updatedPage);
        this.hasUnsavedChanges.set(false);
        this.isEditing.set(false);
        this.isSaving.set(false);
        
        // Atualiza o título na lista sem recarregar toda a API
        this.pageSummaries.update((list) =>
          list.map((p) =>
            p.id === pageId
              ? { ...p, title: body.title, updatedAt: updatedPage.updatedAt }
              : p
          )
        );
      },
      error: () => {
        this.isSaving.set(false);
      }
    });
  }

  autoSavePage(): void {
    const pageId = this.selectedPageId();
    if (!pageId || !this.hasUnsavedChanges() || this.isSaving()) return;

    this.isSaving.set(true);
    const body = {
      title: this.editTitle(),
      content: this.editContent()
    };

    this.http.put<PageResponse>(`${this.apiUrl}/api/pages/${pageId}`, body).subscribe({
      next: (updatedPage) => {
        this.selectedPage.set(updatedPage);
        this.hasUnsavedChanges.set(false);
        this.isSaving.set(false);

        this.pageSummaries.update((list) =>
          list.map((p) =>
            p.id === pageId
              ? { ...p, title: body.title, updatedAt: updatedPage.updatedAt }
              : p
          )
        );
      },
      error: () => {
        this.isSaving.set(false);
      }
    });
  }

  startEditing(): void {
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    const page = this.selectedPage();
    if (page) {
      this.editTitle.set(page.title);
      this.editContent.set(page.content);
    }
    this.hasUnsavedChanges.set(false);
    this.isEditing.set(false);
  }

  exportPage(pageId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/pages/${pageId}/export`, {
      responseType: 'blob'
    });
  }
}
