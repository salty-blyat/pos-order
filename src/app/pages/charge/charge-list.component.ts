import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { TranslateService } from "@ngx-translate/core";
import { Charge, ChargeService } from "./charge.service";
import { ChargeUiService } from "./charge-ui.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { Filter } from "../../utils/services/base-api.service";
import { SystemSettingService } from "../system-setting/system-setting.service";
import { AuthService } from "../../helpers/auth.service";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-charge-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row style="flex-wrap: nowrap; ">
          <div nz-col>
            <app-filter-input
              storageKey="charge-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            >
            </app-filter-input>
          </div>
          <div nz-col>
            <app-lookup-item-select
              [showAll]="'AllChargeType' | translate"
              [showAllOption]="true"
              storageKey="charge-type-filter"
              (valueChanged)="
                chargeTypeId.set($event); param().pageIndex = 1; search()
              "
              [lookupType]="this.lookupItemType.ChargeType"
            ></app-lookup-item-select>
          </div>
          <div nz-col>
            <app-unit-select
              [showAllOption]="true"
              storageKey="unit-filter"
              (valueChanged)="
                unitId.set($event); param().pageIndex = 1; search()
              "
            ></app-unit-select>
          </div>

          <div *ngIf="draged()">
            <button
              nz-button
              nzType="primary"
              (click)="saveOrdering()"
              [nzLoading]="isLoading()"
            >
              {{ "Save" | translate }}
            </button>
          </div>
        </div>
        <div nz-col style="margin-left: 1rem">
          <button
            *ngIf="isChargeAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd( {chargeTypeId: chargeTypeId(), unitId: unitId()})"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i
            >{{ "Add" | translate }}
          </button>
        </div>
      </nz-header>
      <nz-content>
        <nz-table
          nzSize="small"
          nzShowSizeChanger
          #fixedTable
          nzTableLayout="fixed"
          [nzPageSizeOptions]="pageSizeOption()"
          [nzData]="lists()"
          [nzLoading]="isLoading()"
          [nzTotal]="param().rowCount || 0"
          [nzPageSize]="param().pageSize || 0"
          [nzPageIndex]="param().pageIndex || 0"
          [nzNoResult]="noResult"
          [nzFrontPagination]="false"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th [nzWidth]="SIZE_COLUMNS.DRAG"></th>
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th [nzWidth]="SIZE_COLUMNS.CODE">{{ "Code" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="100px">
                {{ "ChargeType" | translate }}
              </th>
              <th nzWidth="100px" nzAlign="right">
                {{ "ChargeRate" | translate }}
              </th>
              <th nzWidth="150px">{{ "Unit" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList
            cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr *ngFor="let data of lists(); let i = index" cdkDrag>
              <td style="cursor: move;" cdkDragHandle>
                <span nz-icon nzType="holder" nzTheme="outline"></span>
              </td>
              <td nzEllipsis>
                {{
                  i
                    | rowNumber
                      : {
                          index: param().pageIndex || 0,
                          size: param().pageSize || 0
                        }
                }}
              </td>

              <td nzEllipsis style="flex: 1">
                <a
                  *ngIf="isChargeView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isChargeView()">{{ data.code }}</span>
              </td>

              <td nzEllipsis style="flex: 1">
                {{ data.name }}
              </td>

              <td nzEllipsis style="flex: 2">
                {{
                  translateService.currentLang == "km"
                    ? data.chargeTypeName
                    : data.chargeTypeNameEn
                }}
              </td>
              <td nzEllipsis style="flex: 1" nzAlign="right">
                {{ data.chargeRate }}
              </td>
              <td nzEllipsis style="flex: 1">
                {{ data.unitName }}
              </td>
              <td nzEllipsis style="flex: 4">{{ data.note }}</td>

              <td class="col-action" style="flex: 1">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isChargeEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isChargeRemove()">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      class="delete"
                    >
                      <i nz-icon nzType="delete" nzTheme="outline"></i>
                      {{ "Delete" | translate }}
                    </a>
                  </ng-container>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-content>
      <nz-layout> </nz-layout
    ></nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class ChargeListComponent extends BaseListComponent<Charge> {
  constructor(
    service: ChargeService,
    public override uiService: ChargeUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    private authService: AuthService,
    protected translateService: TranslateService,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "charge-list",
      notificationService
    );
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isChargeAdd = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__ADD)
  );
  isChargeEdit = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__EDIT)
  );
  isChargeRemove = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__REMOVE)
  );
  isChargeView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__VIEW)
  );
  lookupItemType = LOOKUP_TYPE;
  chargeTypeId = signal<number>(0);
  unitId = signal<number>(0);

  override search() {
    let filters: Filter[] = [];
    if (this.chargeTypeId()) {
      filters.push({
        field: "chargeTypeId",
        operator: "eq",
        value: this.chargeTypeId(),
      });
    }
    if (this.unitId()) {
      filters.push({
        field: "unitId",
        operator: "eq",
        value: this.unitId(),
      });
    }

    super.search(filters, 100);
  }
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
