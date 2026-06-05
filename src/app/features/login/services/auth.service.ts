import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserResponse, TokenResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  currentUser = signal<UserResponse | null>(null);
  isLoading = signal<boolean>(true);

  constructor() {
    this.initializeSession();
  }

  private initializeSession(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.fetchUser().subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.isLoading.set(false);
        },
        error: () => {
          this.logout();
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  login(username: string, password: string): Observable<TokenResponse> {
    this.isLoading.set(true);
    return this.http.post<TokenResponse>(`${this.apiUrl}/api/auth/login`, { username, password }).pipe(
      tap({
        next: (response) => {
          localStorage.setItem('accessToken', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.fetchUser().subscribe((user) => {
            this.currentUser.set(user);
            this.isLoading.set(false);
            this.router.navigate(['/editor']);
          });
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<TokenResponse>(`${this.apiUrl}/api/auth/refresh`, { refreshToken }).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      })
    );
  }

  fetchUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/api/me`);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUser.set(null);
    this.isLoading.set(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return !!user && user.roles.includes('ROLE_ADMIN');
  }
}
