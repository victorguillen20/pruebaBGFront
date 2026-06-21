import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryResponse, PagedResult } from './api.types';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/categories`;

  search(params: {
    search?: string;
    page: number;
    pageSize: number;
  }): Observable<PagedResult<CategoryResponse>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PagedResult<CategoryResponse>>(this.baseUrl, { params: httpParams });
  }
}
