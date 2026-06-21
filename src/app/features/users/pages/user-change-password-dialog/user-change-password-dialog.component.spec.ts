import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserChangePasswordDialogComponent } from './user-change-password-dialog.component';
import { UsersService } from '../../../../core/api/users.service';

describe('UserChangePasswordDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChangePasswordDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: UsersService, useValue: jasmine.createSpyObj('UsersService', ['changePassword']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    }).compileComponents();
  });

  it('se crea correctamente', () => {
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('formulario vacio es invalido', () => {
    const fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });
});
