import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardService } from '../../../../core/api/dashboard.service';
import { DashboardSummaryResponse } from '../../../../core/api/api.types';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { BgCurrencyPipe } from '../../../../shared/pipes/bg-currency.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    BgCurrencyPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly data = signal<DashboardSummaryResponse | null>(null);

  readonly recentColumns = ['number', 'date', 'customer', 'total', 'status'];
  readonly topColumns = ['product', 'code', 'quantity', 'revenue'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.dashboardService.getSummary()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (d) => this.data.set(d),
        error: () => this.error.set('Error al cargar el dashboard'),
      });
  }
}
