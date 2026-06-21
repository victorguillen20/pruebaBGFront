import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UsersService } from '../../../../core/api/users.service';
import { UserResponse } from '../../../../core/api/api.types';

export interface UserFormData {
  mode: 'create' | 'edit';
  user?: UserResponse;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  readonly data = inject<UserFormData>(MAT_DIALOG_DATA);
  private readonly snackBar = inject(MatSnackBar);

  readonly isEdit = this.data.mode === 'edit';
  readonly saving = signal(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    if (this.data.mode === 'create') {
      this.form.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(8)]));
      this.form.addControl('confirmPassword', this.fb.control('', [Validators.required]));
    }

    if (this.data.mode === 'edit' && this.data.user) {
      this.form.patchValue({
        firstName: this.data.user.firstName,
        lastName: this.data.user.lastName,
        userName: this.data.user.userName,
        email: this.data.user.email,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const val = this.form.value;

    if (this.data.mode === 'create') {
      if (val.password !== val.confirmPassword) {
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
        this.saving.set(false);
        return;
      }

      this.usersService.create({
        userName: val.userName,
        email: val.email,
        password: val.password,
        confirmPassword: val.confirmPassword,
        firstName: val.firstName,
        lastName: val.lastName,
        roleId: 2,
      }).pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => this.snackBar.open('Error al crear el usuario', 'Cerrar', { duration: 3000 }),
        });
    } else {
      this.usersService.update(this.data.user!.id, {
        firstName: val.firstName,
        lastName: val.lastName,
        roleId: this.data.user!.roleId,
      }).pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 }),
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

