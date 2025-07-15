import { SettingService } from '../app-setting';
import { AuthService } from './auth.service';
import { APP_STORAGE_KEY } from '../const';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SessionStorageService } from '../utils/services/sessionStorage.service';
@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {
  constructor(
    public router: Router,
    private sessionService: SessionStorageService
  ) { }
  canActivate(): boolean {
    const isVerified = this.sessionService.getValue<boolean>('isVerified');

    console.log('isVerified:', isVerified);

    if (isVerified !== true) {
      this.router.navigate(['/not-found']);
      return false;
    }

    return true;
  }
}
