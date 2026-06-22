import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ProductFormDialogComponent, ProductFormData } from './product-form-dialog.component';
import { ProductsService } from '../../../../core/api/products.service';
import { CategoriesService } from '../../../../core/api/categories.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ProductFormDialogComponent', () => {
  function setupDialog(data: ProductFormData, categories: { id: number; name: string; isActive: boolean }[] = []) {
    TestBed.configureTestingModule({
      imports: [ProductFormDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: ProductsService, useValue: jasmine.createSpyObj('ProductsService', ['create', 'update']) },
        {
          provide: CategoriesService,
          useValue: {
            search: () => of({ items: categories, total: categories.length, page: 1, pageSize: 100, totalPages: 1, hasPreviousPage: false, hasNextPage: false }),
          },
        },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    }).compileComponents();
  }

  it('se crea correctamente en modo create', async () => {
    setupDialog({ mode: 'create', existingCodes: [] });
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(ProductFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isEdit).toBeFalse();
  });

  it('modo edit patchValues al formulario', async () => {
    const editData: ProductFormData = {
      mode: 'edit',
      product: {
        id: 1, code: 'BE-001', name: 'Test Product', description: 'Desc',
        price: 100, cost: 50, stock: 10, categoryId: 1, categoryName: 'Bebidas',
        isActive: true, createdAt: '2025-01-01T00:00:00',
      },
      existingCodes: [],
    };
    setupDialog(editData, [{ id: 1, name: 'Bebidas', isActive: true }]);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(ProductFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.get('name')?.value).toBe('Test Product');
    expect(component.form.get('code')?.value).toBe('BE-001');
  });

  it('create mode pre-selecciona primera categoría y genera código al cargar categorías', async () => {
    setupDialog(
      { mode: 'create', existingCodes: ['BE-001', 'BE-002'] },
      [
        { id: 1, name: 'Bebidas', isActive: true },
        { id: 2, name: 'Panadería', isActive: true },
      ],
    );
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(ProductFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.get('categoryId')?.value).toBe(1);
    expect(component.form.get('code')?.value).toBe('BE-003');
  });

  it('create mode con lista de categorías vacía deja código vacío', async () => {
    setupDialog({ mode: 'create', existingCodes: [] }, []);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(ProductFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.get('categoryId')?.value).toBeNull();
    expect(component.form.get('code')?.value).toBe('');
  });
});
