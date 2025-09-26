export function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Headers - usando classes customizadas
  html = html.replace(/^######\s+(.*$)/gim, "<h6 class='markdown-h6'>$1</h6>");
  html = html.replace(/^#####\s+(.*$)/gim, "<h5 class='markdown-h5'>$1</h5>");
  html = html.replace(/^####\s+(.*$)/gim, "<h4 class='markdown-h4'>$1</h4>");
  html = html.replace(/^###\s+(.*$)/gim, "<h3 class='markdown-h3'>$1</h3>");
  html = html.replace(/^##\s+(.*$)/gim, "<h2 class='markdown-h2'>$1</h2>");
  html = html.replace(/^#\s+(.*$)/gim, "<h1 class='markdown-h1'>$1</h1>");

  // Bold e Italic - usando classes customizadas
  html = html.replace(
    /\*\*\*(.*?)\*\*\*/gim,
    "<strong class='markdown-strong'><em class='markdown-em'>$1</em></strong>"
  );
  html = html.replace(
    /\*\*(.*?)\*\*/gim,
    "<strong class='markdown-strong'>$1</strong>"
  );
  html = html.replace(/\*(.*?)\*/gim, "<em class='markdown-em'>$1</em>");

  // Code blocks - usando classes customizadas
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/gim,
    '<pre class="markdown-code-block"><code>$2</code></pre>'
  );
  html = html.replace(
    /```\n([\s\S]*?)```/gim,
    '<pre class="markdown-code-block"><code>$1</code></pre>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/gim,
    '<code class="markdown-code-inline">$1</code>'
  );

  // Images (ANTES dos links para não conflitar)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/gim,
    '<img src="$2" alt="$1" class="markdown-img" />'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>'
  );

  // Blockquotes
  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote class="markdown-blockquote">$1</blockquote>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr class="markdown-hr" />');

  // Task lists (checkboxes) - usando classes customizadas
  html = html.replace(
    /^- \[x\] (.*$)/gim,
    '<div class="markdown-task-item"><input type="checkbox" checked disabled class="markdown-task-checkbox"><span class="markdown-task-text-completed">$1</span></div>'
  );
  html = html.replace(
    /^- \[ \] (.*$)/gim,
    '<div class="markdown-task-item"><input type="checkbox" disabled class="markdown-task-checkbox"><span class="markdown-task-text">$1</span></div>'
  );

  // Numbered lists
  html = html.replace(
    /^\d+\. (.*$)/gim,
    '<li class="markdown-li numbered-item">$1</li>'
  );

  // Regular unordered lists (depois das task lists)
  html = html.replace(
    /^- (.*$)/gim,
    '<li class="markdown-li unordered-item">$1</li>'
  );

  // Tables - corrigir regex para capturar corretamente
  html = html.replace(/^\|(.+)\|/gim, (match, content) => {
    const cells = content
      .split("|")
      .map((cell: string) => cell.trim())
      .filter((cell) => cell);
    return `TABLE_ROW${cells
      .map((cell: string) => `<td class="markdown-td">${cell}</td>`)
      .join("")}END_TABLE_ROW`;
  });

  // Strikethrough
  html = html.replace(/~~(.*?)~~/gim, "<del class='markdown-del'>$1</del>");

  // Agrupar listas numeradas
  html = html.replace(
    /(<li class="markdown-li numbered-item">.*?<\/li>(\s*<li class="markdown-li numbered-item">.*?<\/li>)*)/gim,
    '<ol class="markdown-ol">$1</ol>'
  );
  html = html.replace(/ numbered-item/g, "");

  // Agrupar listas não ordenadas
  html = html.replace(
    /(<li class="markdown-li unordered-item">.*?<\/li>(\s*<li class="markdown-li unordered-item">.*?<\/li>)*)/gim,
    '<ul class="markdown-ul">$1</ul>'
  );
  html = html.replace(/ unordered-item/g, "");

  // Agrupar task lists
  html = html.replace(
    /(<div class="markdown-task-item">.*?<\/div>(\s*<div class="markdown-task-item">.*?<\/div>)*)/gim,
    '<div class="markdown-task-container">$1</div>'
  );

  // Agrupar tabelas PRIMEIRO (antes de processar quebras)
  html = html.replace(
    /(TABLE_ROW.*?END_TABLE_ROW(\s*TABLE_ROW.*?END_TABLE_ROW)*)/gim,
    (match) => {
      const rows = match.replace(/TABLE_ROW(.*?)END_TABLE_ROW/g, "<tr>$1</tr>");
      return `<table class="markdown-table"><tbody>${rows}</tbody></table>`;
    }
  );

  // Processar quebras de linha com mais cuidado
  // Apenas duplas quebras viram parágrafos, quebras simples viram <br> só quando necessário
  html = html.replace(/\n\n+/gim, "</p><p class='markdown-paragraph'>");

  // Quebras simples apenas em texto livre (não em elementos HTML)
  html = html.replace(/\n(?![<\s])/gim, "<br>");

  // Wrap em div principal
  html = `<div class='markdown-content'><p class='markdown-paragraph'>${html}</p></div>`;

  return html;
}
