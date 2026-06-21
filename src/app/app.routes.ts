import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES) },
      { path: 'invoices', loadChildren: () => import('./features/invoices/invoices.routes').then((m) => m.INVOICES_ROUTES) },
      { path: 'products', loadChildren: () => import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES) },
      { path: 'customers', loadChildren: () => import('./features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES) },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./layout/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
