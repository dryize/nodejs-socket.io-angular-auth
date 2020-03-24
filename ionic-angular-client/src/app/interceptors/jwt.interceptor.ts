import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add authorization header with jwt token if available
      if (this.auth.jwt) {
          request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.auth.jwt}`,
                'Content-Type': 'application/json'
            }
          });
      }

      return next.handle(request);
  }
}
