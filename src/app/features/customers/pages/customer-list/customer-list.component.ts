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
import { debounceTime, Subject, distinctUntilChanged } from 'rxjs';
import { CustomersService, CustomerSearchParams } from '../../../../core/api/customers.service';
import { CustomerResponse, PagedResult } from '../../../../core/api/api.types';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { BgCurrencyPipe } from '../../../../shared/pipes/bg-currency.pipe';

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
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    BgCurrencyPipe,
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent implements OnInit {
  private readonly customersService = inject(CustomersService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly data = signal<PagedResult<CustomerResponse> | null>(null);

  readonly searchTerm = signal('');
  private readonly searchSubject = new Subject<string>();

  readonly displayedColumns = ['identification', 'name', 'type', 'phone', 'email', 'creditLimit', 'isActive'];

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
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    const params: CustomerSearchParams = { page: this.page, pageSize: this.pageSize, activeOnly: false };
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

  customerTypeLabel(type: number): string {
    return type === 1 ? 'Persona' : type === 2 ? 'Empresa' : '';
  }
}
