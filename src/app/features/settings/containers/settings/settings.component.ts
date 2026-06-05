import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../login/services/auth.service';
import { MediaService } from '../../../media/services/media.service';
import { ProfileFormComponent } from '../../components/profile-form/profile-form.component';
import { PasswordFormComponent } from '../../components/password-form/password-form.component';
import { AvatarCropModalComponent } from '../../components/avatar-crop-modal/avatar-crop-modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfileFormComponent, PasswordFormComponent, AvatarCropModalComponent],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  authService = inject(AuthService);
  private mediaService = inject(MediaService);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('passwordFormRef') passwordFormRef!: PasswordFormComponent;

  // Estados de feedback e carregamento
  isUpdatingProfile = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);
  isUploadingAvatar = signal<boolean>(false);
  
  credentialsSuccess = signal<string | null>(null);
  credentialsError = signal<string | null>(null);
  passwordSuccess = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  // Estados do Crop de Avatar
  isCropModalOpen = signal<boolean>(false);
  imageChangedEvent: Event | null = null;

  userInitial(): string {
    const user = this.authService.currentUser();
    return user ? user.username.charAt(0).toUpperCase() : 'U';
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Selecione um arquivo de imagem válido.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB max
        alert('A imagem deve ter no máximo 2MB.');
        return;
      }

      this.imageChangedEvent = event;
      this.isCropModalOpen.set(true);
    }
  }

  handleUploadAvatar(croppedFile: File): void {
    this.isUploadingAvatar.set(true);
    this.mediaService.uploadProfileImage(croppedFile).subscribe({
      next: () => {
        this.isUploadingAvatar.set(false);
        this.isCropModalOpen.set(false);
        this.imageChangedEvent = null;
        
        // Atualiza os dados do usuário ativo na sessão
        this.authService.fetchUser().subscribe(user => {
          this.authService.currentUser.set(user);
        });
      },
      error: () => {
        this.isUploadingAvatar.set(false);
        alert('Erro ao enviar foto de perfil.');
      }
    });
  }

  handleCloseCropModal(): void {
    this.isCropModalOpen.set(false);
    this.imageChangedEvent = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  handleSubmitCredentials(formValue: any): void {
    this.isUpdatingProfile.set(true);
    this.credentialsSuccess.set(null);
    this.credentialsError.set(null);

    this.http.post(`${this.apiUrl}/api/users/edit-credentials`, formValue).subscribe({
      next: () => {
        this.isUpdatingProfile.set(false);
        this.credentialsSuccess.set('Dados atualizados com sucesso!');
        this.authService.fetchUser().subscribe(user => {
          this.authService.currentUser.set(user);
        });
      },
      error: (err) => {
        this.isUpdatingProfile.set(false);
        this.credentialsError.set(err.error?.message || 'Erro ao atualizar credenciais.');
      }
    });
  }

  handleSubmitPassword(formValue: any): void {
    this.isChangingPassword.set(true);
    this.passwordSuccess.set(null);
    this.passwordError.set(null);

    this.http.post(`${this.apiUrl}/api/users/change-password`, formValue).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.passwordSuccess.set('Senha alterada com sucesso!');
        if (this.passwordFormRef) {
          this.passwordFormRef.resetForm();
        }
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.passwordError.set(err.error?.message || 'Erro ao alterar senha.');
      }
    });
  }
}
