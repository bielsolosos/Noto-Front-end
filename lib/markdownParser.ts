export function parseMarkdown(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3 class='text-xl font-semibold mt-6 mb-3 text-foreground'>$1</h3>")
  html = html.replace(/^## (.*$)/gim, "<h2 class='text-2xl font-semibold mt-8 mb-4 text-foreground'>$1</h2>")
  html = html.replace(/^# (.*$)/gim, "<h1 class='text-3xl font-bold mt-8 mb-5 text-foreground'>$1</h1>")

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong class='font-semibold text-primary'>$1</strong>")

  // Italic
  html = html.replace(/\*(.*?)\*/gim, "<em class='italic text-muted-foreground'>$1</em>")

  // Code blocks
  html = html.replace(
    /```[\s\S]*?\n([\s\S]*?)```/gim,
    '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4 border-l-4 border-primary"><code class="font-mono text-sm text-foreground">$1</code></pre>',
  )

  // Inline code
  html = html.replace(
    /`([^`]+)`/gim,
    '<code class="bg-muted px-2 py-1 rounded font-mono text-sm text-primary">$1</code>',
  )

  // Links
  html = html.replace(
    /\[([^\]]+)\]$$([^)]+)$$/gim,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>',
  )

  // Blockquotes
  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote class="border-l-4 border-primary ml-0 pl-4 my-4 bg-muted rounded-r-lg py-2 italic text-muted-foreground">$1</blockquote>',
  )

  // Task lists
  html = html.replace(
    /^- \[x\] (.*$)/gim,
    '<div class="flex items-center my-2"><input type="checkbox" checked disabled class="mr-2 accent-primary"><span class="line-through text-muted-foreground">$1</span></div>',
  )
  html = html.replace(
    /^- \[ \] (.*$)/gim,
    '<div class="flex items-center my-2"><input type="checkbox" disabled class="mr-2 accent-primary"><span class="text-foreground">$1</span></div>',
  )

  // Regular lists
  html = html.replace(/^- (.*$)/gim, "<li class='my-1 text-foreground'>$1</li>")
  html = html.replace(/(<li.*<\/li>)/gims, '<ul class="list-disc list-inside my-4 space-y-1">$1</ul>')

  // Line breaks
  html = html.replace(/\n\n/gim, "</p><p class='my-4 leading-relaxed text-foreground'>")
  html = html.replace(/\n/gim, "<br>")

  // Wrap in paragraph
  html = `<div class='prose prose-neutral dark:prose-invert max-w-none'><p class='my-4 leading-relaxed text-foreground'>${html}</p></div>`

  return html
}
