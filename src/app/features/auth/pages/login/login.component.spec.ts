import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthState } from '../../../../core/auth/auth.state';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        AuthState,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('formulario vacio es invalido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('formulario con datos validos es valido', () => {
    component.form.patchValue({ userName: 'admin', password: 'Admin123!' });
    expect(component.form.valid).toBeTrue();
  });

  it('submit exitoso llama a login con los datos del formulario', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'x', user: { id: 1, userName: 'admin', email: 'a@b.com', firstName: 'A', lastName: 'B', role: 'Admin', roleId: 1, mustChangePassword: false } }));

    component.form.patchValue({ userName: 'admin', password: 'Admin123!' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin', 'Admin123!');
  });

  it('no llama login si formulario invalido', () => {
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});
