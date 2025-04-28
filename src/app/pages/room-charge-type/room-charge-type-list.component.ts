import {
  Component,
  computed,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SIZE_COLUMNS } from "../../const";
import {
  RoomChargeType,
  RoomChargeTypeService,
} from "./room-charge-type.service";
import { RoomChargeTypeUiService } from "./room-charge-type-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";

@Component({
  selector: "app-room-charge-type-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="room-charge-type-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
           <!-- TODO:  add floor to query room first -->
          <div nz-col>
            <app-room-select
              [showAllOption]="true"
              storageKey="room-filter"
              (valueChanged)="
                roomId.set($event); param().pageIndex = 1; search()
              "
            ></app-room-select>
          </div>
          <div nz-col>
            <app-lookup-item-select
              formControlName="chargeTypeId"
              [showAll]="'AllChargeType' | translate"
              [showAllOption]="true"
              storageKey="charge-type-filter"
              (valueChanged)="
                chargeTypeId.set($event); param().pageIndex = 1; search()
              "
              [lookupType]="this.lookupItemType.ChargeType"
            ></app-lookup-item-select>
          </div>
        </div>
        <div>
          <button
            *ngIf="isRoomChargeTypeAdd()"
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
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "RoomName" | translate }}
              </th>
              <th nzWidth="150px">{{ "ChargeType" | translate }}</th>
              <th nzWidth="150px">
                {{ "Limit" | translate }}
              </th>
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
              <td nzEllipsis>{{ data.roomNumber }}</td>
              <td nzEllipsis>{{ data.chargeType }}</td>
              <td nzEllipsis>{{ data.limit }}</td>
              <td nzAlign="right">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isRoomChargeTypeEdit()">
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
                  <ng-container *ngIf="isRoomChargeTypeRemove()">
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
export class RoomChargeTypeListComponent extends BaseListComponent<RoomChargeType> {
  constructor(
    service: RoomChargeTypeService,
    uiService: RoomChargeTypeUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "room-charge-type-list");
  }
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isRoomChargeTypeAdd = signal<boolean>(true);
  isRoomChargeTypeEdit = signal<boolean>(true);
  isRoomChargeTypeRemove = signal<boolean>(true);
  isRoomChargeTypeView = signal<boolean>(true);
  lookupItemType = LOOKUP_TYPE;
  roomId = signal(0);
  chargeTypeId = signal(0);
  override lists = signal<RoomChargeType[]>([
    { id: 1, roomNumber: "001", chargeType: "Water", limit: 50 },
    { id: 2, roomNumber: "002", chargeType: "Electricity", limit: 100 },
    { id: 3, roomNumber: "003", chargeType: "Electricity", limit: 100 },
  ]);

  //   override search() {
  //     const filters: Filter[] = [];
  //     if (this.chargeType()) {
  //       filters.push({
  //         field: "chargeTypeId",
  //         operator: "eq",
  //         value: this.chargeTypeId(),
  //       });
  //
  //     } 
  //   if (this.roomId()) {
  //       filters.push({
  //         field: "roomId",
  //         operator: "eq",
  //         value: this.roomId(),
  //       });
  //
  //     }
  //     super.search(filters);
  //   }
}
