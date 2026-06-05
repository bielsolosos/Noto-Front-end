import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserResponse } from '../../../login/models/user.model';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form [formGroup]="credentialsForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <h2 class="text-lg font-bold border-b border-border/80 pb-2 text-foreground">
        Dados do Perfil
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
          label="Usuário"
          type="text"
          formControlName="username"
          placeholder="Nome de usuário"
        ></app-input>

        <app-input
          label="E-mail"
          type="email"
          formControlName="email"
          placeholder="exemplo@email.com"
        ></app-input>
      </div>

      <app-button
        type="submit"
        [loading]="isUpdatingProfile"
        customClass="rounded-xl h-10 w-full sm:w-auto"
      >
        Atualizar Perfil
      </app-button>
    </form>
  `
})
export class ProfileFormComponent implements OnInit {
  @Input() currentUser: UserResponse | null = null;
  @Input() isUpdatingProfile: boolean = false;
  @Input() successMessage: string | null = null;
  @Input() errorMessage: string | null = null;

  @Output() submitForm = new EventEmitter<any>();

  private fb = new FormBuilder();
  credentialsForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    if (this.currentUser) {
      this.credentialsForm.patchValue({
        username: this.currentUser.username,
        email: this.currentUser.email
      });
    }
  }

  onSubmit(): void {
    if (this.credentialsForm.invalid) return;
    this.submitForm.emit(this.credentialsForm.value);
  }
}
