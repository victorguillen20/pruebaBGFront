import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleResponse } from './api.types';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/roles`;

  list(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.baseUrl);
  }
}
