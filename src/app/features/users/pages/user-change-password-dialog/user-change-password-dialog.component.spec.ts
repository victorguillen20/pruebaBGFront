import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserChangePasswordDialogComponent } from './user-change-password-dialog.component';
import { UsersService } from '../../../../core/api/users.service';
import { AuthState } from '../../../../core/auth/auth.state';
import { UserResponse } from '../../../../core/api/api.types';

const OTHER_USER: UserResponse = {
  id: 2,
  userName: 'vendor1',
  email: 'vendor1@bg.com',
  firstName: 'Maria',
  lastName: 'Gonzalez',
  roleId: 2,
  role: 'Vendedor',
  isActive: true,
  mustChangePassword: false,
  createdAt: '2026-06-21T00:00:00Z',
};

const CURRENT_USER: UserResponse = {
  id: 1,
  userName: 'admin',
  email: 'admin@bg.com',
  firstName: 'System',
  lastName: 'Admin',
  roleId: 1,
  role: 'Admin',
  isActive: true,
  mustChangePassword: false,
  createdAt: '2026-06-21T00:00:00Z',
};

function setupDialog(targetUser: UserResponse, currentUser: UserResponse | null) {
  TestBed.configureTestingModule({
    imports: [UserChangePasswordDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { user: targetUser } },
      { provide: MatDialogRef, useValue: { close: () => {} } },
      { provide: UsersService, useValue: jasmine.createSpyObj('UsersService', ['changePassword']) },
      { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      {
        provide: AuthState,
        useValue: { currentUser: signal(currentUser) },
      },
    ],
  }).compileComponents();
}

describe('UserChangePasswordDialogComponent', () => {
  it('se crea correctamente', async () => {
    setupDialog(OTHER_USER, CURRENT_USER);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('formulario vacio es invalido', async () => {
    setupDialog(OTHER_USER, CURRENT_USER);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });

  it('isSelf es false cuando el target NO es el current user', async () => {
    setupDialog(OTHER_USER, CURRENT_USER);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isSelf()).toBeFalse();
  });

  it('isSelf es true cuando el target es el current user', async () => {
    setupDialog(CURRENT_USER, CURRENT_USER);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isSelf()).toBeTrue();
  });

  it('muestra warning si NO es self', async () => {
    setupDialog(OTHER_USER, CURRENT_USER);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    fixture.detectChanges();
    const warning = fixture.nativeElement.querySelector('.not-self-warning');
    expect(warning).toBeTruthy();
  });

  it('NO muestra warning si ES self', async () => {
    setupDialog(CURRENT_USER, CURRENT_USER);
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    fixture.detectChanges();
    const warning = fixture.nativeElement.querySelector('.not-self-warning');
    expect(warning).toBeFalsy();
  });
});
