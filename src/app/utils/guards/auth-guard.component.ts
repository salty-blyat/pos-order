import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router'; 
import { AuthService } from '../../helpers/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const permissions: number[] = route.data['permission'] || [];

    const isAuthorized = permissions.some(permission =>
      this.authService.isAuthorized(permission)
    );

    if (!isAuthorized) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
