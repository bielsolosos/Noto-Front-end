import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginFormComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  themeService = inject(ThemeService);

  errorMessage = signal<string | null>(null);
  isLoading = computed(() => this.authService.isLoading());

  onLoginSubmit(credentials: any): void {
    const { username, password } = credentials;
    this.errorMessage.set(null);

    this.authService.login(username, password).subscribe({
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage.set('Usuário ou senha inválidos.');
      }
    });
  }
}
