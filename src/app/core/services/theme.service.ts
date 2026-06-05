import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();

    // Reagir a mudanças do signal e atualizar a classe no HTML
    effect(() => {
      const isDark = this.darkMode();
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
          localStorage.setItem('noto-theme', 'dark');
        } else {
          root.classList.remove('dark');
          localStorage.setItem('noto-theme', 'light');
        }
      }
    });
  }

  private initializeTheme(): void {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('noto-theme');
      if (savedTheme) {
        this.darkMode.set(savedTheme === 'dark');
      } else {
        // Fallback para preferência do sistema operacional
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.darkMode.set(prefersDark);
      }
    }
  }

  toggleDarkMode(): void {
    this.darkMode.update(dark => !dark);
  }
}
