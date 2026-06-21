import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UsersService } from '../../../../core/api/users.service';
import { AuthState } from '../../../../core/auth/auth.state';
import { UserResponse } from '../../../../core/api/api.types';

export interface ChangePasswordDialogData {
  user: UserResponse;
}

@Component({
  selector: 'app-user-change-password-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-change-password-dialog.component.html',
  styleUrl: './user-change-password-dialog.component.scss',
})
export class UserChangePasswordDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly dialogRef = inject(MatDialogRef<UserChangePasswordDialogComponent>);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authState = inject(AuthState);
  readonly data = inject<ChangePasswordDialogData>(MAT_DIALOG_DATA);

  readonly targetUser = this.data.user;
  readonly currentUser = this.authState.currentUser;
  readonly isSelf = computed(() => this.currentUser()?.id === this.targetUser.id);
  readonly saving = signal(false);

  form: FormGroup = this.fb.group({
    currentPassword: ['', this.isSelf() ? Validators.required : []],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    if (!this.isSelf()) {
      this.snackBar.open('Solo podés cambiar tu propia contraseña desde acá', 'Cerrar', { duration: 4000 });
      return;
    }

    const val = this.form.value;
    if (val.newPassword !== val.confirmPassword) {
      this.snackBar.open('Las contraseñas nuevas no coinciden', 'Cerrar', { duration: 3000 });
      return;
    }

    this.saving.set(true);
    this.usersService.changePassword({
      currentPassword: val.currentPassword,
      newPassword: val.newPassword,
      confirmPassword: val.confirmPassword,
    }).pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snackBar.open('Error al cambiar la contraseña', 'Cerrar', { duration: 3000 }),
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
