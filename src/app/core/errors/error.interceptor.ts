import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('auth_token');
        router.navigateByUrl('/login');
        return throwError(() => error);
      }

      const status = error.status;
      let message: string | null = null;

      if (status === 0) {
        message = 'Error de conexión con el servidor';
      } else if (status === 403) {
        message = 'No tiene permisos para realizar esta acción';
      } else if (status >= 500) {
        message = 'Error interno del servidor';
      }

      if (message) {
        snackBar.open(message, 'Cerrar', { duration: 5000, politeness: 'assertive' });
      }

      return throwError(() => error);
    }),
  );
};
