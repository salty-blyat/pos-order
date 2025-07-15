import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../../helpers/auth.service';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private sessionService: SessionStorageService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const isAuthorized = this.sessionService.getValue("isVerified");

    if (!isAuthorized) {
      this.router.navigate(['/not-found']);
      return false;
    }

    return true;
  }
}
