import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../../core/api/users.service';
import { UserResponse, PagedResult } from '../../../../core/api/api.types';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { UserChangePasswordDialogComponent } from '../user-change-password-dialog/user-change-password-dialog.component';
import { UserDeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly data = signal<PagedResult<UserResponse> | null>(null);
  readonly searchTerm = signal('');

  readonly displayedColumns = ['id', 'names', 'userName', 'email', 'createdAt', 'acciones'];

  page = 1;
  pageSize = 10;
  total = 0;

  ngOnInit(): void {
    this.load();
  }

  onSearch(): void {
    this.page = 1;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.usersService.search({ page: this.page, pageSize: this.pageSize, search: this.searchTerm() || undefined })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => { this.data.set(result); this.total = result.total; },
        error: () => this.error.set('Error al cargar los usuarios'),
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openEditDialog(user: UserResponse): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', user },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openChangePasswordDialog(): void {
    const ref = this.dialog.open(UserChangePasswordDialogComponent, {
      width: '450px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Contraseña cambiada exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openDeleteDialog(user: UserResponse): void {
    const ref = this.dialog.open(UserDeleteDialogComponent, {
      width: '400px',
      data: user,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('Usuario desactivado exitosamente', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Error al desactivar el usuario', 'Cerrar', { duration: 3000 }),
      });
    });
  }
}
