import {
  Component,
  computed,
  Inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { AuthKeys, LANGUAGES } from "../const";
import { Router } from "@angular/router";
import { AuthService } from "../helpers/auth.service";
import { DOCUMENT } from "@angular/common";
import { LanguageService } from "../utils/services/language.service";
import { SettingService } from "../app-setting";
import { LocalStorageService } from "../utils/services/localStorage.service";
import { SystemSettingService } from "./system-setting/system-setting.service";
import { TranslateService } from "@ngx-translate/core";
import { AppVersionService } from "../utils/services/app-version.service";

export interface Type {
  sub1: boolean;
  sub3: boolean;
}
@Component({
  selector: "app-page",
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzTheme="light"
        nzCollapsible
        nzWidth="220px"
        nzBreakpoint="md"
        [(nzCollapsed)]="isCollapsed"
        [nzTrigger]="null"
      >
        <div class="header-content">
          <div class="sidebar-logo">
            <div class="logo-link">
              <img [src]="authService.app?.iconUrl" alt="logo" />
              <h1 *ngIf="!isCollapsed()" class="modal-header-ellipsis">
                {{ appName() }}
              </h1>
              <nz-icon
                nzType="down"
                class="icon-down"
                (click)="redirectToMainUrl()"
                nzTheme="outline"
              />
            </div>
          </div>
          <div class="tenant">
            <div class="tenant-logo">
              <img
                [src]="authService.tenant?.logo"
                alt="tenant"
                style="margin-right: 4px;"
              />
              <span class="tenant-name" *ngIf="!isCollapsed()">{{
                authService.tenant?.name
              }}</span>
            </div>
            <div class="app-center-icon">
              <!--              <nz-icon nzType="down" (click)="redirectToMainUrl()" nzTheme="outline"/>-->
            </div>
          </div>
        </div>
        <div class="menu-container">
          <ul
            class="nz-menu-custom"
            nz-menu
            nzMode="inline"
            [nzInlineCollapsed]="isCollapsed()"
          >
            <li
              *ngIf="isHomeList()"
              nz-menu-item
              [nzMatchRouter]="isActive()"
              routerLink="/home"
            >
              <i nz-icon nzType="home"></i>
              <span>{{ "Home" | translate }}</span>
            </li>

            <li
              *ngIf="isMemberList()"
              nz-menu-item
              [nzMatchRouter]="isActive()"
              routerLink="/member"
            >
              <i nz-icon nzType="idcard"></i>
              <span>{{ "Member" | translate }}</span>
            </li>
            <li
              *ngIf="isOfferList()"
              nz-menu-item
              [nzMatchRouter]="isActive()"
              routerLink="/offer"
            >
              <nz-icon nzType="tags" nzTheme="outline" />
              <span>{{ "Offer" | translate }}</span>
            </li>
            <li
              *ngIf="isAgentList()"
              nz-menu-item
              [nzMatchRouter]="isActive()"
              routerLink="/redemption"
            >
              <i nz-icon nzType="shop"></i>
              <span>{{ "Redemption" | translate }}</span>
            </li>

            <li
              *ngIf="isAgentList()"
              nz-menu-item
              [nzMatchRouter]="isActive()"
              routerLink="/agent"
            >
              <i nz-icon nzType="shop"></i>
              <span>{{ "Agent" | translate }}</span>
            </li>

            <li
              *ngIf="isSettingList()"
              nz-menu-item
              [nzMatchRouter]="isActive()"
              routerLink="/setting"
            >
              <i nz-icon nzType="setting"></i>
              <span>{{ "Setting" | translate }}</span>
            </li>
            <li
              *ngIf="isReportList()"
              nz-menu-item
              [nzMatchRouter]="isActive()"
              routerLink="/report"
            >
              <i nz-icon nzType="container"></i>
              <span>{{ "Report" | translate }}</span>
            </li>
          </ul>

          <div>
            <div class="version">
              <span>
                {{ appVersionService.getVersion()?.version }}
              </span>
              <br *ngIf="isCollapsed()" />
              <span style="color: #8c8c8c;">
                ({{ appVersionService.getVersion()?.release_date }})
              </span>
            </div>
            <nz-divider
              style="margin: 4px 0 4px 0; border-color: #eaeaea;"
            ></nz-divider>
            <div class="user-info-container">
              <div class="user-info">
                <div nz-flex nzAlign="center" nzGap="4px">
                  <nz-avatar
                    [nzSrc]="authService.clientInfo.profile"
                    [nzSize]="32"
                    style="margin-right: 4px;"
                    (click)="redirectToViewProfileUrl()"
                    nzIcon="user"
                  ></nz-avatar>
                  <div
                    nz-flex
                    [nzVertical]="true"
                    *ngIf="!isCollapsed()"
                    (click)="redirectToViewProfileUrl()"
                  >
                    <span style="font-size: 14px">{{
                      authService.clientInfo.fullName
                    }}</span>
                    <span style="font-size: 10px">{{
                      authService.clientInfo.email ?? "-"
                    }}</span>
                  </div>
                </div>

                <span
                  *ngIf="!isCollapsed()"
                  nzTrigger="click"
                  nzPlacement="bottomRight"
                  nz-dropdown
                  style="padding: 0 6px; float: right; cursor: pointer;"
                  [nzDropdownMenu]="language"
                >
                  <img
                    class="img-head"
                    [src]="
                      translateService.currentLang == 'km'
                        ? './assets/image/kh_FLAG.png'
                        : './assets/image/en_FLAG.png'
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
                          *ngIf="
                            lang.key.localId == translateService.currentLang
                          "
                          nz-icon
                          nzType="check"
                          nzTheme="outline"
                        ></i>
                      </li>
                    </ul>
                  </nz-dropdown-menu>
                </span>
              </div>
            </div>
          </div>
        </div>
      </nz-sider>
      <nz-layout>
        <nz-content>
          <div class="inner-content" nz-flex [nzVertical]="true">
            <app-loading *ngIf="isLoading()"></app-loading>
            <div>
              <router-outlet *ngIf="!isLoading()"></router-outlet>
            </div>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styleUrls: [`../../assets/scss/layout.style.scss`],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class PageComponent implements OnInit {
  isActive = signal(true);
  isLoading = signal(false);
  isCollapsed = signal(false);
  languages = LANGUAGES;
  openMap: { [name: string]: boolean } = {
    sub1: false,
    sub2: false,
  };

  isHomeList = computed(() => true);
  isAccountList = computed(() => true);
  isAgentList = computed(() => true);
  isOfferList = computed(() => true);
  // isMemberList = computed(() =>
  //   this.authService.isAuthorized(AuthKeys.APP__MEMBER__LIST)
  // );
  isMemberList = computed(() => true);
  isRoomList = computed(() => true);
  isSettingList = computed(
    () =>
      this.authService.isAuthorized(AuthKeys.APP__SETTING__AUTO_NUMBER__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__BLOCK__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__CURRENCY__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__FLOOR__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM_TYPE__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__LOOKUP__LIST) ||
      this.authService.isAuthorized(
        AuthKeys.APP__SETTING__MEMBER_GROUP__LIST
      ) ||
      this.authService.isAuthorized(
        AuthKeys.APP__SETTING__MEMBER_LEVEL__LIST
      ) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__MEMBER_UNIT__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT__LIST) ||
      this.authService.isAuthorized(
        AuthKeys.APP__SETTING__REPORT_GROUP__LIST
      ) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__ROOM_CHARGE__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__ROOM_TYPE__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__TAG__LIST) ||
      this.authService.isAuthorized(AuthKeys.APP__SETTING__UNIT__LIST)
  );
  isReportList = signal(() =>
    this.authService.isAuthorized(AuthKeys.APP__REPORT)
  );

  constructor(
    private router: Router,
    public authService: AuthService,
    public languageService: LanguageService,
    private settingService: SettingService,
    public systemSettingService: SystemSettingService,
    private localStorageService: LocalStorageService,
    public translateService: TranslateService,
    public appVersionService: AppVersionService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.eventRouterOpen();
  }
  appName = signal(this.authService.app?.appName);

  ngOnInit(): void {
    this.authService.updateClientInfo();
    if (this.authService.clientInfo.changePasswordRequired) {
      this.router.navigate([`/user-change-password`]).then();
    }
    //OPTION 1 => SUB REMEMBER LAST TOUCH
    let sub1 = this.localStorageService.getValue("sub1");
    let sub3 = this.localStorageService.getValue("sub3");
    let sub4 = this.localStorageService.getValue("sub4");
    this.openMap["sub1"] = sub1 == true && sub1 != null;
    this.openMap["sub3"] = sub3 == true && sub3 != null;
    this.openMap["sub4"] = sub4 == true && sub4 != null;
    //END
  }

  eventRouterOpen() {
    let url = this.router.url;

    if (url.includes("sale")) {
      this.openMap["sub1"] = true;
    } else if (url.includes("purchase")) {
      this.openMap["sub2"] = true;
    } else if (url.includes("product")) {
      this.openMap["sub3"] = true;
    } else if (url.includes("stock")) {
      this.openMap["sub4"] = true;
    }
  }
  openHandler(event: any, value: any): void {
    this.openMap[value] = event;
    let collapse: boolean = this.localStorageService.getValue(value) || false;
    this.setLastCollapsed(value, !collapse);
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

  setLastCollapsed(key: string, item: boolean) {
    this.localStorageService.setValue({
      key: key,
      value: item,
    });
  }
}
