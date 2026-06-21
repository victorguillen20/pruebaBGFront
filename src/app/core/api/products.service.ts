import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductResponse, PagedResult } from './api.types';

export interface ProductSearchParams {
  search?: string;
  categoryId?: number;
  onlyActive?: boolean;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/products`;

  search(params: ProductSearchParams): Observable<PagedResult<ProductResponse>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.onlyActive) httpParams = httpParams.set('onlyActive', 'true');
    return this.http.get<PagedResult<ProductResponse>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/${id}`);
  }
}
