import { Pipe, PipeTransform } from '@angular/core';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (str: string, lang: string): string => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre class="markdown-code-block"><code class="hljs">' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
              '</code></pre>'
            );
          } catch (__) {}
        }
        return (
          '<pre class="markdown-code-block"><code class="hljs">' +
          this.md.utils.escapeHtml(str) +
          '</code></pre>'
        );
      }
    });

    this.configureRules();
  }

  private configureRules(): void {
    // Custom render rules matching Noto's Next.js app
    this.md.renderer.rules['heading_open'] = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const level = token.tag.slice(1);
      token.attrJoin('class', `markdown-h${level}`);
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['paragraph_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-paragraph');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['link_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-link');
      tokens[idx].attrJoin('target', '_blank');
      tokens[idx].attrJoin('rel', 'noopener noreferrer');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['blockquote_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-blockquote');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['bullet_list_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-ul');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['ordered_list_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-ol');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['list_item_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-li');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['table_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-table');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['th_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-td');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['td_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-td');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['hr'] = () => {
      return '<hr class="markdown-hr" />\n';
    };

    this.md.renderer.rules['strong_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-strong');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['em_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-em');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['s_open'] = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'markdown-del');
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules['code_inline'] = (tokens, idx) => {
      const token = tokens[idx];
      return `<code class="markdown-code-inline">${this.md.utils.escapeHtml(token.content)}</code>`;
    };

    this.md.renderer.rules['image'] = (tokens, idx) => {
      const token = tokens[idx];
      const srcIndex = token.attrIndex('src');
      const src = srcIndex >= 0 && token.attrs ? token.attrs[srcIndex][1] : '';
      const alt = token.content || '';

      return `<div class="markdown-img-container" data-image-src="${src}" data-image-alt="${alt}">` +
        `<img src="${src}" alt="${alt}" class="markdown-img" />` +
        `<div class="markdown-img-overlay">` +
        `<span class="markdown-img-zoom-icon">` +
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
        `<path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21m0 0h4.8M3 21l6-6"/><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/><path d="M3 7.8V3m0 0h4.8M3 3l6 6"/>` +
        `</svg>` +
        `</span>` +
        `</div>` +
        `</div>`;
    };
  }

  transform(content: string | null | undefined): string {
    if (!content) return '';
    let rawHtml = this.md.render(content);

    // Pós-processamento para checklists
    rawHtml = rawHtml.replace(
      /<li class="markdown-li">\[x\] (.*?)<\/li>/gim,
      '<div class="markdown-task-item"><input type="checkbox" checked disabled class="markdown-task-checkbox"><span class="markdown-task-text-completed">$1</span></div>'
    );
    rawHtml = rawHtml.replace(
      /<li class="markdown-li">\[ \] (.*?)<\/li>/gim,
      '<div class="markdown-task-item"><input type="checkbox" disabled class="markdown-task-checkbox"><span class="markdown-task-text">$1</span></div>'
    );

    return `<div class="markdown-content">${rawHtml}</div>`;
  }
}

// Funções globais para exibir modal de imagem em tela cheia
export function openImageModal(src: string, alt: string): void {
  const existingModal = document.getElementById('image-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'image-modal';
  modal.className = 'image-modal-overlay';
  modal.innerHTML = `
    <div class="image-modal-content">
      <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
      <img src="${src}" alt="${alt}" class="image-modal-img" />
      <div class="image-modal-caption">${alt}</div>
    </div>
  `;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeImageModal();
    }
  });

  document.addEventListener('keydown', handleModalKeydown);
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

export function closeImageModal(): void {
  const modal = document.getElementById('image-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleModalKeydown);
  }
}

function handleModalKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    closeImageModal();
  }
}

declare global {
  interface Window {
    openImageModal: (src: string, alt: string) => void;
    closeImageModal: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.openImageModal = openImageModal;
  window.closeImageModal = closeImageModal;
}
