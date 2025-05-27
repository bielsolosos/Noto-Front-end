export function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Headers (ordem importa - do maior para o menor)
  html = html.replace(
    /^###### (.*$)/gim,
    "<h6 class='text-base font-medium mt-4 mb-2 text-foreground'>$1</h6>"
  );
  html = html.replace(
    /^##### (.*$)/gim,
    "<h5 class='text-lg font-medium mt-4 mb-2 text-foreground'>$1</h5>"
  );
  html = html.replace(
    /^#### (.*$)/gim,
    "<h4 class='text-xl font-semibold mt-5 mb-3 text-foreground'>$1</h4>"
  );
  html = html.replace(
    /^### (.*$)/gim,
    "<h3 class='text-2xl font-semibold mt-6 mb-3 text-foreground'>$1</h3>"
  );
  html = html.replace(
    /^## (.*$)/gim,
    "<h2 class='text-3xl font-bold mt-8 mb-4 text-foreground'>$1</h2>"
  );
  html = html.replace(
    /^# (.*$)/gim,
    "<h1 class='text-4xl font-bold mt-8 mb-5 text-foreground border-b border-border pb-2'>$1</h1>"
  );

  // Bold e Italic (ordem importa)
  html = html.replace(
    /\*\*\*(.*?)\*\*\*/gim,
    "<strong class='font-bold text-primary'><em class='italic'>$1</em></strong>"
  );
  html = html.replace(
    /\*\*(.*?)\*\*/gim,
    "<strong class='font-bold text-primary'>$1</strong>"
  );
  html = html.replace(
    /\*(.*?)\*/gim,
    "<em class='italic text-muted-foreground'>$1</em>"
  );

  // Code blocks (antes do inline code)
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/gim,
    '<pre class="bg-muted/50 border border-border p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm"><code class="text-foreground">$2</code></pre>'
  );
  html = html.replace(
    /```\n([\s\S]*?)```/gim,
    '<pre class="bg-muted/50 border border-border p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm"><code class="text-foreground">$1</code></pre>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/gim,
    '<code class="bg-muted/70 border border-border px-2 py-1 rounded font-mono text-sm text-primary">$1</code>'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]$$([^)]+)$$/gim,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80 transition-colors">$1</a>'
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]$$([^)]+)$$/gim,
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg border border-border my-4 shadow-sm" />'
  );

  // Blockquotes
  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote class="border-l-4 border-primary bg-muted/30 ml-0 pl-4 py-2 my-4 italic text-muted-foreground rounded-r-md">$1</blockquote>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr class="border-t border-border my-8" />');

  // Task lists (checkboxes)
  html = html.replace(
    /^- \[x\] (.*$)/gim,
    '<div class="flex items-center my-2 group"><input type="checkbox" checked disabled class="mr-3 accent-primary scale-110"><span class="line-through text-muted-foreground">$1</span></div>'
  );
  html = html.replace(
    /^- \[ \] (.*$)/gim,
    '<div class="flex items-center my-2 group"><input type="checkbox" disabled class="mr-3 accent-primary scale-110"><span class="text-foreground">$1</span></div>'
  );

  // Numbered lists
  html = html.replace(
    /^\d+\. (.*$)/gim,
    "<li class='my-1 text-foreground ml-4'>$1</li>"
  );
  html = html.replace(
    /(<li.*<\/li>)/gim,
    '<ol class="list-decimal list-outside my-4 space-y-1 pl-6">$1</ol>'
  );

  // Regular unordered lists (depois das task lists)
  html = html.replace(
    /^- (.*$)/gim,
    "<li class='my-1 text-foreground'>$1</li>"
  );
  html = html.replace(
    /(<li.*<\/li>)/gim,
    '<ul class="list-disc list-outside my-4 space-y-1 pl-6">$1</ul>'
  );

  // Tables (básico)
  html = html.replace(/\|(.+)\|/gim, (match, content) => {
    const cells = content.split("|").map((cell: string) => cell.trim());
    return `<tr>${cells
      .map(
        (cell: string) =>
          `<td class="border border-border px-3 py-2 text-sm">${cell}</td>`
      )
      .join("")}</tr>`;
  });
  html = html.replace(
    /(<tr>.*<\/tr>)/gim,
    '<table class="w-full border-collapse border border-border rounded-lg my-4 overflow-hidden">$1</table>'
  );

  // Strikethrough
  html = html.replace(
    /~~(.*?)~~/gim,
    "<del class='line-through text-muted-foreground'>$1</del>"
  );

  // Line breaks e paragraphs
  html = html.replace(
    /\n\n/gim,
    "</p><p class='my-4 leading-relaxed text-foreground'>"
  );
  html = html.replace(/\n/gim, "<br>");

  // Wrap em div principal
  html = `<div class='prose prose-neutral dark:prose-invert max-w-none space-y-4'><p class='my-4 leading-relaxed text-foreground'>${html}</p></div>`;

  return html;
}
