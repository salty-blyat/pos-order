import { Component, computed, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {ActivatedRoute, Data, Router} from '@angular/router';
import { AuthService } from '../../helpers/auth.service';

@Component({
    selector: 'app-system-setting',
    template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div>
          <i nz-icon nzType="setting"></i>
          {{ 'SystemSetting' | translate }}
        </div>
      </nz-header>
      <nz-content>
        <div nz-row class="menu-content">
          <div nz-col nzSpan="6">
            <nz-sider nzWidth="200px" nzTheme="light" class="menu-content">
              <ul nz-menu nzMode="inline" class="menu-content">
                <li
                  nz-menu-item
                  routerLink="/setting/system-setting/company-section"
                  [nzMatchRouter]="true"
                >
                  <i nz-icon nzType="profile"></i>
                  <span>{{ 'CompanySetting' | translate }}</span>
                </li>
                <li
                    nz-menu-item
                    routerLink="/setting/system-setting/auto-number-section"
                    [nzMatchRouter]="true"
                >
                  <i nz-icon nzType="profile"></i>
                  <span>{{ 'AutoNumber' | translate }}</span>
                </li>
              </ul>
            </nz-sider>
          </div>
          <div nz-col nzSpan="18">
            <nz-content class="inner-content">
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
      .inner-content {
        padding: 16px 6px;
      }
      .menu-content {
        height: 100% !important;
      }
    `,
    ],
    standalone: false
})
export class SystemSettingComponent implements OnInit {
  constructor(
      private activated: ActivatedRoute,
      private router: Router,
  ) {}
  breadcrumbData = computed<Observable<Data>>(() => this.activated.data);
  ngOnInit(): void {
    
    this.router.navigate(['/','setting','system-setting','company-section']).then();
  }
}
