import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from './api.types';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }

  register(request: {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    roleId: number;
  }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, request);
  }

  changePassword(request: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/change-password`, request);
  }
}
