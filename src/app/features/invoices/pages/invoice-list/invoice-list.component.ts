import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvoicesService, InvoiceSearchParams } from '../../../../core/api/invoices.service';
import { InvoiceSummaryResponse, InvoiceStatus, InvoiceType, PagedResult } from '../../../../core/api/api.types';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { BgCurrencyPipe } from '../../../../shared/pipes/bg-currency.pipe';
import { InvoiceFormDialogComponent } from '../invoice-form-dialog/invoice-form-dialog.component';
import { InvoiceCancelDialogComponent } from '../invoice-cancel-dialog/invoice-cancel-dialog.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    BgCurrencyPipe,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent implements OnInit {
  private readonly invoicesService = inject(InvoicesService);
  readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly data = signal<PagedResult<InvoiceSummaryResponse> | null>(null);
  readonly sort = signal<Sort>({ active: '', direction: '' });

  readonly statusFilter = signal<InvoiceStatus | ''>('');
  readonly customerFilter = signal('');
  readonly fromDateFilter = signal<Date | null>(null);
  readonly toDateFilter = signal<Date | null>(null);

  readonly items = computed(() => {
    const result = this.data();
    if (!result) return [];
    const s = this.sort();
    if (!s.active || !s.direction) return result.items;
    return [...result.items].sort((a, b) => {
      const aVal = a[s.active as keyof InvoiceSummaryResponse];
      const bVal = b[s.active as keyof InvoiceSummaryResponse];
      const cmp = (aVal ?? 0) < (bVal ?? 0) ? -1 : (aVal ?? 0) > (bVal ?? 0) ? 1 : 0;
      return s.direction === 'asc' ? cmp : -cmp;
    });
  });

  readonly displayedColumns = ['number', 'date', 'customerName', 'sellerName', 'type', 'status', 'total', 'acciones'];

  readonly InvoiceStatus = InvoiceStatus;
  readonly statusOptions = [
    { value: InvoiceStatus.Pendiente, label: 'Pendiente' },
    { value: InvoiceStatus.Pagada, label: 'Pagada' },
    { value: InvoiceStatus.Anulada, label: 'Anulada' },
  ];

  page = 1;
  pageSize = 10;
  total = 0;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    const params: InvoiceSearchParams = {
      page: this.page,
      pageSize: this.pageSize,
    };
    if (this.statusFilter()) params.status = this.statusFilter() as InvoiceStatus;
    if (this.customerFilter().trim()) params.search = this.customerFilter().trim();
    if (this.fromDateFilter()) params.fromDate = this.fromDateFilter()!.toISOString();
    if (this.toDateFilter()) params.toDate = this.toDateFilter()!.toISOString();

    this.invoicesService.search(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          this.data.set(result);
          this.total = result.total;
        },
        error: () => this.error.set('Error al cargar las facturas'),
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  onSortChange(sort: Sort): void {
    this.sort.set(sort);
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.statusFilter.set('');
    this.customerFilter.set('');
    this.fromDateFilter.set(null);
    this.toDateFilter.set(null);
    this.page = 1;
    this.load();
  }

  typeLabel(type: InvoiceType | string | number): string {
    if (type === InvoiceType.Contado || type === 'Contado' || type === 1) return 'Contado';
    if (type === InvoiceType.Credito || type === 'Credito' || type === 2) return 'Cr\u00e9dito';
    return '';
  }

  statusLabel(status: InvoiceStatus | string | number): string {
    if (status === InvoiceStatus.Pendiente || status === 'Pendiente' || status === 1) return 'Pendiente';
    if (status === InvoiceStatus.Pagada || status === 'Pagada' || status === 2) return 'Pagada';
    if (status === InvoiceStatus.Anulada || status === 'Anulada' || status === 3) return 'Anulada';
    return '';
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(InvoiceFormDialogComponent, {
      width: '750px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Factura creada exitosamente', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openCancelDialog(invoice: InvoiceSummaryResponse): void {
    const ref = this.dialog.open(InvoiceCancelDialogComponent, {
      width: '400px',
      data: invoice,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.invoicesService.cancel(invoice.id).subscribe({
        next: () => {
          this.snackBar.open('Factura anulada exitosamente', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Error al anular la factura', 'Cerrar', { duration: 3000 }),
      });
    });
  }
}
