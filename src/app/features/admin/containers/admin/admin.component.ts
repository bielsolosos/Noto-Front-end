import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../../login/services/auth.service';
import { AdminUser } from '../../models/admin-user.model';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { CreateUserModalComponent } from '../../components/create-user-modal/create-user-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, UserTableComponent, CreateUserModalComponent],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);
  authService = inject(AuthService);

  private destroy$ = new Subject<void>();

  users = signal<AdminUser[]>([]);
  loading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  isCreateModalOpen = signal<boolean>(false);
  createError = signal<string | null>(null);

  searchQuery = signal<string>('');

  // Sincroniza busca local via computed signal
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.users();
    if (!query) return list;
    return list.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.fetchUsers();

    // Sincroniza query parameter 'q' com a barra de busca e filtro
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const q = params.get('q') || '';
      this.searchQuery.set(q);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchUsers(): void {
    this.loading.set(true);
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Erro ao carregar usuários:', err);
      }
    });
  }

  handleSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null },
      queryParamsHandling: 'merge'
    });
  }

  handleToggleActive(user: AdminUser): void {
    const loggedUser = this.authService.currentUser();
    if (loggedUser && loggedUser.id === user.id) {
      alert('Você não pode desativar sua própria conta.');
      return;
    }

    this.adminService.toggleActive(user.id).subscribe({
      next: () => {
        this.fetchUsers();
      },
      error: () => {
        alert('Erro ao alterar status do usuário.');
      }
    });
  }

  handleDeleteUser(user: AdminUser): void {
    const loggedUser = this.authService.currentUser();
    if (loggedUser && loggedUser.id === user.id) {
      alert('Você não pode excluir sua própria conta.');
      return;
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.fetchUsers();
      },
      error: () => {
        alert('Erro ao deletar o usuário.');
      }
    });
  }

  handleCreateUser(userData: any): void {
    this.isSubmitting.set(true);
    this.createError.set(null);

    this.adminService.registerUser(userData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isCreateModalOpen.set(false);
        this.fetchUsers();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.createError.set(err.error?.message || 'Erro ao registrar usuário.');
      }
    });
  }

  openCreateModal(): void {
    this.createError.set(null);
    this.isCreateModalOpen.set(true);
  }

  handleCloseCreateModal(): void {
    this.isCreateModalOpen.set(false);
    this.createError.set(null);
  }
}
