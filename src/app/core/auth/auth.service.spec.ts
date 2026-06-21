import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { AuthState } from './auth.state';
import { MeService } from '../api/me.service';
import { AuthApiService } from '../api/auth.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let authState: AuthState;
  let authApiSpy: jasmine.SpyObj<AuthApiService>;
  let meServiceSpy: jasmine.SpyObj<MeService>;

  beforeEach(() => {
    localStorage.clear();
    const authApiMock = jasmine.createSpyObj('AuthApiService', ['login']);
    const meServiceMock = jasmine.createSpyObj('MeService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        AuthState,
        { provide: AuthApiService, useValue: authApiMock },
        { provide: MeService, useValue: meServiceMock },
      ],
    });

    service = TestBed.inject(AuthService);
    authState = TestBed.inject(AuthState);
    authApiSpy = TestBed.inject(AuthApiService) as jasmine.SpyObj<AuthApiService>;
    meServiceSpy = TestBed.inject(MeService) as jasmine.SpyObj<MeService>;
  });

  it('login exitoso guarda token y actualiza currentUser', () => {
    const mockResponse = {
      token: 'test-token-123',
      user: { id: 1, userName: 'admin', email: 'admin@bg.com', firstName: 'Admin', lastName: 'User', role: 'Admin', roleId: 1, mustChangePassword: false },
    };
    authApiSpy.login.and.returnValue(of(mockResponse));

    service.login('admin', 'Admin123!').subscribe();

    expect(authApiSpy.login).toHaveBeenCalledWith({ userName: 'admin', password: 'Admin123!' });
    expect(localStorage.getItem('auth_token')).toBe('test-token-123');
    expect(authState.currentUser()?.userName).toBe('admin');
    expect(authState.isAuthenticated()).toBeTrue();
  });

  it('login con error no modifica el estado', () => {
    authApiSpy.login.and.returnValue(throwError(() => ({ status: 400 })));

    service.login('bad', 'creds').subscribe({ error: () => {} });

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(authState.currentUser()).toBeNull();
    expect(authState.isAuthenticated()).toBeFalse();
  });

  it('logout limpia localStorage y currentUser', () => {
    localStorage.setItem('auth_token', 'test-token');
    authState.currentUser.set({ id: 1, userName: 'admin', email: 'a@b.com', firstName: 'A', lastName: 'B', role: 'Admin', roleId: 1, mustChangePassword: false });

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(authState.currentUser()).toBeNull();
    expect(authState.isAuthenticated()).toBeFalse();
  });

  it('restoreSession con token valido pobla currentUser', () => {
    localStorage.setItem('auth_token', 'valid-token');
    const userInfo = { id: 1, userName: 'admin', email: 'a@b.com', firstName: 'A', lastName: 'B', role: 'Admin', roleId: 1, mustChangePassword: false };
    meServiceSpy.getCurrentUser.and.returnValue(of(userInfo));

    service.restoreSession().subscribe();

    expect(authState.currentUser()?.userName).toBe('admin');
    expect(authState.isAuthenticated()).toBeTrue();
  });

  it('restoreSession con token invalido limpia estado', () => {
    localStorage.setItem('auth_token', 'bad-token');
    meServiceSpy.getCurrentUser.and.returnValue(throwError(() => ({ status: 401 })));

    service.restoreSession().subscribe();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(authState.currentUser()).toBeNull();
  });

  it('restoreSession sin token retorna null sin llamar API', () => {
    service.restoreSession().subscribe((r) => expect(r).toBeNull());
    expect(meServiceSpy.getCurrentUser).not.toHaveBeenCalled();
  });
});
