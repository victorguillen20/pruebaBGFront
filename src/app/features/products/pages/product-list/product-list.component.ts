import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, Subject, distinctUntilChanged } from 'rxjs';
import { ProductsService, ProductSearchParams } from '../../../../core/api/products.service';
import { CategoriesService } from '../../../../core/api/categories.service';
import { ProductResponse, CategoryResponse, PagedResult } from '../../../../core/api/api.types';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';
import { BgCurrencyPipe } from '../../../../shared/pipes/bg-currency.pipe';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';
import { ProductDeleteDialogComponent } from '../product-delete-dialog/product-delete-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    BgCurrencyPipe,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly data = signal<PagedResult<ProductResponse> | null>(null);
  readonly categories = signal<CategoryResponse[]>([]);

  readonly searchTerm = signal('');
  readonly categoryFilter = signal<number | ''>('');
  private readonly searchSubject = new Subject<string>();

  readonly displayedColumns = ['code', 'name', 'categoryName', 'price', 'cost', 'stock', 'isActive', 'acciones'];

  page = 1;
  pageSize = 10;
  total = 0;

  ngOnInit(): void {
    this.categoriesService.search({ page: 1, pageSize: 100 }).subscribe({
      next: (r) => this.categories.set(r.items),
    });
    this.load();

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.page = 1;
      this.load();
    });
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    const params: ProductSearchParams = { page: this.page, pageSize: this.pageSize };
    if (this.searchTerm()) params.search = this.searchTerm();
    if (this.categoryFilter()) params.categoryId = this.categoryFilter() as number;

    this.productsService.search(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => { this.data.set(result); this.total = result.total; },
        error: () => this.error.set('Error al cargar los productos'),
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  private getExistingCodes(): string[] {
    return this.data()?.items.map(p => p.code) ?? [];
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(ProductFormDialogComponent, {
      width: '550px',
      data: {
        mode: 'create',
        existingCodes: this.getExistingCodes(),
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openEditDialog(product: ProductResponse): void {
    const ref = this.dialog.open(ProductFormDialogComponent, {
      width: '550px',
      data: {
        mode: 'edit',
        product,
        existingCodes: this.getExistingCodes(),
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.load();
      }
    });
  }

  openDeleteDialog(product: ProductResponse): void {
    const ref = this.dialog.open(ProductDeleteDialogComponent, {
      width: '400px',
      data: product,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.productsService.delete(product.id).subscribe({
        next: () => {
          this.snackBar.open('Producto desactivado exitosamente', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Error al desactivar el producto', 'Cerrar', { duration: 3000 }),
      });
    });
  }
}
