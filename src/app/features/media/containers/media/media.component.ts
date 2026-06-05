import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MediaService } from '../../services/media.service';
import { MediaResponse } from '../../models/media.model';
import { PageResponsePagination } from '../../models/pagination.model';
import { MediaUploadComponent } from '../../components/media-upload/media-upload.component';
import { MediaGridComponent } from '../../components/media-grid/media-grid.component';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, RouterLink, MediaUploadComponent, MediaGridComponent],
  templateUrl: './media.component.html'
})
export class MediaComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mediaService = inject(MediaService);

  private destroy$ = new Subject<void>();

  mediaPage = signal<PageResponsePagination<MediaResponse> | null>(null);
  loading = signal<boolean>(true);
  isUploading = signal<boolean>(false);
  currentPage = signal<number>(0);
  search = signal<string>('');

  ngOnInit(): void {
    // Escuta mudanças de Query Params para carregar mídias de forma sincronizada com F5/URL
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const query = params.get('q') || '';
      const page = parseInt(params.get('page') || '0', 10);
      
      this.search.set(query);
      this.currentPage.set(page);
      
      this.fetchMedia(page, query);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchMedia(page: number, query: string): void {
    this.loading.set(true);
    this.mediaService.getMedia(page, 20, query.trim()).subscribe({
      next: (data) => {
        this.mediaPage.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  handleSearchChange(query: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null, page: 0 },
      queryParamsHandling: 'merge'
    });
  }

  handlePageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page || null },
      queryParamsHandling: 'merge'
    });
  }

  handleUploadFile(file: File): void {
    this.isUploading.set(true);
    this.mediaService.uploadMedia(file).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.handlePageChange(0); // Volta para a primeira página para mostrar a nova imagem
      },
      error: () => {
        this.isUploading.set(false);
        alert('Erro ao enviar a imagem.');
      }
    });
  }

  handleDeleteMedia(id: string): void {
    this.mediaService.deleteMedia(id).subscribe({
      next: () => {
        // Recarrega a página atual
        this.fetchMedia(this.currentPage(), this.search());
      },
      error: () => {
        alert('Erro ao apagar a imagem.');
      }
    });
  }
}
