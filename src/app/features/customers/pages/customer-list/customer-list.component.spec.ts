import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CustomerListComponent } from './customer-list.component';
import { CustomersService } from '../../../../core/api/customers.service';
import { CustomerType } from '../../../../core/api/api.types';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let customersServiceSpy: jasmine.SpyObj<CustomersService>;

  beforeEach(async () => {
    customersServiceSpy = jasmine.createSpyObj('CustomersService', ['search', 'delete']);
    customersServiceSpy.search.and.returnValue(of({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }));

    await TestBed.configureTestingModule({
      imports: [CustomerListComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: CustomersService, useValue: customersServiceSpy },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(false) }) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('carga clientes al iniciar', () => {
    expect(customersServiceSpy.search).toHaveBeenCalled();
  });

  it('tiene columna acciones definida', () => {
    expect(component.displayedColumns).toContain('acciones');
  });

  it('customerTypeLabel retorna Persona para CustomerType.Persona', () => {
    expect(component.customerTypeLabel(CustomerType.Persona)).toBe('Persona');
  });

  it('customerTypeLabel retorna Empresa para CustomerType.Empresa', () => {
    expect(component.customerTypeLabel(CustomerType.Empresa)).toBe('Empresa');
  });

  it('customerTypeLabel retorna Persona para string "Persona"', () => {
    expect(component.customerTypeLabel('Persona' as unknown as CustomerType)).toBe('Persona');
  });

  it('customerTypeLabel retorna Empresa para string "Empresa"', () => {
    expect(component.customerTypeLabel('Empresa' as unknown as CustomerType)).toBe('Empresa');
  });

  it('customerTypeLabel retorna Persona para numero 1', () => {
    expect(component.customerTypeLabel(1 as unknown as CustomerType)).toBe('Persona');
  });

  it('customerTypeLabel retorna Empresa para numero 2', () => {
    expect(component.customerTypeLabel(2 as unknown as CustomerType)).toBe('Empresa');
  });

  it('customerTypeLabel retorna string vacia para valores desconocidos', () => {
    expect(component.customerTypeLabel(99 as unknown as CustomerType)).toBe('');
    expect(component.customerTypeLabel('' as unknown as CustomerType)).toBe('');
    expect(component.customerTypeLabel(undefined as unknown as CustomerType)).toBe('');
  });

  it('openCreateDialog abre el dialogo correcto', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openCreateDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openEditDialog abre el dialogo correcto', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openEditDialog({
      id: 1, identification: '0010123456789', name: 'Test', phone: null, email: null,
      address: null, type: CustomerType.Persona, isActive: true, creditLimit: null,
      createdAt: '2025-01-01T00:00:00',
    });
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openDeleteDialog abre el dialogo correcto', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openDeleteDialog({
      id: 1, identification: '0010123456789', name: 'Test', phone: null, email: null,
      address: null, type: CustomerType.Persona, isActive: true, creditLimit: null,
      createdAt: '2025-01-01T00:00:00',
    });
    expect(dialogSpy).toHaveBeenCalled();
  });
});
