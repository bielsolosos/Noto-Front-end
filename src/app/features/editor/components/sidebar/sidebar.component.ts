import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageSummaryResponse } from '../../models/page.model';
import { UserResponse } from '../../../login/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Input() pageSummaries: PageSummaryResponse[] = [];
  @Input() selectedPageId: string | null = null;
  @Input() searchQuery: string = '';
  @Input() currentUser: UserResponse | null = null;
  @Input() isDarkMode: boolean = false;
  @Input() isLoadingList: boolean = false;
  @Input() isCreating: boolean = false;
  @Input() isAdmin: boolean = false;

  @Output() selectPage = new EventEmitter<string>();
  @Output() deletePage = new EventEmitter<string>();
  @Output() createPage = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  isDropdownOpen = signal<boolean>(false);

  userInitial = computed(() => {
    const user = this.currentUser;
    return user ? user.username.charAt(0).toUpperCase() : 'U';
  });

  toggleDropdown(): void {
    this.isDropdownOpen.update(open => !open);
  }

  handleCreateNew(): void {
    this.createPage.emit();
  }

  handleSelectPage(pageId: string): void {
    this.selectPage.emit(pageId);
  }

  handleDeletePage(event: Event, pageId: string): void {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja apagar esta página?')) {
      this.deletePage.emit(pageId);
    }
  }

  handleSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchChange.emit(input.value);
  }

  handleLogout(): void {
    this.logout.emit();
  }
}
