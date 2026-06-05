import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AdminUser } from '../../models/admin-user.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <div *ngIf="loading" class="flex justify-center items-center py-16">
      <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
    </div>

    <ng-container *ngIf="!loading">
      <p-table [value]="users" [rows]="10" class="w-full text-sm">
        <ng-template pTemplate="header">
          <tr class="border-b border-border/60 text-muted-foreground font-semibold text-xs text-left">
            <th class="py-3 px-4">Nome de Usuário</th>
            <th class="py-3 px-4">Email</th>
            <th class="py-3 px-4">Permissões</th>
            <th class="py-3 px-4 text-right">Ações</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr class="border-b border-border/40 hover:bg-muted/10 transition-colors">
            <td class="py-4 px-4 font-semibold text-foreground">{{ user.username }}</td>
            <td class="py-4 px-4 text-muted-foreground">{{ user.email }}</td>
            <td class="py-4 px-4">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider"
                [ngClass]="{
                  'bg-primary/10 text-primary': user.roles.includes('ROLE_ADMIN'),
                  'bg-muted text-muted-foreground': !user.roles.includes('ROLE_ADMIN')
                }"
              >
                {{ user.roles.includes('ROLE_ADMIN') ? 'Administrador' : 'Usuário' }}
              </span>
            </td>
            <td class="py-4 px-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <!-- Toggle Ativo/Bloqueado -->
                <button
                  type="button"
                  (click)="onToggleActive(user)"
                  [disabled]="currentUserId === user.id"
                  class="h-8 w-8 rounded-lg flex items-center justify-center transition-colors border border-border bg-background hover:bg-primary/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  [title]="currentUserId === user.id ? 'Você não pode desativar seu próprio usuário' : (user.isActive ? 'Bloquear usuário' : 'Ativar usuário')"
                >
                  <i
                    [class]="user.isActive ? 'pi pi-check-circle text-emerald-500' : 'pi pi-ban text-red-500'"
                    class="text-sm"
                  ></i>
                </button>

                <!-- Excluir Usuário -->
                <button
                  type="button"
                  (click)="onDeleteUser(user)"
                  [disabled]="currentUserId === user.id"
                  class="h-8 w-8 rounded-lg flex items-center justify-center transition-colors border border-border bg-background hover:bg-red-500/10 text-muted-foreground hover:text-red-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  [title]="currentUserId === user.id ? 'Você não pode excluir seu próprio usuário' : 'Excluir usuário'"
                >
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <div *ngIf="users.length === 0" class="text-center py-12">
        <p class="text-sm text-muted-foreground italic">Nenhum usuário encontrado.</p>
      </div>
    </ng-container>
  `
})
export class UserTableComponent {
  @Input() users: AdminUser[] = [];
  @Input() loading: boolean = false;
  @Input() currentUserId?: string;

  @Output() toggleActive = new EventEmitter<AdminUser>();
  @Output() deleteUser = new EventEmitter<AdminUser>();

  onToggleActive(user: AdminUser): void {
    if (this.currentUserId === user.id) return;
    this.toggleActive.emit(user);
  }

  onDeleteUser(user: AdminUser): void {
    if (this.currentUserId === user.id) return;
    if (confirm(`Tem certeza que deseja deletar o usuário "${user.username}"?`)) {
      this.deleteUser.emit(user);
    }
  }
}
