import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummaryResponse } from './api.types';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/dashboard`;

  getSummary(): Observable<DashboardSummaryResponse> {
    return this.http.get<DashboardSummaryResponse>(this.baseUrl);
  }
}
