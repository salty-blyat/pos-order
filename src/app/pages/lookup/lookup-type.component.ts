import { Component, OnDestroy, OnInit } from '@angular/core';
import { LookupType, LookupTypeService } from './lookup-type.service';
import { TranslateService } from '@ngx-translate/core';
import { QueryParam } from '../../utils/services/base-api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-look-up',
    template: `
      <app-breadcrumb
        *ngIf="breadcrumbData"
        [data]="breadcrumbData"
      ></app-breadcrumb>
        <div class="content-lookup-type">
          <nz-sider nzWidth="240px" nzTheme="light">
            <ul nz-menu nzMode="inline" class="sider-menu">
              <li
                nz-submenu
                nzOpen
                nzTitle="{{ 'Lookup' | translate }}"
                nzIcon="tool"
              >
                <ul *ngFor="let data of list">
                  <li
                    nz-menu-item
                    *ngIf="translate.currentLang == 'en'"
                    [routerLink]="['/setting/lookup', data.id]"
                    [nzMatchRouter]="isActive"
                  >
                    {{ data.nameEn || data.name }}
                  </li>
                  <li
                    nz-menu-item
                    *ngIf="translate.currentLang == 'km'"
                    [routerLink]="['/setting/lookup', data.id]"
                    [nzMatchRouter]="isActive"
                  >
                    {{ data.name || data.nameEn }}
                  </li>
                </ul>
              </li>
            </ul>
          </nz-sider>
          <nz-content class="inner-content">
            <router-outlet></router-outlet>
          </nz-content>
        </div>
  `,
    styles: [
        `
      .inner-content{
        margin: 0 6px !important;
      }
      .sider-menu {
        height: 100%;
        background: #fff;
      }
      .ant-layout-content {
        margin: 0 -15px;
      }
      .content-lookup-type{
        display: flex;
        gap: 6px;
      }
    `,
    ],
    styleUrls: ['../../../assets/scss/content_style.scss'],
    standalone: false
})
export class LookupTypeComponent implements OnInit, OnDestroy {
  constructor(
    public service: LookupTypeService,
    public translate: TranslateService,
    private activated: ActivatedRoute
  ) {}
  breadcrumbData!: Observable<Data>;
  isActive = true;
  list: LookupType[] = [];
  subscribe: any;
  param: QueryParam = {
    pageSize: 99,
    pageIndex: 1,
  };
  ngOnInit(): void {
    this.breadcrumbData = this.activated.data;
    this.subscribe = this.service.search(this.param).subscribe(
      (result: { results: LookupType[] }) => {
        this.list = result.results;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }
}
