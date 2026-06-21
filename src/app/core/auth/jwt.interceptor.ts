import { HttpInterceptorFn } from '@angular/common/http';

const EXCLUDED_URLS = ['/api/auth/login', '/health'];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const isExcluded = EXCLUDED_URLS.some((url) => req.url.includes(url));

  if (isExcluded) return next(req);

  const token = localStorage.getItem('auth_token');
  if (!token) return next(req);

  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(cloned);
};
