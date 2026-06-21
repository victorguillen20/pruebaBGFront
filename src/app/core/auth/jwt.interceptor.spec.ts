import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('agrega Authorization Bearer cuando hay token', () => {
    localStorage.setItem('auth_token', 'my-token');

    httpClient.get('/api/invoices').subscribe();
    const req = httpMock.expectOne('/api/invoices');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush([]);
  });

  it('no agrega header cuando no hay token', () => {
    httpClient.get('/api/invoices').subscribe();
    const req = httpMock.expectOne('/api/invoices');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('salta /api/auth/login aunque haya token', () => {
    localStorage.setItem('auth_token', 'my-token');

    httpClient.post('/api/auth/login', {}).subscribe();
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ token: 'x', user: {} });
  });

  it('salta /health aunque haya token', () => {
    localStorage.setItem('auth_token', 'my-token');

    httpClient.get('/health').subscribe();
    const req = httpMock.expectOne('/health');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
