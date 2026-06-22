import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { CustomersService } from '../../../../core/api/customers.service';
import { CustomerResponse, CustomerType } from '../../../../core/api/api.types';
import { CustomerFormat } from '../../utils/customer-format';

export interface CustomerFormData {
  mode: 'create' | 'edit';
  customer?: CustomerResponse;
}

@Component({
  selector: 'app-customer-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './customer-form-dialog.component.html',
  styleUrl: './customer-form-dialog.component.scss',
})
export class CustomerFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly customersService = inject(CustomersService);
  private readonly dialogRef = inject(MatDialogRef<CustomerFormDialogComponent>);
  readonly data = inject<CustomerFormData>(MAT_DIALOG_DATA);
  private readonly snackBar = inject(MatSnackBar);

  readonly isEdit = this.data.mode === 'edit';
  readonly saving = signal(false);

  form: FormGroup;

  readonly typeOptions = [
    { value: CustomerType.Persona, label: 'Persona' },
    { value: CustomerType.Empresa, label: 'Empresa' },
  ];

  constructor() {
    this.form = this.fb.group({
      identification: ['', [Validators.required]],
      name: ['', [Validators.required]],
      type: [null as CustomerType | null, [Validators.required]],
      phone: [''],
      email: [''],
      address: [''],
      creditLimit: [null as number | null],
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.customer) {
      const c = this.data.customer;
      this.form.patchValue({
        identification: c.identification,
        name: c.name,
        type: c.type,
        phone: c.phone ?? '',
        email: c.email ?? '',
        address: c.address ?? '',
        creditLimit: c.creditLimit,
      });
    }
  }

  onIdentificationInput(value: string): void {
    const normalized = CustomerFormat.normalizeIdentification(value);
    this.form.get('identification')?.setValue(normalized, { emitEvent: false });
    this.validateIdentification();
  }

  onPhoneInput(value: string): void {
    const normalized = CustomerFormat.normalizePhone(value) ?? '';
    this.form.get('phone')?.setValue(normalized, { emitEvent: false });
    this.validatePhone();
  }

  private validateIdentification(): void {
    const control = this.form.get('identification');
    const value = control?.value ?? '';
    if (value.length > 0 && !CustomerFormat.isValidIdentification(value)) {
      control?.setErrors({ invalidIdentification: true });
    }
  }

  private validatePhone(): void {
    const control = this.form.get('phone');
    const value = control?.value ?? '';
    if (value.length > 0 && !CustomerFormat.isValidPhone(value)) {
      control?.setErrors({ invalidPhone: true });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const val = this.form.value;

    if (this.data.mode === 'create') {
      this.customersService.create({
        identification: val.identification,
        name: val.name,
        type: val.type,
        phone: CustomerFormat.normalizePhone(val.phone),
        email: val.email || null,
        address: val.address || null,
        creditLimit: val.creditLimit ?? null,
      }).pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => this.snackBar.open('Error al crear el cliente', 'Cerrar', { duration: 3000 }),
        });
    } else {
      this.customersService.update(this.data.customer!.id, {
        name: val.name,
        type: val.type,
        phone: CustomerFormat.normalizePhone(val.phone),
        email: val.email || null,
        address: val.address || null,
        creditLimit: val.creditLimit ?? null,
      }).pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => this.snackBar.open('Error al actualizar el cliente', 'Cerrar', { duration: 3000 }),
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
