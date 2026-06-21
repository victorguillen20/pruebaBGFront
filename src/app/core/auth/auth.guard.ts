import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthState } from './auth.state';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthState);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthState);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  if (auth.isAdmin()) return true;
  snackBar.open('No tiene permisos para acceder a esta página', 'Cerrar', { duration: 5000 });
  return router.parseUrl('/dashboard');
};
