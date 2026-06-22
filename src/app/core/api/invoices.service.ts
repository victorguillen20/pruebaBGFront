import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InvoiceResponse, InvoiceSummaryResponse, PagedResult, InvoiceStatus, CreateInvoiceRequest } from './api.types';

export interface InvoiceSearchParams {
  search?: string;
  customerId?: number;
  sellerId?: number;
  status?: InvoiceStatus;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/invoices`;

  search(params: InvoiceSearchParams): Observable<PagedResult<InvoiceSummaryResponse>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.customerId) httpParams = httpParams.set('customerId', params.customerId);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.fromDate) httpParams = httpParams.set('fromDate', params.fromDate);
    if (params.toDate) httpParams = httpParams.set('toDate', params.toDate);
    return this.http.get<PagedResult<InvoiceSummaryResponse>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateInvoiceRequest): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(this.baseUrl, request);
  }

  cancel(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
