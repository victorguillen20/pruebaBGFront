import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuResponse } from './api.types';

@Injectable({ providedIn: 'root' })
export class MenusService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/me/menus`;

  getMyMenus(): Observable<MenuResponse[]> {
    return this.http.get<MenuResponse[]>(this.baseUrl);
  }
}
