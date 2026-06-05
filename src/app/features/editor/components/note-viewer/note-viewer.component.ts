import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '../../../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-note-viewer',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  templateUrl: './note-viewer.component.html'
})
export class NoteViewerComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() createdAt: string = '';
  @Input() updatedAt: string = '';

  handleContentClick(event: MouseEvent): void {
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
