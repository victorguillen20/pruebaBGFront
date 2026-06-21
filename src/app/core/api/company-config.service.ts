import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyConfigResponse } from './api.types';

@Injectable({ providedIn: 'root' })
export class CompanyConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/company-config`;

  readonly config = signal<CompanyConfigResponse | null>(null);
  readonly symbol = computed(() => this.config()?.currencySymbol ?? '$');

  get(): Observable<CompanyConfigResponse> {
    return this.http.get<CompanyConfigResponse>(this.baseUrl);
  }

  load(): void {
    this.get().subscribe({
      next: (c) => this.config.set(c),
    });
  }
}
