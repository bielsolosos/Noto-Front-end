import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <!-- Formulário de Busca -->
      <form (submit)="onSearchSubmit($event)" class="flex flex-1 gap-2 max-w-sm">
        <input
          type="text"
          placeholder="Buscar imagens..."
          [(ngModel)]="searchQuery"
          name="search"
          class="flex-1 h-10 px-3.5 text-xs rounded-lg border border-border/60 bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
        <button
          type="submit"
          class="h-10 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold cursor-pointer transition-colors"
        >
          Buscar
        </button>
      </form>

      <!-- Botão de Upload -->
      <div>
        <input
          #fileInput
          type="file"
          accept="image/*"
          class="hidden"
          (change)="onFileSelected($event)"
        />
        <button
          type="button"
          (click)="triggerFileInput()"
          [disabled]="isUploading"
          class="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
        >
          <i [class]="isUploading ? 'pi pi-spin pi-spinner' : 'pi pi-plus'"></i>
          <span>{{ isUploading ? 'Enviando...' : 'Nova Imagem' }}</span>
        </button>
      </div>
    </div>
  `
})
export class MediaUploadComponent {
  @Input() searchQuery: string = '';
  @Input() isUploading: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() uploadFile = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.searchChange.emit(this.searchQuery);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile.emit(file);
      input.value = '';
    }
  }
}
