import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isSidebarOpen = signal<boolean>(true);

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  setSidebarOpen(open: boolean): void {
    this.isSidebarOpen.set(open);
  }
}
