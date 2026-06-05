import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [class.opacity-50]="disabled || loading"
      [class.cursor-not-allowed]="disabled || loading"
    >
      <span class="flex items-center justify-center gap-2">
        @if (loading) {
          <i class="pi pi-spin pi-spinner text-sm"></i>
        }
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() customClass: string = '';

  get buttonClasses(): string {
    const base = 'h-10 px-5 rounded-full font-semibold text-sm shadow-sm transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer select-none';
    let variantClass = '';
    
    switch (this.variant) {
      case 'primary':
        variantClass = 'bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent active:scale-[0.98]';
        break;
      case 'secondary':
        variantClass = 'bg-card text-foreground hover:bg-primary/10 border border-border active:scale-[0.98]';
        break;
      case 'outline':
        variantClass = 'bg-transparent text-foreground hover:bg-primary/10 border border-border active:scale-[0.98]';
        break;
    }

    return `${base} ${variantClass} ${this.customClass}`;
  }
}
