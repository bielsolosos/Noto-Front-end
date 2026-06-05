import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';
import { NoteViewerComponent } from '../../components/note-viewer/note-viewer.component';
import { NotesService } from '../../services/notes.service';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../login/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { MediaService } from '../../../media/services/media.service';

@Component({
  selector: 'app-editor-parent',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NoteEditorComponent, NoteViewerComponent],
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  notesService = inject(NotesService);
  sidebarService = inject(SidebarService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  mediaService = inject(MediaService);

  private destroy$ = new Subject<void>();
  isExportDropdownOpen = signal<boolean>(false);

  constructor() {
    // Escuta carregamento finalizado da lista e tenta redirecionar se estiver sem ID
    effect(() => {
      const loading = this.notesService.isLoadingList();
      const selectedId = this.notesService.selectedPageId();
      if (!loading && !selectedId) {
        this.redirectToFirstPageIfAvailable();
      }
    });
  }

  ngOnInit(): void {
    // 1. Carrega os resumos das notas
    this.notesService.refreshPageList();

    // 2. Escuta mudanças de parâmetro de rota (id da nota ativa)
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.notesService.selectedPageId.set(id);
      } else {
        this.notesService.selectedPageId.set(null);
        this.redirectToFirstPageIfAvailable();
      }
    });

    // 3. Escuta mudanças de busca via Query Params (q)
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const q = params.get('q') || '';
      this.notesService.searchQuery.set(q);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private redirectToFirstPageIfAvailable(): void {
    const list = this.notesService.pageSummaries();
    if (list.length > 0 && !this.notesService.selectedPageId()) {
      this.router.navigate(['/editor', list[0].id], { queryParamsHandling: 'merge' });
    }
  }

  handleSelectPage(id: string): void {
    this.router.navigate(['/editor', id], { queryParamsHandling: 'merge' });
  }

  handleSearchChange(query: string): void {
    this.notesService.searchQuery.set(query);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null },
      queryParamsHandling: 'merge'
    });
  }

  handleCreatePage(): void {
    this.notesService.createNewPage((newPage) => {
      this.router.navigate(['/editor', newPage.id], { queryParamsHandling: 'merge' });
      this.notesService.isEditing.set(true);
    });
  }

  handleDeletePage(id: string): void {
    this.notesService.deletePage(id, () => {
      if (this.notesService.selectedPageId() === id) {
        this.notesService.selectedPageId.set(null);
        const list = this.notesService.pageSummaries().filter(p => p.id !== id);
        if (list.length > 0) {
          this.router.navigate(['/editor', list[0].id], { queryParamsHandling: 'merge' });
        } else {
          this.router.navigate(['/editor'], { queryParamsHandling: 'merge' });
        }
      }
      this.notesService.refreshPageList();
    });
  }

  handleContentChange(newContent: string): void {
    this.notesService.editContent.set(newContent);
    this.notesService.hasUnsavedChanges.set(true);
  }

  handleAutoSave(): void {
    this.notesService.autoSavePage();
  }

  handleUploadImage(event: { file: File; callback: (markdown: string) => void }): void {
    this.mediaService.uploadMedia(event.file).subscribe({
      next: (res) => event.callback(res.markdown),
      error: () => event.callback('')
    });
  }

  handleLogout(): void {
    this.authService.logout();
  }

  // Lógica de exportação reposicionada
  toggleExportDropdown(): void {
    this.isExportDropdownOpen.update(open => !open);
  }

  exportNote(): void {
    const page = this.notesService.selectedPage();
    if (!page) return;

    this.isExportDropdownOpen.set(false);
    this.notesService.exportPage(page.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${page.title || 'nota'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao exportar nota:', err);
      }
    });
  }
}
