import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyConfigResponse } from './api.types';

export interface UpdateCompanyConfigParams {
  companyName: string;
  taxPercent: number;
  currencySymbol: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
}

@Injectable({ providedIn: 'root' })
export class CompanyConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/company-config`;

  readonly config = signal<CompanyConfigResponse | null>(null);
  readonly logoUrl = signal<string | null>(null);
  readonly symbol = computed(() => this.config()?.currencySymbol ?? '$');

  get(): Observable<CompanyConfigResponse> {
    return this.http.get<CompanyConfigResponse>(this.baseUrl);
  }

  load(): void {
    this.get().subscribe({
      next: (c) => {
        this.config.set(c);
        this.logoUrl.set(c.logoUrl);
      },
    });
  }

  update(data: UpdateCompanyConfigParams): Observable<CompanyConfigResponse> {
    return this.http.put<CompanyConfigResponse>(this.baseUrl, data);
  }

  uploadLogo(file: File): Observable<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ logoUrl: string }>(`${this.baseUrl}/logo`, formData);
  }
}
