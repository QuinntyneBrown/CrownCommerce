import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, type AdminUser } from 'api';
import { ConfirmDialog } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-users-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersListPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  readonly users = signal<AdminUser[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['name', 'email', 'role', 'created', 'actions'];

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(u =>
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  readonly statCards = computed(() => {
    const all = this.users();
    const admins = all.filter(u => u.role === 'admin').length;
    return [
      { label: 'Total Users', value: all.length, icon: 'people', color: 'var(--primary)' },
      { label: 'Admins', value: admins, icon: 'admin_panel_settings', color: 'var(--warning)' },
      { label: 'Regular Users', value: all.length - admins, icon: 'person', color: 'var(--info)' },
    ];
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load users');
        this.loading.set(false);
      },
    });
  }

  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin': return 'chip chip--warning';
      case 'editor': return 'chip chip--success';
      default: return 'chip chip--default';
    }
  }

  deleteUser(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.authService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: () => this.error.set('Failed to delete user'),
      });
    });
  }
}
