import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse, PagedResult } from './api.types';

export interface CreateUserParams {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface UpdateUserParams {
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

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

  create(data: CreateUserParams): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.baseUrl, data);
  }

  update(id: number, data: UpdateUserParams): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  changePassword(data: ChangePasswordParams): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/change-password`, data);
  }
}
