import { Routes } from '@angular/router';

export const INVOICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/invoice-list/invoice-list.component').then((m) => m.InvoiceListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/invoice-detail/invoice-detail.component').then((m) => m.InvoiceDetailComponent),
  },
];
