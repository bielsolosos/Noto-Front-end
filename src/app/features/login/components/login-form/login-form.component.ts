import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <div class="space-y-4">
        <app-input
          label="Usuário"
          type="text"
          formControlName="username"
          placeholder="Nome de usuário"
        ></app-input>

        <app-input
          label="Senha"
          [type]="showPassword() ? 'text' : 'password'"
          formControlName="password"
          placeholder="Senha de acesso"
        >
          <button
            type="button"
            (click)="togglePasswordVisibility()"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
            aria-label="Alternar visualização da senha"
          >
            <i [class]="showPassword() ? 'pi pi-eye-slash text-primary' : 'pi pi-eye text-primary'"></i>
          </button>
        </app-input>
      </div>

      <app-button
        type="submit"
        [loading]="isLoading"
        customClass="w-full h-11 rounded-xl"
      >
        Entrar
      </app-button>
    </form>
  `
})
export class LoginFormComponent {
  @Input() isLoading: boolean = false;
  @Output() submitForm = new EventEmitter<any>();

  showPassword = signal<boolean>(false);

  private fb = new FormBuilder();
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.loginForm.value);
  }
}
