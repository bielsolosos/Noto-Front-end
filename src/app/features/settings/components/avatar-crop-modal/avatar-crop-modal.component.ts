import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-avatar-crop-modal',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, ButtonComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div (click)="onClose()" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <!-- Modal Content -->
      <div class="relative bg-card text-foreground rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Cabeçalho -->
        <div class="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
          <h3 class="font-bold text-lg">Recortar Foto de Perfil</h3>
          <button (click)="onClose()" class="text-muted-foreground hover:text-foreground cursor-pointer">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Cropper -->
        <div class="p-6 flex-1 overflow-y-auto flex items-center justify-center bg-black/5 min-h-[300px]">
          <image-cropper
            *ngIf="imageChangedEvent"
            [imageChangedEvent]="imageChangedEvent"
            [maintainAspectRatio]="true"
            [aspectRatio]="1 / 1"
            [roundCropper]="true"
            format="jpeg"
            (imageCropped)="onImageCropped($event)"
            class="max-h-[350px] w-full"
          ></image-cropper>
        </div>

        <!-- Rodapé -->
        <div class="px-6 py-4 border-t border-border flex justify-end gap-3 shrink-0">
          <app-button variant="outline" (click)="onClose()">
            Cancelar
          </app-button>
          <app-button [loading]="isUploading" (click)="onUploadSubmit()">
            Salvar Foto
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class AvatarCropModalComponent {
  @Input() isOpen: boolean = false;
  @Input() imageChangedEvent: Event | null = null;
  @Input() isUploading: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() upload = new EventEmitter<File>();

  private croppedFile: File | null = null;

  onImageCropped(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.croppedFile = new File([event.blob], 'avatar.jpg', { type: 'image/jpeg' });
    }
  }

  onClose(): void {
    this.close.emit();
    this.croppedFile = null;
  }

  onUploadSubmit(): void {
    if (this.croppedFile) {
      this.upload.emit(this.croppedFile);
    } else {
      alert('Aguarde o processamento da imagem ou tente novamente.');
    }
  }
}
