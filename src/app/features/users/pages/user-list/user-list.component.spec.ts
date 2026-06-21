import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UsersService } from '../../../../core/api/users.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['search', 'deleteUser']);
    usersServiceSpy.search.and.returnValue(of({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }));

    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(false) }) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('carga usuarios al iniciar', () => {
    expect(usersServiceSpy.search).toHaveBeenCalled();
  });

  it('tiene columnas definidas', () => {
    expect(component.displayedColumns).toContain('acciones');
  });
});
