import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError, of, tap } from 'rxjs';
import { AuthApiService } from '../api/auth.service';
import { MeService } from '../api/me.service';
import { AuthState } from './auth.state';
import { UserInfo } from '../api/api.types';
import { User } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = inject(AuthState);
  private readonly authApi = inject(AuthApiService);
  private readonly meService = inject(MeService);
  private readonly router = inject(Router);

  login(userName: string, password: string) {
    return this.authApi.login({ userName, password }).pipe(
      tap((response) => {
        localStorage.setItem('auth_token', response.token);
        this.authState.currentUser.set(this.toUser(response.user));
      }),
      map((response) => response),
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.authState.currentUser.set(null);
    this.authState.menus.set([]);
    this.router.navigateByUrl('/login');
  }

  restoreSession() {
    const token = localStorage.getItem('auth_token');
    if (!token) return of(null);

    return this.meService.getCurrentUser().pipe(
      tap((userInfo) => this.authState.currentUser.set(this.toUser(userInfo))),
      catchError(() => {
        localStorage.removeItem('auth_token');
        return of(null);
      }),
    );
  }

  updateCurrentUser(user: User): void {
    this.authState.currentUser.set(user);
  }

  private toUser(userInfo: UserInfo): User {
    return {
      id: userInfo.id,
      userName: userInfo.userName,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      role: userInfo.role,
      roleId: userInfo.roleId,
      mustChangePassword: userInfo.mustChangePassword,
    };
  }
}
