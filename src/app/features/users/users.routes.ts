import { Routes } from '@angular/router';
import { adminGuard } from '../../core/auth/auth.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-list/user-list.component').then((m) => m.UserListComponent),
    canActivate: [adminGuard],
  },
];
