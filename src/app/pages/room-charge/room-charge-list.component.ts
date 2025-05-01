import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SIZE_COLUMNS } from "../../const";
import { RoomCharge, RoomChargeService } from "./room-charge.service";
import { RoomChargeUiService } from "./room-charge-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { Filter } from "../../utils/services/base-api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-room-charge-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div nz-col nzSpan="5">
            <app-filter-input
              storageKey="room-charge-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div nz-col nzSpan="5">
            <app-floor-select
              #floorSelect
              [showAllOption]="true"
              storageKey="floor-filter"
              (valueChanged)="floorId.set($event); param().pageIndex = 1"
            ></app-floor-select>
          </div>
          <div nz-col nzSpan="5">
            <app-room-select
              #roomSelect
              [floorId]="this.floorId()"
              [showAllOption]="true"
              storageKey="room-filter"
              (valueChanged)="
                roomId.set($event); param().pageIndex = 1; search()
              "
            ></app-room-select>
          </div>
          <div nz-col nzSpan="5">
            <app-charge-select
              formControlName="chargeId"
              [showAllOption]="true"
              storageKey="charge-type-filter"
              (valueChanged)="
                chargeId.set($event); param().pageIndex = 1; search()
              "
            ></app-charge-select>
          </div>
        </div>
        <div style="margin-left:auto">
          <button
            *ngIf="isRoomChargeAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            {{ "Add" | translate }}
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
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th nzWidth="150px">
                {{ "Serial" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "RoomNumber" | translate }}
              </th>

              <th nzWidth="150px">{{ "Charge" | translate }}</th>

              <th nzWidth="150px">
                {{ "StartDate" | translate }}
              </th>
              <th nzWidth="150px">
                {{ "EndDate" | translate }}
              </th>
              <th nzWidth="150px">
                {{ "Limit" | translate }}
              </th>
              <th nzWidth="150px">{{ "Status" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists(); let i = index">
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
              <td nzEllipsis>
                <a
                  *ngIf="isRoomChargeView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.serial }}</a
                >
                <span *ngIf="!isRoomChargeView()">{{ data.serial }} </span>
              </td>
              <td nzEllipsis>{{ data.roomNumber }}</td>
              <td nzEllipsis>{{ data.chargeName }}</td>
              <td nzEllipsis>{{ data.startDate | customDate }}</td>
              <td nzEllipsis>{{ data.endDate | customDate }}</td>
              <td nzEllipsis>{{ data.totalLimit }}</td>
              <td nzEllipsis>
                {{
                   this.translateService.currentLang === "km"
                    ? data.statusName
                    : data.statusNameEn 
                }}
              </td>
              <td nzAlign="right">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isRoomChargeEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        style="padding-right: 5px"
                      ></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isRoomChargeRemove()">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      nz-typography
                      style="color: #F31313"
                    >
                      <i
                        nz-icon
                        nzType="delete"
                        nzTheme="outline"
                        style="padding-right: 5px"
                      ></i>
                      {{ "Delete" | translate }}
                    </a>
                  </ng-container>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class RoomChargeListComponent extends BaseListComponent<RoomCharge> {
  constructor(
    service: RoomChargeService,
    uiService: RoomChargeUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    public translateService: TranslateService
  ) {
    super(service, uiService, sessionStorageService, "room-charge-list");
  }
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isRoomChargeAdd = signal<boolean>(true);
  isRoomChargeEdit = signal<boolean>(true);
  isRoomChargeRemove = signal<boolean>(true);
  isRoomChargeView = signal<boolean>(true);
  lookupItemType = LOOKUP_TYPE;
  floorId = signal(0);
  roomId = signal(0);
  chargeId = signal(0);

  override search() {
    const filters: Filter[] = [];
    if (this.chargeId()) {
      filters.push({
        field: "chargeId",
        operator: "eq",
        value: this.chargeId(),
      });
    }
    if (this.roomId()) {
      filters.push({
        field: "roomId",
        operator: "eq",
        value: this.roomId(),
      });
    }
    super.search(filters);
  }
}
