import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerResponse } from '../../../../core/api/api.types';

@Component({
  selector: 'app-customer-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './customer-delete-dialog.component.html',
  styleUrl: './customer-delete-dialog.component.scss',
})
export class CustomerDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CustomerDeleteDialogComponent>);
  readonly customer = inject<CustomerResponse>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
