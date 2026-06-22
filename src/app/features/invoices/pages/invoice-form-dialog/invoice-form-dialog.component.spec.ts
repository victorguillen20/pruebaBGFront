import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { InvoiceFormDialogComponent } from './invoice-form-dialog.component';
import { InvoicesService } from '../../../../core/api/invoices.service';
import { CustomersService } from '../../../../core/api/customers.service';
import { ProductsService } from '../../../../core/api/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceType, InvoiceResponse } from '../../../../core/api/api.types';

describe('InvoiceFormDialogComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      imports: [InvoiceFormDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: InvoicesService, useValue: jasmine.createSpyObj('InvoicesService', ['create']) },
        {
          provide: CustomersService,
          useValue: {
            search: () => of({ items: [{ id: 1, name: 'Test Customer', isActive: true }], total: 1, page: 1, pageSize: 200, totalPages: 1, hasPreviousPage: false, hasNextPage: false }),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            search: () => of({ items: [{ id: 1, code: 'P001', name: 'Test Product', price: 100, stock: 50, isActive: true }], total: 1, page: 1, pageSize: 200, totalPages: 1, hasPreviousPage: false, hasNextPage: false }),
          },
        },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    }).compileComponents();
  }

  it('se crea correctamente', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('inicializa con una linea de detalle', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.detailsFormArray.length).toBe(1);
  });

  it('addDetailLine agrega una nueva linea', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.addDetailLine();
    expect(component.detailsFormArray.length).toBe(2);
  });

  it('removeDetailLine elimina una linea', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.addDetailLine();
    component.removeDetailLine(0);
    expect(component.detailsFormArray.length).toBe(1);
  });

  it('onTypeChange agrega validacion required para Credito', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.form.get('type')?.setValue(InvoiceType.Credito);
    component.onTypeChange();
    component.form.get('dueDate')?.updateValueAndValidity();
    expect(component.form.get('dueDate')?.hasError('required')).toBeTrue();
  });

  it('onTypeChange limpia dueDate para Contado', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.form.get('type')?.setValue(InvoiceType.Credito);
    component.onTypeChange();
    component.form.get('dueDate')?.setValue(new Date());
    component.form.get('type')?.setValue(InvoiceType.Contado);
    component.onTypeChange();
    expect(component.form.get('dueDate')?.value).toBeNull();
  });

  it('invoiceTotal calcula la suma correcta', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.detailsFormArray.at(0).patchValue({ quantity: 2, unitPrice: 100 });
    expect(component.invoiceTotal()).toBe(200);
    component.addDetailLine();
    component.detailsFormArray.at(1).patchValue({ quantity: 3, unitPrice: 50 });
    expect(component.invoiceTotal()).toBe(350);
  });

  it('formulario invalido sin cliente', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.form.get('customerId')?.setValue(null);
    component.form.get('customerId')?.markAsTouched();
    expect(component.form.valid).toBeFalse();
  });

  it('onSubmit llama a invoicesService.create', async () => {
    setup();
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(InvoiceFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    const service = TestBed.inject(InvoicesService) as jasmine.SpyObj<InvoicesService>;
    service.create.and.returnValue(of({} as InvoiceResponse));
    component.form.get('customerId')?.setValue(1);
    component.form.get('type')?.setValue(InvoiceType.Contado);
    component.detailsFormArray.at(0).patchValue({
      productId: 1,
      productName: 'Test Product',
      productCode: 'P001',
      quantity: 2,
      unitPrice: 100,
    });
    component.onSubmit();
    expect(service.create).toHaveBeenCalled();
  });
});
