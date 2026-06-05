import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div (click)="onClose()" class="absolute inset-0"></div>

      <div class="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
        <div>
          <h3 class="text-lg font-bold">Criar Novo Usuário</h3>
          <p class="text-xs text-muted-foreground mt-1">Preencha as credenciais do novo usuário no sistema.</p>
        </div>

        @if (error) {
          <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg font-medium animate-fade-in">
            {{ error }}
          </div>
        }

        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <app-input
            label="Nome de Usuário"
            type="text"
            formControlName="username"
            placeholder="Nome de usuário"
          ></app-input>

          <app-input
            label="Email"
            type="email"
            formControlName="email"
            placeholder="Email de acesso"
          ></app-input>

          <app-input
            label="Senha"
            type="password"
            formControlName="password"
            placeholder="Mínimo 6 caracteres"
          ></app-input>

          <app-input
            label="Confirmar Senha"
            type="password"
            formControlName="confirmPassword"
            placeholder="Confirme a senha acima"
          >
            @if (userForm.hasError('passwordMismatch') && userForm.get('confirmPassword')?.touched) {
              <span class="absolute right-0 bottom-[-18px] text-[10px] text-red-500 font-medium animate-fade-in">
                As senhas não coincidem.
              </span>
            }
          </app-input>

          <div class="flex items-center justify-end gap-3 pt-2">
            <app-button variant="outline" (click)="onClose()">
              Cancelar
            </app-button>
            <app-button type="submit" [loading]="isSubmitting" [disabled]="userForm.invalid">
              Criar Usuário
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateUserModalComponent {
  @Input() isOpen: boolean = false;
  @Input() isSubmitting: boolean = false;
  @Input() error: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() createUser = new EventEmitter<any>();

  private fb = new FormBuilder();
  userForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onClose(): void {
    this.close.emit();
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.createUser.emit(this.userForm.value);
  }
}
