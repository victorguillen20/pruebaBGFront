import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../../../core/api/products.service';
import { CategoriesService } from '../../../../core/api/categories.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', ['search', 'delete']);
    productsServiceSpy.search.and.returnValue(of({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }));

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        {
          provide: CategoriesService,
          useValue: jasmine.createSpyObj('CategoriesService', ['search'], {
            search: jasmine.createSpy('search').and.returnValue(of({ items: [], total: 0, page: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false })),
          }),
        },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(false) }) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('carga productos al iniciar', () => {
    expect(productsServiceSpy.search).toHaveBeenCalled();
  });

  it('tiene columna acciones definida', () => {
    expect(component.displayedColumns).toContain('acciones');
  });

  it('openCreateDialog abre el dialogo correcto', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openCreateDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openEditDialog abre el dialogo correcto', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openEditDialog({
      id: 1, code: 'BE-001', name: 'Test', description: null,
      price: 100, cost: null, stock: 10, categoryId: 1, categoryName: 'Bebidas',
      isActive: true, createdAt: '2025-01-01T00:00:00',
    });
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openDeleteDialog abre el dialogo correcto', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.openDeleteDialog({
      id: 1, code: 'BE-001', name: 'Test', description: null,
      price: 100, cost: null, stock: 10, categoryId: 1, categoryName: 'Bebidas',
      isActive: true, createdAt: '2025-01-01T00:00:00',
    });
    expect(dialogSpy).toHaveBeenCalled();
  });
});
