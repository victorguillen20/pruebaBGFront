import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceCancelDialogComponent } from './invoice-cancel-dialog.component';

describe('InvoiceCancelDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCancelDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, number: 1001 } },
      ],
    }).compileComponents();
  });

  it('se crea correctamente', () => {
    const fixture = TestBed.createComponent(InvoiceCancelDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('onConfirm cierra con true', () => {
    const fixture = TestBed.createComponent(InvoiceCancelDialogComponent);
    const component = fixture.componentInstance;
    const closeSpy = spyOn(component.dialogRef, 'close');
    component.onConfirm();
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('onCancel cierra con false', () => {
    const fixture = TestBed.createComponent(InvoiceCancelDialogComponent);
    const component = fixture.componentInstance;
    const closeSpy = spyOn(component.dialogRef, 'close');
    component.onCancel();
    expect(closeSpy).toHaveBeenCalledWith(false);
  });
});
