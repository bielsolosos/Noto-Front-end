import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

const md: MarkdownIt = new MarkdownIt({
  html: true, // Enable HTML tags in source
  linkify: true, // Autoconvert URL-like text to links
  typographer: true, // Enable some language-neutral replacement + quotes beautification
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="markdown-code-block"><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="markdown-code-block"><code class="hljs">' +
      md.utils.escapeHtml(str) +
      "</code></pre>"
    );
  },
});

// Custom Renderer para adicionar classes customizadas aos tokens principais
md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const level = token.tag.slice(1);
  token.attrJoin("class", `markdown-h${level}`);
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-paragraph");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-link");
  tokens[idx].attrJoin("target", "_blank");
  tokens[idx].attrJoin("rel", "noopener noreferrer");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.blockquote_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-blockquote");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.bullet_list_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-ul");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.ordered_list_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-ol");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.list_item_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-li");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-table");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.th_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-td");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.td_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-td");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.hr = function (tokens, idx, options, env, self) {
  return '<hr class="markdown-hr" />\n';
};

md.renderer.rules.strong_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-strong");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.em_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-em");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.s_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrJoin("class", "markdown-del");
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  return `<code class="markdown-code-inline">${md.utils.escapeHtml(token.content)}</code>`;
};

// Custom rule for images with modal
md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex("src");
  const src = srcIndex >= 0 && token.attrs ? token.attrs[srcIndex][1] : "";
  const alt = token.content || "";

  return `<div class="markdown-img-container" data-image-src="${src}" data-image-alt="${alt}"><img src="${src}" alt="${alt}" class="markdown-img" /><div class="markdown-img-overlay"><span class="markdown-img-zoom-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21m0 0h4.8M3 21l6-6"/><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/><path d="M3 7.8V3m0 0h4.8M3 3l6 6"/></svg></span></div></div>`;
};

export function parseMarkdown(markdown: string): string {
  let rawHtml = md.render(markdown || "");

  // Post-processing for simple task lists
  rawHtml = rawHtml.replace(
    /<li class="markdown-li">\[x\] (.*?)<\/li>/gim,
    '<div class="markdown-task-item"><input type="checkbox" checked disabled class="markdown-task-checkbox"><span class="markdown-task-text-completed">$1</span></div>'
  );
  rawHtml = rawHtml.replace(
    /<li class="markdown-li">\[ \] (.*?)<\/li>/gim,
    '<div class="markdown-task-item"><input type="checkbox" disabled class="markdown-task-checkbox"><span class="markdown-task-text">$1</span></div>'
  );

  // Wrap em div principal
  return `<div class='markdown-content'>${rawHtml}</div>`;
}

// Função para abrir modal de imagem
export function openImageModal(src: string, alt: string): void {
  // Remove modal existente se houver
  const existingModal = document.getElementById("image-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Cria o modal
  const modal = document.createElement("div");
  modal.id = "image-modal";
  modal.className = "image-modal-overlay";
  modal.innerHTML = `
    <div class="image-modal-content">
      <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
      <img src="${src}" alt="${alt}" class="image-modal-img" />
      <div class="image-modal-caption">${alt}</div>
    </div>
  `;

  // Adiciona event listeners
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeImageModal();
    }
  });

  document.addEventListener("keydown", handleModalKeydown);
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
}

// Função para fechar modal de imagem
export function closeImageModal(): void {
  const modal = document.getElementById("image-modal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleModalKeydown);
  }
}

// Handler para teclas do modal
function handleModalKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    closeImageModal();
  }
}

// Torna as funções globalmente acessíveis
declare global {
  interface Window {
    openImageModal: (src: string, alt: string) => void;
    closeImageModal: () => void;
  }
}

if (typeof window !== "undefined") {
  window.openImageModal = openImageModal;
  window.closeImageModal = closeImageModal;
}
