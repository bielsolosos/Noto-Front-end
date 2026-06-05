import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaResponse } from '../../models/media.model';
import { PageResponsePagination } from '../../models/pagination.model';

@Component({
  selector: 'app-media-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Conteúdo Principal -->
    <div *ngIf="loading" class="flex justify-center items-center py-16">
      <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
    </div>

    <ng-container *ngIf="!loading">
      <div *ngIf="!mediaPage || mediaPage.content.length === 0" class="text-center py-16 border-2 border-dashed border-border/60 rounded-xl animate-fade-in">
        <i class="pi pi-image text-5xl text-muted-foreground/30 mb-4 block"></i>
        <h3 class="text-lg font-bold">Nenhuma imagem encontrada</h3>
        <p class="text-muted-foreground text-xs mt-1">
          Faça o upload de uma imagem para começar a usar a galeria.
        </p>
      </div>

      <div *ngIf="mediaPage && mediaPage.content.length > 0" class="space-y-8 animate-fade-in">
        <!-- Grid de Imagens -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (media of mediaPage.content; track media.id) {
            <div
              class="group relative bg-background rounded-xl border border-border/60 overflow-hidden hover:border-primary/40 transition-colors shadow-sm"
            >
              <div class="aspect-square relative flex items-center justify-center bg-black/5 p-2">
                <img
                  [src]="media.url"
                  [alt]="media.fileName"
                  class="object-contain w-full h-full rounded"
                />
              </div>
              
              <div class="p-3 bg-card border-t border-border/40">
                <p class="text-xs font-semibold truncate mb-3 text-foreground" [title]="media.fileName">
                  {{ media.fileName }}
                </p>
                
                <div class="flex gap-2">
                  <button
                    type="button"
                    (click)="copyToClipboard(media.markdown || '![](' + media.url + ')')"
                    class="flex-1 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    title="Copiar atalho Markdown"
                  >
                    <i class="pi pi-copy text-xs"></i>
                    <span>Copiar MD</span>
                  </button>
                  
                  <button
                    type="button"
                    (click)="handleDelete(media.id)"
                    class="h-8 w-8 shrink-0 rounded-lg hover:bg-red-500/15 text-muted-foreground hover:text-red-500 flex items-center justify-center cursor-pointer transition-colors"
                    title="Apagar imagem"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Controle de Paginação -->
        <div *ngIf="mediaPage.totalPages > 1" class="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-border/60">
          <button
            type="button"
            [disabled]="mediaPage.first"
            (click)="onPageChange(currentPage - 1)"
            class="h-9 px-4 rounded-lg border border-border bg-background hover:bg-primary/10 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:hover:bg-background"
          >
            Anterior
          </button>
          
          <span class="text-xs text-muted-foreground">
            Página {{ mediaPage.number + 1 }} de {{ mediaPage.totalPages }}
          </span>
          
          <button
            type="button"
            [disabled]="mediaPage.last"
            (click)="onPageChange(currentPage + 1)"
            class="h-9 px-4 rounded-lg border border-border bg-background hover:bg-primary/10 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:hover:bg-background"
          >
            Próxima
          </button>
        </div>
      </div>
    </ng-container>
  `
})
export class MediaGridComponent {
  @Input() mediaPage: PageResponsePagination<MediaResponse> | null = null;
  @Input() loading: boolean = false;
  @Input() currentPage: number = 0;

  @Output() deleteMedia = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link Markdown copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar:', err);
    });
  }

  handleDelete(id: string): void {
    if (confirm('Tem certeza que deseja apagar esta imagem?')) {
      this.deleteMedia.emit(id);
    }
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
