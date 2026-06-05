import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <h2 class="text-lg font-bold border-b border-border/80 pb-2 text-foreground">
        Segurança & Senha
      </h2>

      <!-- Feedback de Mensagens -->
      @if (successMessage) {
        <div class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold animate-fade-in">
          {{ successMessage }}
        </div>
      }
      @if (errorMessage) {
        <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold animate-fade-in">
          {{ errorMessage }}
        </div>
      }

      <div class="space-y-4">
        <app-input
          label="Senha Atual"
          type="password"
          formControlName="oldPassword"
          placeholder="Digite sua senha atual"
        ></app-input>

        <app-input
          label="Nova Senha"
          type="password"
          formControlName="newPassword"
          placeholder="Mínimo 6 caracteres"
        ></app-input>

        <app-input
          label="Confirmar Nova Senha"
          type="password"
          formControlName="confirmPassword"
          placeholder="Repita a nova senha"
        >
          @if (passwordForm.touched && passwordForm.errors?.['passwordMismatch']) {
            <span class="absolute right-0 bottom-[-18px] text-[10px] text-red-500 font-medium animate-fade-in">
              As senhas não coincidem.
            </span>
          }
        </app-input>
      </div>

      <app-button
        type="submit"
        [loading]="isChangingPassword"
        customClass="rounded-xl h-10 w-full sm:w-auto font-bold"
      >
        Alterar Senha
      </app-button>
    </form>
  `
})
export class PasswordFormComponent {
  @Input() isChangingPassword: boolean = false;
  @Input() successMessage: string | null = null;
  @Input() errorMessage: string | null = null;

  @Output() submitForm = new EventEmitter<any>();

  private fb = new FormBuilder();
  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.passwordForm.value);
  }

  resetForm(): void {
    this.passwordForm.reset();
  }
}
