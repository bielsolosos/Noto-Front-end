"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotes } from "@/contexts/NotesContext";
import { parseMarkdown } from "@/lib/markdownParser";
import {
  Bold,
  Code,
  Edit3,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Quote,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function NoteEditor() {
  const { editTitle, editContent, handleTitleChange, handleContentChange } =
    useNotes();

  // Estado com localStorage para persistir o modo preferido
  const [previewMode, setPreviewMode] = useState<"edit" | "preview" | "split">(
    () => {
      if (typeof window !== "undefined") {
        return (
          (localStorage.getItem("noteEditorMode") as
            | "edit"
            | "preview"
            | "split") || "edit"
        );
      }
      return "edit";
    }
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Salvar no localStorage quando o modo mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("noteEditorMode", previewMode);
    }
  }, [previewMode]);

  // Sistema de Undo/Redo
  const [history, setHistory] = useState<string[]>([editContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  // Adicionar ao histórico apenas quando não é undo/redo
  useEffect(() => {
    if (!isUndoRedo && editContent !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(editContent);

      // Limitar histórico a 50 entradas para performance
      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        setHistoryIndex(historyIndex + 1);
      }

      setHistory(newHistory);
    }
    setIsUndoRedo(false);
  }, [editContent, history, historyIndex, isUndoRedo]);

  // Funções de Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      setHistoryIndex(historyIndex - 1);
      handleContentChange(history[historyIndex - 1]);
    }
  }, [historyIndex, history, handleContentChange]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      setHistoryIndex(historyIndex + 1);
      handleContentChange(history[historyIndex + 1]);
    }
  }, [historyIndex, history, handleContentChange]);

  // Função para inserir texto no cursor
  const insertTextAtCursor = useCallback(
    (
      beforeText: string,
      afterText: string = "",
      selectText: boolean = false
    ) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editContent.substring(start, end);

      const newText =
        selectText && selectedText
          ? beforeText + selectedText + afterText
          : beforeText + afterText;

      const newContent =
        editContent.substring(0, start) + newText + editContent.substring(end);

      handleContentChange(newContent);

      // Reposicionar cursor
      setTimeout(() => {
        const newCursorPos =
          selectText && selectedText
            ? start + beforeText.length + selectedText.length + afterText.length
            : start + beforeText.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [editContent, handleContentChange]
  );

  // Funções para formatação
  const insertBold = () => insertTextAtCursor("**", "**", true);
  const insertItalic = () => insertTextAtCursor("*", "*", true);
  const insertH1 = () => insertTextAtCursor("# ", "");
  const insertH2 = () => insertTextAtCursor("## ", "");
  const insertH3 = () => insertTextAtCursor("### ", "");
  const insertCode = () => insertTextAtCursor("`", "`", true);
  const insertQuote = () => insertTextAtCursor("> ", "");
  const insertList = () => insertTextAtCursor("- ", "");
  const insertOrderedList = () => insertTextAtCursor("1. ", "");
  const insertLink = () => insertTextAtCursor("[", "](url)");

  // Interceptor de Ctrl+V para imagens
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData("text");

      if (
        pastedText &&
        (pastedText.match(/\.(jpeg|jpg|gif|png|svg|webp|bmp)$/i) ||
          pastedText.includes("imgur.com") ||
          pastedText.includes("cdn.") ||
          pastedText.includes("images."))
      ) {
        e.preventDefault();
        insertTextAtCursor(`![Imagem](${pastedText})`, "");
      }
    },
    [insertTextAtCursor]
  );

  // Função inteligente para handling de Enter
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const lines = editContent.substring(0, start).split("\n");
        const currentLine = lines[lines.length - 1];

        // Lista não ordenada (- item)
        const unorderedListMatch = currentLine.match(/^(\s*)-\s(.*)$/);
        if (unorderedListMatch) {
          e.preventDefault();
          const indent = unorderedListMatch[1];
          const content = unorderedListMatch[2];

          if (content.trim() === "") {
            // Se a linha está vazia, remove o marcador
            const newContent =
              editContent.substring(0, start - currentLine.length) +
              indent +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              textarea.setSelectionRange(
                start - currentLine.length + indent.length,
                start - currentLine.length + indent.length
              );
            }, 0);
          } else {
            // Adiciona nova linha com marcador
            const newContent =
              editContent.substring(0, start) +
              "\n" +
              indent +
              "- " +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              const newPos = start + indent.length + 3;
              textarea.setSelectionRange(newPos, newPos);
            }, 0);
          }
          return;
        }

        // Lista ordenada (1. item)
        const orderedListMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);
        if (orderedListMatch) {
          e.preventDefault();
          const indent = orderedListMatch[1];
          const number = parseInt(orderedListMatch[2]);
          const content = orderedListMatch[3];

          if (content.trim() === "") {
            // Se a linha está vazia, remove o marcador
            const newContent =
              editContent.substring(0, start - currentLine.length) +
              indent +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              textarea.setSelectionRange(
                start - currentLine.length + indent.length,
                start - currentLine.length + indent.length
              );
            }, 0);
          } else {
            // Adiciona nova linha com próximo número
            const nextNumber = number + 1;
            const newContent =
              editContent.substring(0, start) +
              "\n" +
              indent +
              nextNumber +
              ". " +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              const newPos =
                start + indent.length + nextNumber.toString().length + 3;
              textarea.setSelectionRange(newPos, newPos);
            }, 0);
          }
          return;
        }

        // Citação (> texto)
        const quoteMatch = currentLine.match(/^(\s*)>\s(.*)$/);
        if (quoteMatch) {
          e.preventDefault();
          const indent = quoteMatch[1];
          const content = quoteMatch[2];

          if (content.trim() === "") {
            // Se a linha está vazia, remove o marcador
            const newContent =
              editContent.substring(0, start - currentLine.length) +
              indent +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              textarea.setSelectionRange(
                start - currentLine.length + indent.length,
                start - currentLine.length + indent.length
              );
            }, 0);
          } else {
            // Adiciona nova linha de citação
            const newContent =
              editContent.substring(0, start) +
              "\n" +
              indent +
              "> " +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              const newPos = start + indent.length + 3;
              textarea.setSelectionRange(newPos, newPos);
            }, 0);
          }
          return;
        }

        // Task lists (- [ ] item ou - [x] item)
        const taskMatch = currentLine.match(/^(\s*)-\s\[([ x])\]\s(.*)$/);
        if (taskMatch) {
          e.preventDefault();
          const indent = taskMatch[1];
          const content = taskMatch[3];

          if (content.trim() === "") {
            // Se a linha está vazia, remove o marcador
            const newContent =
              editContent.substring(0, start - currentLine.length) +
              indent +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              textarea.setSelectionRange(
                start - currentLine.length + indent.length,
                start - currentLine.length + indent.length
              );
            }, 0);
          } else {
            // Adiciona nova task não marcada
            const newContent =
              editContent.substring(0, start) +
              "\n" +
              indent +
              "- [ ] " +
              editContent.substring(start);
            handleContentChange(newContent);
            setTimeout(() => {
              const newPos = start + indent.length + 6;
              textarea.setSelectionRange(newPos, newPos);
            }, 0);
          }
          return;
        }
      }
    },
    [editContent, handleContentChange]
  );

  // Auto-focus no textarea quando entra em modo de edição
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + P para alternar preview
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        const modes: Array<"edit" | "preview" | "split"> = [
          "edit",
          "split",
          "preview",
        ];
        const currentIndex = modes.indexOf(previewMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setPreviewMode(nextMode);
      }

      // Ctrl/Cmd + Shift + F para fullscreen
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }

      // Atalhos de formatação
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        insertBold();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        insertItalic();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        insertLink();
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ((e.shiftKey && e.key === "Z") || e.key === "y")
      ) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, [
    previewMode,
    isFullscreen,
    insertBold,
    insertItalic,
    insertLink,
    handlePaste,
    undo,
    redo,
  ]);

  return (
    <div
      className={`transition-all duration-300 opacity-100 translate-y-0 ${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
      }`}
    >
      <div
        className={`${
          isFullscreen ? "h-full p-4" : "max-w-7xl mx-auto p-4 md:p-8"
        }`}
      >
        {/* Header com título */}
        <div className="mb-6">
          <Input
            value={editTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título da entrada..."
            className="text-2xl md:text-4xl font-bold border-none p-0 mb-4 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Barra de ferramentas */}
          <div className="flex items-center gap-2 mb-4 p-2 border rounded-lg bg-muted/50">
            <Button
              variant={previewMode === "edit" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("edit")}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Editor
            </Button>

            <Button
              variant={previewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("split")}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Split
            </Button>

            <Button
              variant={previewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("preview")}
              className="flex items-center gap-2"
            >
              <EyeOff className="w-4 h-4" />
              Preview
            </Button>

            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-2"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
                {isFullscreen ? "Sair" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de formatação */}
        {(previewMode === "edit" || previewMode === "split") && (
          <div className="flex flex-wrap items-center gap-1 p-2 mb-2 border rounded-lg bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={insertBold}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertItalic}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={insertH1}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertH2}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertH3}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={insertList}
              title="Lista"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertOrderedList}
              title="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={insertQuote}
              title="Citação"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertCode}
              title="Código"
            >
              <Code className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertLink}
              title="Link (Ctrl+K)"
            >
              <Link className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertTextAtCursor("![Alt text](", ")")}
              title="Imagem"
            >
              <Image className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Área do Editor */}
        <div
          className={`border rounded-lg overflow-hidden ${
            isFullscreen
              ? "h-[calc(100vh-300px)]"
              : "h-[calc(100vh-320px)] min-h-[700px]"
          }`}
        >
          {/* Modo apenas Editor */}
          {previewMode === "edit" && (
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escreva seus pensamentos aqui usando Markdown..."
              className="w-full h-full p-6 bg-background text-foreground resize-none focus:outline-none border-0"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            />
          )}

          {/* Modo apenas Preview */}
          {previewMode === "preview" && (
            <div className="w-full h-full p-6 bg-background overflow-y-auto">
              <div
                className="prose prose-sm md:prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: editContent
                    ? parseMarkdown(editContent)
                    : "<p class='text-muted-foreground italic'>Preview aparecerá aqui quando você escrever algo...</p>",
                }}
              />
            </div>
          )}

          {/* Modo Split */}
          {previewMode === "split" && (
            <div className="flex h-full">
              {/* Editor lado esquerdo */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escreva seus pensamentos aqui usando Markdown..."
                  className="w-full h-full p-4 bg-background text-foreground resize-none focus:outline-none border-0 absolute inset-0"
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                />
              </div>

              {/* Divisor vertical */}
              <div className="w-px bg-border flex-shrink-0"></div>

              {/* Preview lado direito */}
              <div className="flex-1 relative">
                <div className="w-full h-full p-4 bg-background overflow-y-auto absolute inset-0">
                  <div
                    className="prose prose-sm prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: editContent
                        ? parseMarkdown(editContent)
                        : "<p class='text-muted-foreground italic'>Preview aparecerá aqui...</p>",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dicas de atalhos */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Atalhos:</strong>
            <span className="mx-2">Ctrl+Z desfazer</span>
            <span className="mx-2">Ctrl+Y refazer</span>
            <span className="mx-2">Ctrl+B bold</span>
            <span className="mx-2">Ctrl+I italic</span>
            <span className="mx-2">Ctrl+K link</span>
            <span className="mx-2">
              Enter em listas = continua automaticamente
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
