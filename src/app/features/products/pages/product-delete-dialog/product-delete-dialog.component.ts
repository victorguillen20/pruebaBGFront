import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductResponse } from '../../../../core/api/api.types';

@Component({
  selector: 'app-product-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './product-delete-dialog.component.html',
  styleUrl: './product-delete-dialog.component.scss',
})
export class ProductDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ProductDeleteDialogComponent>);
  readonly product = inject<ProductResponse>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
