import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, filter, take, throwError, BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../features/login/services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('accessToken');

  // Ignorar rotas de autenticação pública para evitar loops de cabeçalho
  const isAuthRoute = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/refresh');

  let authReq = req;
  if (token && !isAuthRoute) {
    authReq = injectToken(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        (error.status === 401 || error.status === 403) &&
        !isAuthRoute
      ) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function injectToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((tokenResponse) => {
        isRefreshing = false;
        const newToken = tokenResponse.token;
        refreshTokenSubject.next(newToken);
        return next(injectToken(request, newToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(injectToken(request, token!));
      })
    );
  }
}
