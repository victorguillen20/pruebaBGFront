import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UsersService } from '../../../../core/api/users.service';

@Component({
  selector: 'app-user-change-password-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-change-password-dialog.component.html',
  styleUrl: './user-change-password-dialog.component.scss',
})
export class UserChangePasswordDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly dialogRef = inject(MatDialogRef<UserChangePasswordDialogComponent>);
  private readonly snackBar = inject(MatSnackBar);

  readonly saving = signal(false);

  form: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

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
