import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { InvoiceListComponent } from './invoice-list.component';
import { InvoicesService } from '../../../../core/api/invoices.service';
import { InvoiceType, InvoiceStatus } from '../../../../core/api/api.types';

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let invoicesServiceSpy: jasmine.SpyObj<InvoicesService>;

  beforeEach(async () => {
    invoicesServiceSpy = jasmine.createSpyObj('InvoicesService', ['search', 'cancel', 'downloadPdf']);
    invoicesServiceSpy.search.and.returnValue(of({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }));

    await TestBed.configureTestingModule({
      imports: [InvoiceListComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: InvoicesService, useValue: invoicesServiceSpy },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(false) }) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('carga facturas al iniciar', () => {
    expect(invoicesServiceSpy.search).toHaveBeenCalled();
  });

  it('tiene columna acciones definida', () => {
    expect(component.displayedColumns).toContain('acciones');
  });

  it('typeLabel retorna Contado para InvoiceType.Contado', () => {
    expect(component.typeLabel(InvoiceType.Contado)).toBe('Contado');
  });

  it('typeLabel retorna Crédito para InvoiceType.Credito', () => {
    expect(component.typeLabel(InvoiceType.Credito)).toBe('Crédito');
  });

  it('typeLabel retorna Contado para string "Contado"', () => {
    expect(component.typeLabel('Contado' as unknown as InvoiceType)).toBe('Contado');
  });

  it('typeLabel retorna Crédito para string "Credito"', () => {
    expect(component.typeLabel('Credito' as unknown as InvoiceType)).toBe('Crédito');
  });

  it('typeLabel retorna Contado para numero 1', () => {
    expect(component.typeLabel(1 as unknown as InvoiceType)).toBe('Contado');
  });

  it('typeLabel retorna Crédito para numero 2', () => {
    expect(component.typeLabel(2 as unknown as InvoiceType)).toBe('Crédito');
  });

  it('typeLabel retorna string vacia para valores desconocidos', () => {
    expect(component.typeLabel(99 as unknown as InvoiceType)).toBe('');
    expect(component.typeLabel('' as unknown as InvoiceType)).toBe('');
    expect(component.typeLabel(undefined as unknown as InvoiceType)).toBe('');
  });

  it('statusLabel retorna Pendiente para InvoiceStatus.Pendiente', () => {
    expect(component.statusLabel(InvoiceStatus.Pendiente)).toBe('Pendiente');
  });

  it('statusLabel retorna Pagada para InvoiceStatus.Pagada', () => {
    expect(component.statusLabel(InvoiceStatus.Pagada)).toBe('Pagada');
  });

  it('statusLabel retorna Anulada para InvoiceStatus.Anulada', () => {
    expect(component.statusLabel(InvoiceStatus.Anulada)).toBe('Anulada');
  });

  it('statusLabel retorna Pendiente para string "Pendiente"', () => {
    expect(component.statusLabel('Pendiente' as unknown as InvoiceStatus)).toBe('Pendiente');
  });

  it('statusLabel retorna Pagada para string "Pagada"', () => {
    expect(component.statusLabel('Pagada' as unknown as InvoiceStatus)).toBe('Pagada');
  });

  it('statusLabel retorna Anulada para string "Anulada"', () => {
    expect(component.statusLabel('Anulada' as unknown as InvoiceStatus)).toBe('Anulada');
  });

  it('statusLabel retorna string vacia para valores desconocidos', () => {
    expect(component.statusLabel(99 as unknown as InvoiceStatus)).toBe('');
    expect(component.statusLabel('' as unknown as InvoiceStatus)).toBe('');
    expect(component.statusLabel(undefined as unknown as InvoiceStatus)).toBe('');
  });

  it('openCreateDialog abre el dialogo correcto', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openCreateDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openCancelDialog abre el dialogo de cancelacion', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openCancelDialog({
      id: 1, number: 1001, date: '2026-01-15T00:00:00',
      customerName: 'Test', sellerName: 'Seller',
      type: InvoiceType.Contado, status: InvoiceStatus.Pendiente,
      total: 100,
    });
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('downloadInvoice llama al servicio downloadPdf', () => {
    const blob = new Blob(['%PDF-'], { type: 'application/pdf' });
    invoicesServiceSpy.downloadPdf.and.returnValue(of(blob));

    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');
    const openSpy = spyOn(window, 'open');

    component.downloadInvoice({
      id: 1, number: 1001, date: '2026-01-15T00:00:00',
      customerName: 'Test', sellerName: 'Seller',
      type: InvoiceType.Contado, status: InvoiceStatus.Pendiente,
      total: 100,
    });

    expect(invoicesServiceSpy.downloadPdf).toHaveBeenCalledWith(1);
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(openSpy).toHaveBeenCalledWith('blob:test', '_blank');
  });
});
