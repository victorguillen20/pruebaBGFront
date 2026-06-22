import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { InvoicesService } from '../../../../core/api/invoices.service';
import { CustomersService } from '../../../../core/api/customers.service';
import { ProductsService } from '../../../../core/api/products.service';
import { CustomerResponse, ProductResponse, InvoiceType } from '../../../../core/api/api.types';

@Component({
  selector: 'app-invoice-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './invoice-form-dialog.component.html',
  styleUrl: './invoice-form-dialog.component.scss',
})
export class InvoiceFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly invoicesService = inject(InvoicesService);
  private readonly customersService = inject(CustomersService);
  private readonly productsService = inject(ProductsService);
  private readonly dialogRef = inject(MatDialogRef<InvoiceFormDialogComponent>);
  private readonly snackBar = inject(MatSnackBar);

  readonly InvoiceType = InvoiceType;
  readonly saving = signal(false);
  readonly customers = signal<CustomerResponse[]>([]);
  readonly products = signal<ProductResponse[]>([]);

  form: FormGroup;

  get detailsFormArray(): FormArray {
    return this.form.get('details') as FormArray;
  }

  constructor() {
    this.form = this.fb.group({
      customerId: [null as number | null, Validators.required],
      type: [InvoiceType.Contado, Validators.required],
      dueDate: [null as Date | null],
      notes: [''],
      details: this.fb.array([this.createDetailLine()], Validators.required),
    });
  }

  ngOnInit(): void {
    this.customersService.search({ page: 1, pageSize: 200 }).subscribe({
      next: (r) => this.customers.set(r.items.filter((c) => c.isActive)),
    });
    this.productsService.search({ page: 1, pageSize: 200, onlyActive: true }).subscribe({
      next: (r) => this.products.set(r.items),
    });
  }

  onTypeChange(): void {
    const type = this.form.get('type')?.value;
    const dueDateControl = this.form.get('dueDate');
    if (type === InvoiceType.Credito) {
      dueDateControl?.setValidators([Validators.required]);
    } else {
      dueDateControl?.clearValidators();
      dueDateControl?.setValue(null);
    }
    dueDateControl?.updateValueAndValidity();
  }

  createDetailLine(): FormGroup {
    return this.fb.group({
      productId: [null as number | null, Validators.required],
      productName: ['', Validators.required],
      productCode: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addDetailLine(): void {
    this.detailsFormArray.push(this.createDetailLine());
  }

  removeDetailLine(index: number): void {
    this.detailsFormArray.removeAt(index);
  }

  onProductSelect(index: number): void {
    const detailGroup = this.detailsFormArray.at(index) as FormGroup;
    const productId = detailGroup.get('productId')?.value;
    if (!productId) return;
    const product = this.products().find((p) => p.id === productId);
    if (!product) return;
    detailGroup.patchValue({
      productName: product.name,
      productCode: product.code,
      unitPrice: product.price,
    });
  }

  lineSubtotal(index: number): number {
    const group = this.detailsFormArray.at(index) as FormGroup;
    const qty = group.get('quantity')?.value ?? 0;
    const price = group.get('unitPrice')?.value ?? 0;
    return qty * price;
  }

  invoiceTotal(): number {
    let total = 0;
    for (let i = 0; i < this.detailsFormArray.length; i++) {
      total += this.lineSubtotal(i);
    }
    return total;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const val = this.form.value;

    const details = val.details.map((d: { productId: number; productName: string; productCode: string; quantity: number; unitPrice: number }) => ({
      productId: d.productId,
      productName: d.productName,
      productCode: d.productCode,
      quantity: d.quantity,
      unitPrice: d.unitPrice,
    }));

    const dueDate = val.type === InvoiceType.Credito && val.dueDate
      ? (val.dueDate as Date).toISOString()
      : null;

    this.invoicesService.create({
      customerId: val.customerId,
      type: val.type,
      dueDate,
      notes: val.notes || null,
      details,
    }).pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snackBar.open('Error al crear la factura', 'Cerrar', { duration: 3000 }),
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
