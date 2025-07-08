
import { Router } from "@angular/router";
import { AuthService } from "../helpers/auth.service"; 
import { LanguageService } from "../utils/services/language.service";
import { SettingService } from "../app-setting";
import { LocalStorageService } from "../utils/services/localStorage.service"; 
import { AppVersionService } from "../utils/services/app-version.service";   
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-page",
  template: `
<app-home/>
  `, 
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class PageComponent implements OnInit { 
  isLoading = false; 
  openMap: any;

  constructor(
    private router: Router,
    public authService: AuthService,
    public languageService: LanguageService,
    private settingService: SettingService, 
    private localStorageService: LocalStorageService, 
    public appVersionService: AppVersionService, 
  ) { 
    
  }
  appName = this.authService.app?.appName;

  ngOnInit(): void { 
    this.authService.updateClientInfo();
    if (this.authService.clientInfo.changePasswordRequired) {
      this.router.navigate([`/user-change-password`]).then();
    }
  } 

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(["auth/login"]).then();
    });
  }

  redirectToMainUrl() {
    window.open(
      `${this.settingService.setting.AUTH_UI_URL}/appcenter`,
      "app-center"
    );
  }

  redirectToViewProfileUrl() {
    window.open(
      `${this.settingService.setting.AUTH_UI_URL}/appcenter/user-view`,
      "app-center"
    );
  }
}
