import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerFormDialogComponent, CustomerFormData } from './customer-form-dialog.component';
import { CustomersService } from '../../../../core/api/customers.service';
import { CustomerType } from '../../../../core/api/api.types';

describe('CustomerFormDialogComponent', () => {
  function setupDialog(data: CustomerFormData) {
    TestBed.configureTestingModule({
      imports: [CustomerFormDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: CustomersService, useValue: jasmine.createSpyObj('CustomersService', ['create', 'update']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    }).compileComponents();
  }

  it('se crea correctamente en modo create', async () => {
    setupDialog({ mode: 'create' });
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(CustomerFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isEdit).toBeFalse();
  });

  it('modo edit patchValues al formulario', async () => {
    const editData: CustomerFormData = {
      mode: 'edit',
      customer: {
        id: 1, identification: '0010123456789', name: 'Test Client',
        phone: '555100', email: 'test@test.com', address: 'Address',
        type: CustomerType.Empresa, isActive: true, creditLimit: 5000,
        createdAt: '2025-01-01T00:00:00',
      },
    };
    setupDialog(editData);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(CustomerFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.get('name')?.value).toBe('Test Client');
    expect(component.form.get('identification')?.value).toBe('0010123456789');
    expect(component.form.get('type')?.value).toBe(CustomerType.Empresa);
  });

  it('normaliza identificacion al input', async () => {
    setupDialog({ mode: 'create' });
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(CustomerFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.onIdentificationInput('001-0123456-7');
    expect(component.form.get('identification')?.value).toBe('00101234567');
  });

  it('normaliza telefono al input', async () => {
    setupDialog({ mode: 'create' });
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(CustomerFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.onPhoneInput('555-100');
    expect(component.form.get('phone')?.value).toBe('555100');
  });
});
