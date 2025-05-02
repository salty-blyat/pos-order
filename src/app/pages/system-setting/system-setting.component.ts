import { Component, computed, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys } from "../../const";

@Component({
  selector: "app-system-setting",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div>
          <i nz-icon nzType="setting"></i>
          {{ "SystemSetting" | translate }}
        </div>
      </nz-header>
      <nz-content>
        <div nz-row>
          <div nz-col nzSpan="6" class="main-content-setting">
            <nz-sider nzWidth="200px" nzTheme="light">
              <ul nz-menu nzMode="inline" class="menu-custom-setting">
                <li *ngIf="isCompany()"
                  style="margin-top: 0"
                  nz-menu-item
                  routerLink="/setting/system-setting/company-section"
                  [nzMatchRouter]="true"
                >
                  <i nz-icon nzType="profile"></i>
                  <span>{{ "CompanySetting" | translate }}</span>
                </li>
                <li *ngIf="isAutoNumber()"
                  nz-menu-item
                  routerLink="/setting/system-setting/auto-number-section"
                  [nzMatchRouter]="true"
                >
                  <i nz-icon nzType="profile"></i>
                  <span>{{ "AutoNumber" | translate }}</span>
                </li>
                <li  *ngIf="isOtherApp()"
                  nz-menu-item
                  routerLink="/setting/system-setting/other-app-section"
                  [nzMatchRouter]="true"
                >
                  <i nz-icon nzType="appstore-add"></i>
                  <span>{{ "OtherApp" | translate }}</span>
                </li>
              </ul>
            </nz-sider>
          </div> 
          <div nz-col nzSpan="18">
            <nz-content class="menu-content-setting">
              <router-outlet></router-outlet>
            </nz-content>
          </div>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
      .main-content-setting {
        height: calc(100vh - 110px);
      }
      .menu-content-setting {
        height: 100% !important;
        border-left: 1px solid #e8e8e8;
      }
      .menu-custom-setting {
        background: #fff;
        padding-right: 1px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class SystemSettingComponent implements OnInit {
  constructor(private authService: AuthService, private activated: ActivatedRoute, private router: Router) { }
  breadcrumbData = computed<Observable<Data>>(() => this.activated.data);
  isCompany = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__COMPANY_SETTING));
  isAutoNumber = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__AUTO_NUMBER));
  isOtherApp = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__OTHER_APP));

  ngOnInit(): void {
    this.router
      .navigate(["/", "setting", "system-setting", "company-section", "other-app-section"])
      .then();
  }
}
