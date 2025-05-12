import {
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { LookupType, LookupTypeService } from "./lookup-type.service";
import { TranslateService } from "@ngx-translate/core";
import { QueryParam } from "../../utils/services/base-api.service";
import { ActivatedRoute, Data } from "@angular/router";
import { Observable, single } from "rxjs";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { LookupItemUiService } from "./lookup-item/lookup-item-ui.service";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-look-up",
  template: `
    <app-breadcrumb
      *ngIf="breadcrumbData()"
      [data]="breadcrumbData()"
    ></app-breadcrumb>
    <div class="content-lookup-type">
      <nz-sider nzWidth="220px" nzTheme="light">
        <ul nz-menu nzMode="inline" class="sider-menu">
          <li nz-menu-item [nzDisabled]="true" class="menu-main">
            <i nz-icon nzType="tool"></i>
            <span>{{ "Lookup" | translate }}</span>
          </li>
          @for (data of lists(); track data.id){
          <li
            nz-menu-item
            *ngIf="translate.currentLang == 'en'"
            [routerLink]="['/setting/lookup', data.id]"
            [nzMatchRouter]="isActive()"
          >
            {{ data.nameEn || data.name }}
          </li>
          <li
            nz-menu-item
            *ngIf="translate.currentLang == 'km'"
            [routerLink]="['/setting/lookup', data.id]"
            [nzMatchRouter]="isActive()"
          >
            {{ data.name || data.nameEn }}
          </li>
          }
        </ul>
      </nz-sider>
      <nz-content class="inner-content-lookup-type">
        <router-outlet></router-outlet>
      </nz-content>
    </div>
  `,
  styles: [
    `
      .inner-content-lookup-type {
        padding: 0 0 0 14px;
        border-left: 1px solid var(--ant-border-color);
      }
      .menu-main {
        color: #000000d9 !important;
        cursor: default;
      }
      .sider-menu {
        height: 100%;
        background: #fff;
      }
      .ant-layout-content {
        margin: 0 -15px;
      }
      .content-lookup-type {
        display: flex;
        gap: 1px;
      }
    `,
  ],
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class LookupTypeComponent extends BaseListComponent<LookupType> {
  constructor(
    service: LookupTypeService,
    uiService: LookupItemUiService,
    sessionStorageService: SessionStorageService,
    public translate: TranslateService,
    private activated: ActivatedRoute,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "lookup-type",
      notificationService
    );
  }
  breadcrumbData = computed<Observable<Data>>(() => this.activated.data);
  isActive = signal(true);
}
