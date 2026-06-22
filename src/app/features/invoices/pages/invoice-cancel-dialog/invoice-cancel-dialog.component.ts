import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceSummaryResponse } from '../../../../core/api/api.types';

@Component({
  selector: 'app-invoice-cancel-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './invoice-cancel-dialog.component.html',
  styleUrl: './invoice-cancel-dialog.component.scss',
})
export class InvoiceCancelDialogComponent {
  readonly dialogRef = inject(MatDialogRef<InvoiceCancelDialogComponent>);
  readonly invoice = inject<InvoiceSummaryResponse>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
