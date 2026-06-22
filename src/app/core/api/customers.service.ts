import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerResponse, PagedResult, CreateCustomerRequest, UpdateCustomerRequest } from './api.types';

export interface CustomerSearchParams {
  search?: string;
  activeOnly?: boolean;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/customers`;

  search(params: CustomerSearchParams): Observable<PagedResult<CustomerResponse>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.activeOnly !== undefined) httpParams = httpParams.set('activeOnly', String(params.activeOnly));
    return this.http.get<PagedResult<CustomerResponse>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateCustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.baseUrl, request);
  }

  update(id: number, request: UpdateCustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
