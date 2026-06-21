import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface CancelDialogData {
  invoiceNumber: number;
}

@Component({
  selector: 'app-cancel-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './cancel-dialog.component.html',
})
export class CancelDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CancelDialogData,
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
