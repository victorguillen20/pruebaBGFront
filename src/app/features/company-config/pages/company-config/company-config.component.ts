import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyConfigService, UpdateCompanyConfigParams } from '../../../../core/api/company-config.service';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner.component';

@Component({
  selector: 'app-company-config',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
  ],
  templateUrl: './company-config.component.html',
  styleUrl: './company-config.component.scss',
})
export class CompanyConfigComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly configService = inject(CompanyConfigService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly uploading = signal(false);
  readonly error = signal('');
  readonly previewUrl = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    companyName: ['', Validators.required],
    phone: [''],
    email: ['', [Validators.email]],
    taxPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    currencySymbol: ['$', [Validators.required, Validators.maxLength(5)]],
    address: [''],
    city: [''],
    region: [''],
    postalCode: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.configService.get()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (cfg) => {
          this.form.patchValue({
            companyName: cfg.companyName,
            phone: cfg.phone ?? '',
            email: cfg.email ?? '',
            taxPercent: cfg.taxPercent,
            currencySymbol: cfg.currencySymbol,
            address: cfg.address ?? '',
            city: cfg.city ?? '',
            region: cfg.region ?? '',
            postalCode: cfg.postalCode ?? '',
          });
          this.previewUrl.set(cfg.logoUrl);
        },
        error: () => this.error.set('Error al cargar la configuración'),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const val = this.form.value;
    const data: UpdateCompanyConfigParams = {
      companyName: val.companyName,
      taxPercent: val.taxPercent,
      currencySymbol: val.currencySymbol,
      phone: val.phone || null,
      email: val.email || null,
      address: val.address || null,
      city: val.city || null,
      region: val.region || null,
      postalCode: val.postalCode || null,
    };

    this.configService.update(data)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (cfg) => {
          this.configService.config.set(cfg);
          this.snackBar.open('Configuración actualizada exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error al actualizar la configuración', 'Cerrar', { duration: 3000 }),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploading.set(true);
    this.configService.uploadLogo(file)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: (result) => {
          this.configService.logoUrl.set(result.logoUrl);
          this.snackBar.open('Logo actualizado exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error al subir el logo', 'Cerrar', { duration: 3000 }),
      });
  }
}
