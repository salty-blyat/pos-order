import { SettingService } from '../app-setting';
import { AuthService } from './auth.service';
import { APP_STORAGE_KEY } from '../const';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {
  constructor(
    public router: Router,
    private settingService: SettingService,
    private authService: AuthService
  ) {}
  canActivate(): boolean {
    const token = this.authService.getStorageValue<any>(
      APP_STORAGE_KEY.Authorized
    )?.token;
    if (!token) {
      this.authService.removeStorageValue(APP_STORAGE_KEY.Authorized);
      window.location.replace(
        `${this.settingService.setting.AUTH_UI_URL}/auth/login`
      );
      return false;
    }
    return true;
  }
}
