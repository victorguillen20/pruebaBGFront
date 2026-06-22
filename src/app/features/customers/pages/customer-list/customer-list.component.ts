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
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, Subject, distinctUntilChanged } from 'rxjs';
import { CustomersService, CustomerSearchParams } from '../../../../core/api/customers.service';
import { CustomerResponse, CustomerType, PagedResult } from '../../../../core/api/api.types';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { BgCurrencyPipe } from '../../../../shared/pipes/bg-currency.pipe';
import { CustomerFormat } from '../../utils/customer-format';
import { CustomerFormDialogComponent } from '../customer-form-dialog/customer-form-dialog.component';
import { CustomerDeleteDialogComponent } from '../customer-delete-dialog/customer-delete-dialog.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    BgCurrencyPipe,
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent implements OnInit {
  private readonly customersService = inject(CustomersService);
  readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly data = signal<PagedResult<CustomerResponse> | null>(null);

  readonly searchTerm = signal('');
  readonly activeOnly = signal(true);
  private readonly searchSubject = new Subject<string>();

  readonly displayedColumns = ['identification', 'name', 'type', 'phone', 'email', 'creditLimit', 'isActive', 'acciones'];

  page = 1;
  pageSize = 10;
  total = 0;

  ngOnInit(): void {
    this.load();
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.page = 1;
      this.load();
    });
  }

  onSearchInput(value: string): void {
    const normalized = CustomerFormat.normalizeIdentification(value);
    this.searchTerm.set(normalized);
    this.searchSubject.next(normalized);
  }

  onActiveOnlyChange(value: boolean): void {
    this.activeOnly.set(value);
    this.page = 1;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    const params: CustomerSearchParams = { page: this.page, pageSize: this.pageSize, activeOnly: this.activeOnly() };
    if (this.searchTerm()) params.search = this.searchTerm();

    this.customersService.search(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => { this.data.set(result); this.total = result.total; },
        error: () => this.error.set('Error al cargar los clientes'),
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  customerTypeLabel(type: CustomerType | string | number): string {
    if (type === CustomerType.Persona || type === 'Persona' || type === 1) return 'Persona';
    if (type === CustomerType.Empresa || type === 'Empresa' || type === 2) return 'Empresa';
    return '';
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(CustomerFormDialogComponent, {
      width: '550px',
      data: { mode: 'create' },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Cliente creado exitosamente', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openEditDialog(customer: CustomerResponse): void {
    const ref = this.dialog.open(CustomerFormDialogComponent, {
      width: '550px',
      data: { mode: 'edit', customer },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Cliente actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openDeleteDialog(customer: CustomerResponse): void {
    const ref = this.dialog.open(CustomerDeleteDialogComponent, {
      width: '400px',
      data: customer,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.customersService.delete(customer.id).subscribe({
        next: () => {
          this.snackBar.open('Cliente desactivado exitosamente', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Error al desactivar el cliente', 'Cerrar', { duration: 3000 }),
      });
    });
  }
}
