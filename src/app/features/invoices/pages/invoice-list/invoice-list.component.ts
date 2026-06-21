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
import { InvoicesService, InvoiceSearchParams } from '../../../../core/api/invoices.service';
import { InvoiceSummaryResponse, InvoiceStatus, PagedResult } from '../../../../core/api/api.types';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { BgCurrencyPipe } from '../../../../shared/pipes/bg-currency.pipe';

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
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    BgCurrencyPipe,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent implements OnInit {
  private readonly invoicesService = inject(InvoicesService);

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

  readonly displayedColumns = ['number', 'date', 'customerName', 'sellerName', 'type', 'status', 'total'];

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

  statusLabel(status: InvoiceStatus): string {
    const opt = this.statusOptions.find((s) => s.value === status);
    return opt?.label ?? '';
  }

  typeLabel(type: number): string {
    return type === 1 ? 'Contado' : type === 2 ? 'Cr\u00e9dito' : '';
  }
}
