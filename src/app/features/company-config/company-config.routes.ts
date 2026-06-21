import { Routes } from '@angular/router';
import { adminGuard } from '../../core/auth/auth.guard';

export const COMPANY_CONFIG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/company-config/company-config.component').then((m) => m.CompanyConfigComponent),
    canActivate: [adminGuard],
  },
];
