import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserInfo } from './api.types';

@Injectable({ providedIn: 'root' })
export class MeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/me`;

  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl);
  }
}
