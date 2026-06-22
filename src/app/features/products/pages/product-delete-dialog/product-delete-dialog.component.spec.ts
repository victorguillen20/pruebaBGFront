import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductDeleteDialogComponent } from './product-delete-dialog.component';

describe('ProductDeleteDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDeleteDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, code: 'BE-001', name: 'Test' } },
      ],
    }).compileComponents();
  });

  it('se crea correctamente', () => {
    const fixture = TestBed.createComponent(ProductDeleteDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('onConfirm cierra con true', () => {
    const fixture = TestBed.createComponent(ProductDeleteDialogComponent);
    const component = fixture.componentInstance;
    const closeSpy = spyOn(component.dialogRef, 'close');
    component.onConfirm();
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('onCancel cierra con false', () => {
    const fixture = TestBed.createComponent(ProductDeleteDialogComponent);
    const component = fixture.componentInstance;
    const closeSpy = spyOn(component.dialogRef, 'close');
    component.onCancel();
    expect(closeSpy).toHaveBeenCalledWith(false);
  });
});
