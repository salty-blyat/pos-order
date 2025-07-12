import { Router } from "@angular/router";
import { AuthService } from "../helpers/auth.service";
import { LanguageService } from "../utils/services/language.service";
import { SettingService } from "../app-setting";
import { LocalStorageService } from "../utils/services/localStorage.service";
import { AppVersionService } from "../utils/services/app-version.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LANGUAGES } from "../const";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-page",
  template: `
    <nz-layout>
      <nz-header nzTheme="light">
        <div
          (click)="router.navigate(['/home'])"
          class="brand"
          nz-flex
          nzGap="small"
          nzAlign="center"
        >
          <img class="logo" [src]="companyLogo" [alt]="companyName" />
          <span class="restaurant-name">{{ companyName }}</span>
        </div>
        <div style="height: auto !important;">
          <span
            nzTrigger="click"
            nz-dropdown
            style="margin-left:auto; float: right; cursor: pointer;  "
            [nzDropdownMenu]="language"
          >
            <img
              class="img-head"
              [src]="
                translateService.currentLang === 'km'
                  ? './assets/image/kh_FLAG.png'
                  : translateService.currentLang === 'en'
                  ? './assets/image/en_FLAG.png'
                  : './assets/image/ch_FLAG.png'
              "
              alt="language"
            />
            <nz-dropdown-menu #language="nzDropdownMenu">
              <ul nz-menu style="width: 125px;">
                <li
                  nz-menu-item
                  *ngFor="let lang of languages"
                  (click)="languageService.switchLanguage(lang.key)"
                >
                  <img class="img" [src]="lang.image" alt="language" />
                  <span>{{ lang.label }}</span>
                  <i
                    style="position: absolute; right: 5px;"
                    class="primary-color"
                    *ngIf="lang.key.localId == translateService.currentLang"
                    nz-icon
                    nzType="check"
                    nzTheme="outline"
                  ></i>
                </li>
              </ul>
            </nz-dropdown-menu>
          </span>
        </div>
      </nz-header>
      <nz-content class="content">
        <router-outlet></router-outlet>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../assets/scss/layout.style.scss"],
  styles: [
    `
      .brand {
        user-select:none;
        cursor: pointer;
        transition: opacity 0.3s ease;
      }

      .brand:active {
        opacity: 0.5;
      }

      .content {
        padding: 12px 8px 48px 8px;
        min-height: calc(100vh - 90px);
      }
      nz-header {
        position: sticky;
        height: auto !important;
        top: 0;
        z-index: 10;
        padding: 8px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      .logo {
        height: 42px;
      }
      .restaurant-name {
        font-size: 18px;
        line-height: 1;
      }
      .img-head {
        width: 24px;
      }
      .img {
        width: 20px;
        margin-right: 10px;
      }
      .ant-layout-header {
        line-height: 42px !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class PageComponent implements OnInit {
  isLoading = false;
  openMap: any;
  companyName: string = "Hotel Portal";
  companyLogo: string =
    "https://core.sgx.bz/files/evo/inv/25/05/8c6d84950cc142048369da1f848a6d47.png";
  languages = LANGUAGES;
  constructor(
    public router: Router,
    public translateService: TranslateService,
    public authService: AuthService,
    public languageService: LanguageService,
    private settingService: SettingService,
    private localStorageService: LocalStorageService,
    public appVersionService: AppVersionService
  ) { }
  appName = this.authService.app?.appName;

  ngOnInit(): void {
    // this.authService.updateClientInfo();
    // if (this.authService.clientInfo.changePasswordRequired) {
    //   this.router.navigate([`/user-change-password`]).then();
    // }
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
