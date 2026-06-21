import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvoicesService } from '../../../../core/api/invoices.service';
import { InvoiceResponse, InvoiceStatus } from '../../../../core/api/api.types';
import { AuthState } from '../../../../core/auth/auth.state';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { BgCurrencyPipe } from '../../../../shared/pipes/bg-currency.pipe';
import { CancelDialogComponent } from './cancel-dialog/cancel-dialog.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    BgCurrencyPipe,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss',
})
export class InvoiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly invoicesService = inject(InvoicesService);
  private readonly dialog = inject(MatDialog);
  readonly authState = inject(AuthState);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly invoice = signal<InvoiceResponse | null>(null);

  readonly detailColumns = ['product', 'code', 'quantity', 'unitPrice', 'lineTotal'];
  readonly paymentColumns = ['method', 'amount', 'reference', 'date'];

  readonly InvoiceStatus = InvoiceStatus;

  private invoiceId = 0;

  ngOnInit(): void {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.invoiceId) this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.invoicesService.getById(this.invoiceId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (inv) => this.invoice.set(inv),
        error: () => this.error.set('Error al cargar la factura'),
      });
  }

  openCancelDialog(): void {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      width: '400px',
      data: { invoiceNumber: this.invoice()?.number },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.loading.set(true);
        this.invoicesService.cancel(this.invoiceId).subscribe({
          next: () => this.load(),
          error: () => this.error.set('Error al anular la factura'),
        });
      }
    });
  }

  paymentMethodLabel(method: number): string {
    const labels: Record<number, string> = { 1: 'Efectivo', 2: 'Tarjeta', 3: 'Transferencia', 4: 'Cheque', 5: 'Otro' };
    return labels[method] ?? '';
  }
}
