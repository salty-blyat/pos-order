import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { BRANCH_STORAGE_KEY, LANGUAGES, SIDE_EXPAND_COLLAPSED } from "../const";
import { Router } from "@angular/router";
import { AuthService } from "../helpers/auth.service";
import { DOCUMENT } from "@angular/common";
import { LanguageService } from "../utils/services/language.service";
import { SettingService } from "../app-setting";
import { QueryParam } from "../utils/services/base-api.service";
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
        nzWidth="256px"
        nzBreakpoint="md"
        [(nzCollapsed)]="isCollapsed"
        [nzTrigger]="null"
      >
        <div
          class="sidebar-logo"
          style="position: sticky; top: 0; z-index: 100;"
        >
          <a target="_blank" class="logo-link">
            <img [src]="authService.app?.iconUrl" alt="logo" />
            <h1 *ngIf="!isCollapsed" class="modal-header-ellipsis">
              {{ appName }}
            </h1>
          </a>
        </div>
        <div
          class="scrollbar"
          style="display: flex; flex-direction: column; justify-content: space-between; height: calc(100vh - 64px);"
        >
          <ul
            class="nz-menu-custom"
            nz-menu
            nzMode="inline"
            [nzInlineCollapsed]="isCollapsed"
          >
            <li nz-menu-item routerLink="/home" [nzMatchRouter]="isActive">
              <i nz-icon nzType="home"></i>
              <span>{{ "Home" | translate }}</span>
            </li>
            <!-- <li nz-menu-item [nzMatchRouter]="isActive">
              <span nz-icon nzType="user" nzTheme="outline"></span>
              <span>{{ "Member" | translate }}</span>
            </li> -->
            <li nz-menu-item routerLink="/setting" [nzMatchRouter]="isActive">
              <i nz-icon nzType="setting"></i>
              <span>{{ "Setting" | translate }}</span>
            </li>
            <li nz-menu-item routerLink="/report" [nzMatchRouter]="isActive">
              <i nz-icon nzType="container"></i>
              <span>{{ "Report" | translate }}</span>
            </li>
          </ul>

          <div>
            <!-- for big screen -->
            <div *ngIf="!isCollapsed" class="user-info-container">
              <div
                style="display: flex; align-items: center; gap: 8px; padding: 8px; justify-content:space-between; flex-wrap: wrap;"
              >
                <span class="tenant" style="margin: 0">
                  <img
                    [src]="authService.tenant?.logo"
                    alt="tenant"
                    style="margin-right: 4px;"
                  />

                  <span style="padding-left: 4px;">{{
                    authService.tenant?.name
                  }}</span>
                </span>

                <i
                  nz-icon
                  nzType="appstore"
                  (click)="redirectToMainUrl()"
                  nzTheme="outline"
                  style="cursor: pointer;"
                ></i>
                <i
                  *ngIf="isCollapsed"
                  nz-icon
                  (click)="switchScreen()"
                  [nzType]="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
                  nzTheme="outline"
                  class="icon"
                  style="cursor: pointer;display:flex; justify-content:center; align-items:center;"
                ></i>
                <span
                  *ngIf="isCollapsed"
                  nzTrigger="click"
                  nzPlacement="bottomRight"
                  nz-dropdown
                  style="cursor: pointer;"
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
              <nz-divider style="margin: 0  0 8px 0;"></nz-divider>

              <div class="user-info">
                <div style="display: flex; align-items: center; gap:4px">
                  <nz-avatar
                    [nzSrc]="authService.clientInfo.profile"
                    [nzSize]="32"
                    style="margin-right: 4px;"
                    (click)="redirectToViewProfileUrl()"
                    nzIcon="user"
                  ></nz-avatar>
                  <div
                    style="display: flex; flex-direction: column; "
                    *ngIf="!isCollapsed"
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

            <!-- for small screen -->
            <div *ngIf="isCollapsed" class="user-info-container">
              <div
                style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 0;"
              >
                <img
                  [src]="authService.tenant?.logo"
                  alt="tenant"
                  style="width: 20px;"
                />
                <i
                  nz-icon
                  nzType="appstore"
                  (click)="redirectToMainUrl()"
                  nzTheme="outline"
                  style="cursor: pointer;"
                ></i>
                <i
                  *ngIf="isCollapsed"
                  nz-icon
                  (click)="switchScreen()"
                  [nzType]="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
                  nzTheme="outline"
                  class="icon"
                  style="cursor: pointer;display:flex; justify-content:center; align-items:center;"
                ></i>
                <span
                  nzTrigger="click"
                  nzPlacement="bottomRight"
                  nz-dropdown
                  style="cursor: pointer;"
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

              <nz-divider style="margin: 0  0 8px 0;"></nz-divider>

              <div class="user-info">
                <div style="display: flex; align-items: center; gap:4px">
                  <nz-avatar
                    [nzSrc]="authService.clientInfo.profile"
                    [nzSize]="32"
                    style="margin-right: 4px;"
                    (click)="redirectToViewProfileUrl()"
                    nzIcon="user"
                  ></nz-avatar>
                  <div
                    style="display: flex; flex-direction: column; "
                    *ngIf="!isCollapsed"
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
                  *ngIf="!isCollapsed"
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

            <div class="version">
              <span>
                {{ appVersionService.getVersion()?.version }}
              </span>
              <br *ngIf="isCollapsed" />
              <span style="color: #8c8c8c;">
                ({{ appVersionService.getVersion()?.release_date }})
              </span>
            </div>
          </div>
        </div>
      </nz-sider>
      <nz-layout>
        <nz-content>
          <div
            class="inner-content"
            style="display: flex; flex-direction: column; "
          >
            <nz-spin
              *ngIf="loading"
              style="position: absolute; top: 50%; left: 50%"
            ></nz-spin>
            <div style="flex:1;">
              <router-outlet *ngIf="!loading"></router-outlet>
            </div>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styleUrls: [`../../assets/scss/layout-style.scss`],
  styles: [
    `
      .modal-header-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 75%;
        margin: auto;
      }

      .version {
        text-align: center;
        font-size: 12px;
        margin-top: 8px;
      }

      .tenant {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 28px;
        font-size: 17px;
        border-radius: 5px;
        color: black;
        cursor: default;

        img {
          width: 18px;
          margin-right: 4px;
        }

        .branch {
          margin-right: -14px;
          cursor: pointer;
          span {
            font-size: 16px;
            padding: 4px 14px 4px 6px;
            border-radius: 2px;
          }
        }
        .branch:hover {
          span {
            background-color: #e6f7ff;
          }
        }
      }
      li {
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
      }
      ::ng-deep .cdk-global-scrollblock {
        position: fixed;
        width: 100%;
        overflow-y: auto;
      }
      .logo-link {
        margin: 0 20.5px;
      }
      .sider {
        background-color: #f3f3f3;
      }
      .ant-menu {
        background-color: #f3f3f3;
      }
      .user-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }
      .user-info-container {
        margin: 0 16px;
        padding: 4px 8px;
        border-radius: 8px;
        background-color: #e0e0e0;
      }
      .sidebar-menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100vh - 64px);
      }
    `,
  ],
  standalone: false,
})
export class PageComponent implements OnInit {
  isActive = true;
  name: string = "";
  loading = false;
  isCollapsed = false;
  param: QueryParam = {
    pageSize: 9999999,
    pageIndex: 1,
    sorts: "",
    filters: "",
  };
  branch: any;
  languages = LANGUAGES;
  openMap: { [name: string]: boolean } = {
    sub1: false,
    sub2: false,
  };
  isFullScreen = false;

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
  appName?: string;

  ngOnInit(): void {
    // this.setPermission();
    this.authService.updateClientInfo();
    this.appName = this.authService.app?.appName;
    this.systemSettingService.initCurrentSetting().subscribe({
      next: (settingList) => {},
      error: (error) => {
        console.error("Error fetching settings:", error);
      },
    });

    this.name =
      this.authService.clientInfo.name?.charAt(0).toUpperCase()! +
      this.authService.clientInfo.name?.slice(1);
    if (this.authService.clientInfo.changePasswordRequired) {
      this.router.navigate([`/user-change-password`]).then();
    }
    //OPTION 1 => SUB REMEMBER LAST TOUCH
    let sub1 = this.localStorageService.getValue("sub1");
    let sub3 = this.localStorageService.getValue("sub3");
    let sub4 = this.localStorageService.getValue("sub4");
    if (sub1 == true && sub1 != null) this.openMap["sub1"] = true;
    else this.openMap["sub1"] = false;
    if (sub3 == true && sub3 != null) this.openMap["sub3"] = true;
    else this.openMap["sub3"] = false;
    if (sub4 == true && sub4 != null) this.openMap["sub4"] = true;
    else this.openMap["sub4"] = false;
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

  switchScreen() {
    if (this.isFullScreen) {
      this.exitFullScreen();
    } else {
      this.enterFullScreen();
    }
  }

  enterFullScreen() {
    if (this.document.documentElement.requestFullscreen) {
      this.document.documentElement.requestFullscreen().then();
    }
    this.isFullScreen = true;
  }

  exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().then();
    }
    this.isFullScreen = false;
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
  // setLastVisited(route: string) {
  //   this.localStorageService.setValue({
  //     key: SIDE_EXPAND_COLLAPSED,
  //     value: route,
  //   });
  // }
  setLastCollapsed(key: string, item: boolean) {
    this.localStorageService.setValue({
      key: key,
      value: item,
    });
  }
}
