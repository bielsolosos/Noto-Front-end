"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotes } from "@/contexts/NotesContext";
import { parseMarkdown } from "@/lib/markdownParser";
import { uploadMedia } from "@/lib/media";
/**
 * NOTO - Note Editor Component (v2.0 - CodeMirror 6 Migration)
 * -----------------------------------------------------------
 * Este componente é o coração da edição no Noto. Ele utiliza o CodeMirror 6
 * como motor principal para garantir performance, conformidade com CommonMark
 * e uma experiência de escrita "premium".
 * 
 * ARQUITETURA E FLUXO:
 * 
 * 1. MOTOR (CodeMirror 6):
 *    - O editor é inicializado via `useEffect` no container `editorRef`.
 *    - Utilizamos `EditorView` para o DOM e `EditorState` para a lógica.
 *    - Extensões principais: history (undo/redo), markdown (CommonMark), 
 *      syntaxHighlighting (estilo customizado) e o tema One Dark adaptado.
 * 
 * 2. SINCRONIZAÇÃO DE ESTADO:
 *    - Bidirecional: 
 *      a) Editor -> Contexto: O `updateListener` detecta mudanças no doc e chama `handleContentChange`.
 *      b) Contexto -> Editor: Um `useEffect` observa `editContent` (ex: ao carregar uma nota) 
 *         e despacha uma transação de mudança se o conteúdo divergir.
 * 
 * 3. SCROLL SINCRONIZADO (Bidirecional):
 *    - O scroll é baseado em porcentagem relativa.
 *    - `scrollSourceRef` e `previewModeRef` são usados para evitar loops infinitos 
 *      de eventos quando um lado "empurra" o scroll do outro.
 *    - O editor permanece montado (mesmo que oculto) para preservar estado e foco.
 * 
 * 4. BARRA DE FERRAMENTAS E ATALHOS:
 *    - Utilizamos uma "Ponte de Comandos": A UI (Shadcn) e o `keymap` chamam as 
 *      mesmas funções (`insertBold`, `insertH1`, etc).
 *    - Estas funções usam `view.dispatch()` para manipular o texto via transações, 
 *      garantindo que o histórico de Undo/Redo funcione perfeitamente.
 * 
 * 5. DESIGN (Pure Black):
 *    - O tema é dinâmico via `next-themes`.
 *    - No modo escuro, forçamos `backgroundColor: transparent` para herdar o 
 *      preto absoluto (#000000) da aplicação, otimizando o contraste.
 * 
 * 6. MULTIMÍDIA:
 *    - O `handlePaste` intercepta imagens do clipboard e faz o upload automático,
 *      inserindo o link Markdown no local exato do cursor.
 */

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
  Save,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { toast } from "sonner";
import { useTheme } from "next-themes";

// CodeMirror imports
import { EditorState, Transaction, EditorSelection } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLine, scrollPastEnd } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, undo as cmUndo, redo as cmRedo } from "@codemirror/commands";
import { markdown, commonmarkLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { syntaxHighlighting, defaultHighlightStyle, HighlightStyle, syntaxHighlighting as createSyntaxHighlighting } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import { tags as t } from "@lezer/highlight";

// Função utilitária fora do componente para evitar que o React Compiler 
// reclame de mutação direta de DOM em refs.
const performScrollSync = (
  source: "editor" | "preview",
  editorScrollDOM: HTMLElement,
  previewDOM: HTMLElement
) => {
  if (source === "editor") {
    const scrollPercentage = editorScrollDOM.scrollTop / (editorScrollDOM.scrollHeight - editorScrollDOM.clientHeight);
    previewDOM.scrollTop = scrollPercentage * (previewDOM.scrollHeight - previewDOM.clientHeight);
  } else {
    const scrollPercentage = previewDOM.scrollTop / (previewDOM.scrollHeight - previewDOM.clientHeight);
    editorScrollDOM.scrollTop = scrollPercentage * (editorScrollDOM.scrollHeight - editorScrollDOM.clientHeight);
  }
};

export function NoteEditor() {
  const {
    editTitle,
    editContent,
    handleTitleChange,
    handleContentChange,
    autoSavePage,
    hasUnsavedChanges,
    isSaving,
  } = useNotes();

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollSourceRef = useRef<"editor" | "preview" | null>(null);
  const editContentRef = useRef(editContent);

  useEffect(() => {
    editContentRef.current = editContent;
  }, [editContent]);

  // Salvar no localStorage quando o modo mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("noteEditorMode", previewMode);
    }
  }, [previewMode]);

  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noteAutoSave");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("noteAutoSave", isAutoSaveEnabled.toString());
    }
  }, [isAutoSaveEnabled]);

  const { resolvedTheme } = useTheme();

  // Refs para sincronização de estado sem causar re-render do editor
  const previewModeRef = useRef(previewMode);
  useEffect(() => {
    previewModeRef.current = previewMode;
  }, [previewMode]);

  // Auto-save usando um custom hook
  const debouncedAutoSave = useDebouncedCallback(() => {
    if (hasUnsavedChanges && isAutoSaveEnabled) {
      autoSavePage();
    }
  }, 2000);

  useEffect(() => {
    if (hasUnsavedChanges && isAutoSaveEnabled) {
      debouncedAutoSave();
    }
  }, [editContent, editTitle, hasUnsavedChanges, isAutoSaveEnabled, debouncedAutoSave]);

  // Refs para o CodeMirror
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Funções de Undo/Redo usando CodeMirror
  const undo = useCallback(() => {
    if (viewRef.current) {
      cmUndo(viewRef.current);
    }
  }, []);

  const redo = useCallback(() => {
    if (viewRef.current) {
      cmRedo(viewRef.current);
    }
  }, []);

  // Função para inserir texto no CodeMirror
  const insertTextAtCursor = (
    beforeText: string,
    afterText: string = "",
    selectText: boolean = false
  ) => {
    if (!viewRef.current) return;

    const view = viewRef.current;
    const { state, dispatch } = view;
    
    const changes = state.changeByRange((range) => {
      const selectedText = state.sliceDoc(range.from, range.to);
      const insertion = selectText && selectedText
        ? beforeText + selectedText + afterText
        : beforeText + afterText;
        
      return {
        range: EditorSelection.cursor(range.from + beforeText.length + (selectText && selectedText ? selectedText.length : 0)),
        changes: { from: range.from, to: range.to, insert: insertion }
      };
    });

    dispatch(state.update(changes, { scrollIntoView: true, userEvent: "input" }));
    view.focus();
  };

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

  const getImageFileFromClipboard = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) {
      return null;
    }

    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          return file;
        }
      }
    }

    return null;
  }, []);

  // Interceptor de Ctrl+V para upload de imagens
  const handlePaste = async (e: ClipboardEvent) => {
    const imageFile = getImageFileFromClipboard(e);
    if (!imageFile) {
      return;
    }

    e.preventDefault();

    if (isUploadingImage) {
      return;
    }

    setIsUploadingImage(true);
    const uploadToastId = toast.loading("Enviando imagem...");

    try {
      const mediaResponse = await uploadMedia(imageFile);
      insertTextAtCursor(mediaResponse.markdown, "");
      toast.success("Imagem enviada com sucesso", { id: uploadToastId });
    } catch {
      toast.error("Erro ao enviar imagem. Tente novamente.", {
        id: uploadToastId,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

    // Função para sincronizar o scroll no modo split (Bidirecional)
  const handleScroll = (source: "editor" | "preview") => {
    if (previewModeRef.current !== "split" || !previewRef.current || !viewRef.current) return;

    // Se o scroll foi disparado programaticamente por uma sincronização, ignora para evitar loop infinito
    if (scrollSourceRef.current && scrollSourceRef.current !== source) {
      scrollSourceRef.current = null; 
      return;
    }

    scrollSourceRef.current = source;
    
    // Obter o elemento de scroll do CodeMirror
    const editorScrollDOM = viewRef.current.scrollDOM;
    
    // Executar a sincronia via função externa para não irritar o React Compiler
    performScrollSync(source, editorScrollDOM, previewRef.current);

    setTimeout(() => {
      if (scrollSourceRef.current === source) {
        scrollSourceRef.current = null;
      }
    }, 50);
  };


  // Inicialização do CodeMirror
  useEffect(() => {
    if (!editorRef.current) return;

    // Estilo customizado para links e tarefas (mais legível no dark mode)
    const customHighlightStyle = HighlightStyle.define([
      { tag: t.link, color: resolvedTheme === "dark" ? "#61afef" : "#0969da", textDecoration: "underline" },
      { tag: t.url, color: resolvedTheme === "dark" ? "#abb2bf" : "#57606a", opacity: 0.7 },
      { tag: t.heading1, fontWeight: "bold", fontSize: "1.4em", color: resolvedTheme === "dark" ? "#e06c75" : "#cf222e" },
      { tag: t.heading2, fontWeight: "bold", fontSize: "1.2em", color: resolvedTheme === "dark" ? "#d19a66" : "#953800" },
      { tag: t.strikethrough, textDecoration: "line-through" },
      { tag: t.meta, color: resolvedTheme === "dark" ? "#c678dd" : "#8250df" }, // Tasks [-] [x]
    ]);

    const startState = EditorState.create({
      doc: editContent,
      extensions: [
        history(),
        keymap.of([
          { key: "Mod-b", run: () => { insertBold(); return true; } },
          { key: "Mod-i", run: () => { insertItalic(); return true; } },
          { key: "Mod-k", run: () => { insertLink(); return true; } },
          { key: "Mod-1", run: () => { insertH1(); return true; } },
          { key: "Mod-2", run: () => { insertH2(); return true; } },
          { key: "Mod-3", run: () => { insertH3(); return true; } },
          { key: "Mod-l", run: () => { insertList(); return true; } },
          { key: "Mod-Shift-l", run: () => { insertOrderedList(); return true; } },
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        markdown({
          base: commonmarkLanguage,
          codeLanguages: languages,
          addKeymap: true // Ativa atalhos de markdown como listas automáticas
        }),
        createSyntaxHighlighting(customHighlightStyle),
        resolvedTheme === "dark" ? oneDark : [],
        highlightActiveLine(),
        scrollPastEnd(),
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "16px",
            backgroundColor: "transparent !important",
          },
          "&.cm-focused": {
            outline: "none",
          },
          ".cm-content": {
            padding: "20px",
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          ".cm-scroller": {
            lineHeight: "1.6",
            backgroundColor: "transparent !important",
          },
          ".cm-gutters": {
            backgroundColor: "transparent !important",
            border: "none",
            color: resolvedTheme === "dark" ? "#4b5263" : "#9ca3af",
          },
          ".cm-activeLine": {
            backgroundColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.05) !important" : "rgba(0, 0, 0, 0.03) !important",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "transparent !important",
            color: resolvedTheme === "dark" ? "#e06c75" : "#cf222e",
          },
          ".cm-selectionBackground, .cm-content ::selection": {
            backgroundColor: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.2) !important" : "rgba(0, 0, 0, 0.1) !important",
          }
        }, { dark: resolvedTheme === "dark" }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            handleContentChange(update.state.doc.toString());
          }
        }),
        // Handler de eventos do DOM
        EditorView.domEventHandlers({
          scroll: () => {
            // Usamos a Ref para evitar stale closure
            if (previewModeRef.current === "split") {
              handleScroll("editor");
            }
          },
          paste: (event) => {
            handlePaste(event);
          }
        })
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [resolvedTheme]); // Re-inicializa apenas quando o tema muda para aplicar as cores corretamente

  // Sincronizar conteúdo de fora para dentro (ex: quando carrega uma nota)
  useEffect(() => {
    if (viewRef.current && editContent !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: editContent }
      });
    }
  }, [editContent]);



  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const imgContainer = target.closest('.markdown-img-container') as HTMLElement;
    
    if (imgContainer) {
      const src = imgContainer.getAttribute('data-image-src');
      const alt = imgContainer.getAttribute('data-image-alt');
      
      if (src && window.openImageModal) {
        window.openImageModal(src, alt || '');
      }
    }
  };

  // Auto-focus no editor quando entra em modo de edição
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.focus();
    }
  }, []);

  // Atalhos de teclado (P e Fullscreen apenas, o resto o CM resolve)
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
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    previewMode,
    isFullscreen
  ]);

  const renderSaveStatus = () => {
    if (isSaving) {
      return (
        <>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Salvando...
        </>
      );
    }

    if (hasUnsavedChanges) {
      return (
        <>
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          Editando...
        </>
      );
    }

    return (
      <>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Salvo
      </>
    );
  };

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
              variant={previewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("preview")}
              className="flex items-center gap-2"
            >
              <EyeOff className="w-4 h-4" />
              Preview
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

            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                {renderSaveStatus()}
              </span>
              <Button
                variant={isAutoSaveEnabled ? "outline" : "secondary"}
                size="sm"
                onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
                className="flex items-center gap-2"
                title="Alternar Auto-Save"
              >
                <Save className="w-4 h-4" />
                {isAutoSaveEnabled ? "Auto-Save: ON" : "Auto-Save: OFF"}
              </Button>
              {!isAutoSaveEnabled && hasUnsavedChanges && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => autoSavePage()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              )}
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
          className={`border rounded-lg overflow-hidden flex ${
            isFullscreen
              ? "h-[calc(100vh-300px)]"
              : "h-[calc(100vh-320px)] min-h-[700px]"
          }`}
        >
          {/* Editor (Sempre montado para não perder estado/foco) */}
          <div 
            ref={editorRef} 
            className={`flex-1 bg-background relative overflow-hidden ${
              previewMode === "preview" ? "hidden" : "block"
            }`}
          />

          {/* Divisor vertical no modo Split */}
          {previewMode === "split" && (
            <div className="w-px bg-border flex-shrink-0" />
          )}

          {/* Preview */}
          <div 
            ref={previewRef}
            onScroll={() => handleScroll("preview")}
            className={`flex-1 bg-background overflow-y-auto relative ${
              previewMode === "edit" ? "hidden" : "block"
            }`}
          >
            <div
              className={`p-6 prose prose-neutral dark:prose-invert max-w-none ${
                previewMode === "split" ? "prose-sm" : "prose-base"
              }`}
              dangerouslySetInnerHTML={{
                __html: editContent
                  ? parseMarkdown(editContent)
                  : `<p class='text-muted-foreground italic'>${
                      previewMode === "split" 
                        ? "Preview aparecerá aqui..." 
                        : "Preview aparecerá aqui quando você escrever algo..."
                    }</p>`,
              }}
              onClick={handleContentClick}
            />
          </div>
        </div>

        {/* Dicas de atalhos */}
        {/* <div className="mt-4 p-3 bg-muted/30 rounded-lg">
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
        </div> */}
      </div>
    </div>
  );
}
