import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MarkdownPipe],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  themeService = inject(ThemeService);

  demoContent = signal<string>(
    '# Bem-vindo ao NOTO\n\n**Organize** suas *ideias* de forma `simples` e eficiente.\n\n- [x] Editor intuitivo\n- [x] Markdown em tempo real\n- [ ] Suas próximas grandes ideias\n\n> "A simplicidade é a sofisticação suprema" - Leonardo da Vinci'
  );

  features = [
    {
      iconClass: 'pi pi-pencil',
      title: 'Editor Markdown Inteligente',
      description: 'Formatação automática conforme você digita. Listas, títulos, links - tudo funciona naturalmente.'
    },
    {
      iconClass: 'pi pi-bolt',
      title: 'Atalhos Poderosos',
      description: 'Ctrl+B para negrito, Ctrl+I para itálico, Enter para continuar listas. Produtividade máxima.'
    },
    {
      iconClass: 'pi pi-palette',
      title: 'Design que não Distrai',
      description: 'Interface limpa e minimalista. Foque no que importa: seu conteúdo.'
    },
    {
      iconClass: 'pi pi-lock',
      title: 'Privado por Design',
      description: 'Suas anotações ficam seguras. Cada página é privada e pertence apenas a você.'
    }
  ];

  scrollToDemo(event: Event): void {
    event.preventDefault();
    const demoElement = document.getElementById('demo-section');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
