import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
  
}
