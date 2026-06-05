import { Component, Input, Output, EventEmitter, signal, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownPipe } from '../../../../shared/pipes/markdown.pipe';
import { Subject, debounceTime, takeUntil } from 'rxjs';

// CodeMirror Core
import { EditorState, EditorSelection } from '@codemirror/state';
import { EditorView, keymap, highlightActiveLine, scrollPastEnd } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, undo as cmUndo, redo as cmRedo } from '@codemirror/commands';
import { markdown, commonmarkLanguage } from '@codemirror/lang-markdown';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import { tags as t } from '@lezer/highlight';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  templateUrl: './note-editor.component.html'
})
export class NoteEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() content: string = '';
  @Input() title: string = '';
  @Input() hasUnsavedChanges: boolean = false;
  @Input() isDarkMode: boolean = false;
  @Input() isSaving: boolean = false;

  @Output() contentChange = new EventEmitter<string>();
  @Output() titleChange = new EventEmitter<string>();
  @Output() savePage = new EventEmitter<void>();
  @Output() autoSave = new EventEmitter<void>();
  @Output() uploadImage = new EventEmitter<{ file: File; callback: (markdown: string) => void }>();

  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @ViewChild('previewContainer') previewContainer?: ElementRef;

  private view?: EditorView;
  private destroy$ = new Subject<void>();
  private changeSubject = new Subject<string>();
  private autoSaveSubject = new Subject<void>();

  // Editor Configs persistidos localmente
  editorMode = signal<'edit' | 'preview' | 'split'>('edit');
  isFullscreen = signal<boolean>(false);
  isAutoSaveEnabled = signal<boolean>(true);
  isUploadingImage = signal<boolean>(false);

  private scrollSource: 'editor' | 'preview' | null = null;
  private isUpdatingFromModel = false;

  constructor() {
    this.initializeConfig();

    // Sincronizar modificações do editor com debounce
    this.changeSubject.pipe(
      debounceTime(50),
      takeUntil(this.destroy$)
    ).subscribe((newVal) => {
      this.contentChange.emit(newVal);
      
      if (this.isAutoSaveEnabled()) {
        this.autoSaveSubject.next();
      }
    });

    // AutoSave debounced em 2 segundos
    this.autoSaveSubject.pipe(
      debounceTime(2000),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.isAutoSaveEnabled()) {
        this.autoSave.emit();
      }
    });
  }

  private initializeConfig(): void {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('noteEditorMode') as 'edit' | 'preview' | 'split';
      if (savedMode) this.editorMode.set(savedMode);

      const savedAutoSave = localStorage.getItem('noteAutoSave');
      if (savedAutoSave) this.isAutoSaveEnabled.set(savedAutoSave === 'true');
    }
  }

  ngAfterViewInit(): void {
    this.initializeCodeMirror();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-inicializa o editor se o tema mudar
    if (changes['isDarkMode'] && !changes['isDarkMode'].firstChange) {
      this.initializeCodeMirror();
    }

    // Sincroniza o conteúdo quando atualizado externamente (nova nota carregada)
    if (changes['content']) {
      const newContent = changes['content'].currentValue || '';
      if (this.view && newContent !== this.view.state.doc.toString()) {
        this.isUpdatingFromModel = true;
        this.view.dispatch({
          changes: { from: 0, to: this.view.state.doc.length, insert: newContent }
        });
        this.isUpdatingFromModel = false;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  setEditorMode(mode: 'edit' | 'preview' | 'split'): void {
    this.editorMode.set(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('noteEditorMode', mode);
    }
  }

  toggleAutoSave(): void {
    this.isAutoSaveEnabled.update(val => !val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('noteAutoSave', this.isAutoSaveEnabled().toString());
    }
  }

  private initializeCodeMirror(): void {
    if (this.view) {
      this.view.destroy();
    }

    const isDark = this.isDarkMode;

    // Custom Highlight Styles correspondentes
    const customHighlightStyle = HighlightStyle.define([
      { tag: t.link, color: isDark ? '#61afef' : '#0969da', textDecoration: 'underline' },
      { tag: t.url, color: isDark ? '#abb2bf' : '#57606a', opacity: 0.7 },
      { tag: t.heading1, fontWeight: 'bold', fontSize: '1.4em', color: isDark ? '#e06c75' : '#cf222e' },
      { tag: t.heading2, fontWeight: 'bold', fontSize: '1.2em', color: isDark ? '#d19a66' : '#953800' },
      { tag: t.strikethrough, textDecoration: 'line-through' },
      { tag: t.meta, color: isDark ? '#c678dd' : '#8250df' },
      { tag: t.keyword, color: isDark ? '#c678dd' : '#d73a49' },
      { tag: t.operator, color: isDark ? '#56b6c2' : '#005cc5' },
      { tag: t.string, color: isDark ? '#98c379' : '#032f62' },
      { tag: t.number, color: isDark ? '#d19a66' : '#005cc5' },
      { tag: t.variableName, color: isDark ? '#e06c75' : '#24292e' },
      { tag: t.comment, color: isDark ? '#5c6370' : '#6a737d', fontStyle: 'italic' },
      { tag: t.function(t.variableName), color: isDark ? '#61afef' : '#6f42c1' },
    ]);

    const startState = EditorState.create({
      doc: this.content,
      extensions: [
        history(),
        keymap.of([
          { key: 'Mod-b', run: () => { this.insertBold(); return true; } },
          { key: 'Mod-i', run: () => { this.insertItalic(); return true; } },
          { key: 'Mod-k', run: () => { this.insertLink(); return true; } },
          { key: 'Mod-1', run: () => { this.insertH1(); return true; } },
          { key: 'Mod-2', run: () => { this.insertH2(); return true; } },
          { key: 'Mod-3', run: () => { this.insertH3(); return true; } },
          { key: 'Mod-l', run: () => { this.insertList(); return true; } },
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        markdown({
          base: commonmarkLanguage,
          addKeymap: true
        }),
        syntaxHighlighting(customHighlightStyle),
        isDark ? oneDark : [],
        highlightActiveLine(),
        scrollPastEnd(),
        EditorView.lineWrapping,
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '16px',
            backgroundColor: 'transparent !important',
          },
          '&.cm-focused': {
            outline: 'none',
          },
          '.cm-content': {
            padding: '20px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
          },
          '.cm-scroller': {
            lineHeight: '1.6',
            backgroundColor: 'transparent !important',
          },
          '.cm-gutters': {
            backgroundColor: 'transparent !important',
            border: 'none',
            color: isDark ? '#4b5263' : '#9ca3af',
          },
          '.cm-activeLine': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05) !important' : 'rgba(0, 0, 0, 0.03) !important',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'transparent !important',
            color: isDark ? '#e06c75' : '#cf222e',
          },
          '.cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2) !important' : 'rgba(0, 0, 0, 0.1) !important',
          }
        }, { dark: isDark }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !this.isUpdatingFromModel) {
            this.changeSubject.next(update.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          scroll: () => {
            if (this.editorMode() === 'split') {
              this.syncScroll('editor');
            }
          },
          paste: (event) => {
            this.handlePaste(event);
          }
        })
      ]
    });

    this.view = new EditorView({
      state: startState,
      parent: this.editorContainer.nativeElement
    });

    setTimeout(() => this.view?.focus(), 50);
  }

  // Lógica de Sincronia de Scroll Bidirecional
  syncScroll(source: 'editor' | 'preview'): void {
    if (this.editorMode() !== 'split' || !this.previewContainer || !this.view) return;

    if (this.scrollSource && this.scrollSource !== source) {
      this.scrollSource = null;
      return;
    }

    this.scrollSource = source;

    const editorScrollDOM = this.view.scrollDOM;
    const previewDOM = this.previewContainer.nativeElement;

    const editorScrollableHeight = this.view.contentHeight - editorScrollDOM.clientHeight;
    const previewScrollableHeight = previewDOM.scrollHeight - previewDOM.clientHeight;

    if (source === 'editor') {
      const scrollPercentage = editorScrollDOM.scrollTop / (editorScrollableHeight || 1);
      previewDOM.scrollTop = scrollPercentage * previewScrollableHeight;
    } else {
      const scrollPercentage = previewDOM.scrollTop / (previewScrollableHeight || 1);
      editorScrollDOM.scrollTop = scrollPercentage * editorScrollableHeight;
    }

    setTimeout(() => {
      if (this.scrollSource === source) {
        this.scrollSource = null;
      }
    }, 50);
  }

  onPreviewScroll(): void {
    this.syncScroll('preview');
  }

  // Clipboard Paste de Imagens
  private handlePaste(e: ClipboardEvent): void {
    const items = e.clipboardData?.items;
    if (!items) return;

    let imageFile: File | null = null;
    for (const item of Array.from(items)) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        imageFile = item.getAsFile();
        break;
      }
    }

    if (!imageFile) return;

    e.preventDefault();
    if (this.isUploadingImage()) return;

    this.isUploadingImage.set(true);

    this.uploadImage.emit({
      file: imageFile,
      callback: (markdown: string) => {
        this.isUploadingImage.set(false);
        this.insertTextAtCursor(markdown, '');
      }
    });
  }

  // Ponte de Comandos CodeMirror
  insertTextAtCursor(beforeText: string, afterText: string = '', selectText: boolean = false): void {
    if (!this.view) return;

    const view = this.view;
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

    dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'input' }));
    view.focus();
  }

  insertBold = () => this.insertTextAtCursor('**', '**', true);
  insertItalic = () => this.insertTextAtCursor('*', '*', true);
  insertH1 = () => this.insertTextAtCursor('# ', '');
  insertH2 = () => this.insertTextAtCursor('## ', '');
  insertH3 = () => this.insertTextAtCursor('### ', '');
  insertCode = () => this.insertTextAtCursor('`', '`', true);
  insertQuote = () => this.insertTextAtCursor('> ', '');
  insertList = () => this.insertTextAtCursor('- ', '');
  insertOrderedList = () => this.insertTextAtCursor('1. ', '');
  insertLink = () => this.insertTextAtCursor('[', '](url)');
  insertImageLink = () => this.insertTextAtCursor('![Alt text](', ')');

  undo = () => this.view && cmUndo(this.view);
  redo = () => this.view && cmRedo(this.view);

  // Zoom da imagem no visualizador da direita
  handlePreviewClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const imgContainer = target.closest('.markdown-img-container') as HTMLElement;
    if (imgContainer) {
      const src = imgContainer.getAttribute('data-image-src');
      const alt = imgContainer.getAttribute('data-image-alt');
      if (src && window.openImageModal) {
        window.openImageModal(src, alt || '');
      }
    }
  }
}
