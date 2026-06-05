import { Component, Input, Self, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label) {
        <label [for]="inputId" class="text-xs font-semibold text-muted-foreground select-none">
          {{ label }}
        </label>
      }
      <div class="relative flex items-center w-full">
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="w-full h-10 px-4 rounded-xl border border-border bg-card text-foreground focus:border-primary focus:outline-none transition-colors duration-200 text-sm shadow-inner placeholder:text-muted-foreground/50 disabled:opacity-50"
        />
        <ng-content></ng-content>
      </div>
      @if (errorMessage) {
        <span class="text-[11px] text-red-500 font-medium select-none ml-1 animate-fade-in">
          {{ errorMessage }}
        </span>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() inputId: string = 'input-' + Math.random().toString(36).substring(2, 9);

  value: string = '';
  disabled: boolean = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  get errorMessage(): string | null {
    if (this.ngControl && this.ngControl.touched && this.ngControl.invalid) {
      if (this.ngControl.errors?.['required']) {
        return 'Este campo é obrigatório.';
      }
      if (this.ngControl.errors?.['email']) {
        return 'E-mail inválido.';
      }
      if (this.ngControl.errors?.['minlength']) {
        return `Mínimo de ${this.ngControl.errors?.['minlength'].requiredLength} caracteres.`;
      }
      return 'Campo inválido.';
    }
    return null;
  }
}
