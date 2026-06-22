import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { ProductsService } from '../../../../core/api/products.service';
import { CategoriesService } from '../../../../core/api/categories.service';
import { ProductResponse, CategoryResponse } from '../../../../core/api/api.types';
import { ProductCode, resolveCategoryPrefix } from '../../utils/product-code';

export interface ProductFormData {
  mode: 'create' | 'edit';
  product?: ProductResponse;
  existingCodes: string[];
}

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './product-form-dialog.component.html',
  styleUrl: './product-form-dialog.component.scss',
})
export class ProductFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly dialogRef = inject(MatDialogRef<ProductFormDialogComponent>);
  readonly data = inject<ProductFormData>(MAT_DIALOG_DATA);
  private readonly snackBar = inject(MatSnackBar);

  readonly isEdit = this.data.mode === 'edit';
  readonly saving = signal(false);
  readonly categories = signal<CategoryResponse[]>([]);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      cost: [null as number | null],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null as number | null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoriesService.search({ page: 1, pageSize: 100 }).subscribe({
      next: (r) => {
        this.categories.set(r.items);
        if (this.isEdit && this.data.product) {
          this.form.patchValue({
            code: this.data.product.code,
            name: this.data.product.name,
            description: this.data.product.description ?? '',
            price: this.data.product.price,
            cost: this.data.product.cost,
            stock: this.data.product.stock,
            categoryId: this.data.product.categoryId,
          });
        } else if (r.items.length > 0) {
          this.form.patchValue({ categoryId: r.items[0].id });
          this.regenerateCode();
        }
      },
    });
  }

  onCategoryChange(): void {
    if (this.isEdit) return;
    this.regenerateCode();
  }

  regenerateCode(): void {
    const categoryId = this.form.get('categoryId')?.value;
    if (!categoryId) return;
    const category = this.categories().find(c => c.id === categoryId);
    if (!category) return;
    const prefix = resolveCategoryPrefix(category.name);
    if (!prefix) return;
    const newCode = ProductCode.generate(prefix, this.data.existingCodes);
    this.form.get('code')?.setValue(newCode);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const val = this.form.value;

    if (this.data.mode === 'create') {
      this.productsService.create({
        code: val.code,
        name: val.name,
        description: val.description || null,
        price: val.price,
        cost: val.cost ?? null,
        stock: val.stock,
        categoryId: val.categoryId,
      }).pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => this.snackBar.open('Error al crear el producto', 'Cerrar', { duration: 3000 }),
        });
    } else {
      this.productsService.update(this.data.product!.id, {
        name: val.name,
        description: val.description || null,
        price: val.price,
        cost: val.cost ?? null,
        categoryId: val.categoryId,
      }).pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => this.snackBar.open('Error al actualizar el producto', 'Cerrar', { duration: 3000 }),
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
