import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse, PagedResult } from './api.types';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  search(params: {
    search?: string;
    roleId?: number;
    page: number;
    pageSize: number;
  }): Observable<PagedResult<UserResponse>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.roleId) httpParams = httpParams.set('roleId', params.roleId);
    return this.http.get<PagedResult<UserResponse>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }
}
