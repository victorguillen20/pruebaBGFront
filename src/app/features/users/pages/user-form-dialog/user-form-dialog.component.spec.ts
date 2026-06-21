import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserFormDialogComponent, UserFormData } from './user-form-dialog.component';
import { UsersService } from '../../../../core/api/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('UserFormDialogComponent', () => {
  const createData: UserFormData = { mode: 'create' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: createData },
        { provide: UsersService, useValue: jasmine.createSpyObj('UsersService', ['create', 'update']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    }).compileComponents();
  });

  it('se crea correctamente en modo create', () => {
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isEdit).toBeFalse();
  });

  it('modo edit patchValues al formulario', () => {
    const editData: UserFormData = {
      mode: 'edit',
      user: {
        id: 1, userName: 'admin', email: 'admin@bg.com',
        firstName: 'Admin', lastName: 'User', roleId: 1, role: 'Admin',
        isActive: true, mustChangePassword: false, createdAt: '2025-01-01T00:00:00',
      },
    };
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: editData });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: editData },
        { provide: UsersService, useValue: jasmine.createSpyObj('UsersService', ['create', 'update']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.get('firstName')?.value).toBe('Admin');
  });
});
