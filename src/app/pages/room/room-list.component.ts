import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Data } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { Room, RoomAdvancedFilter, RoomService } from "./room.service";
import { RoomUiService } from "./room-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { QueryParam } from "../../utils/services/base-api.service";

@Component({
  selector: "app-room-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row  >
          <div class="filter-box">
            <app-filter-input
              storageKey="room-list-search"
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            >
            </app-filter-input>
          </div>
          <div class="filter-box">
            <app-floor-select
              storageKey="room-list-floor-select-filter"
              [showAllOption]="true"
              (valueChanged)="floorId = $event; param.pageIndex = 1; search()"
            ></app-floor-select>
          </div>
          <div class="filter-box">
            <app-lookup-item-select
              [lookupType]="lookupType.HouseKeepingStatus"
              storageKey="room-list-hk-status-select-filter"
              [showAllOption]="true"
              [typeLabelAll]="'AllHouseKeepingStatus' | translate"
              (valueChanged)="
                houseKeepingStatusId = $event; param.pageIndex = 1; search()
              "
            ></app-lookup-item-select>
          </div>
          <div>
            <nz-badge [nzDot]="hasAdvancedFilter">
              <button
                nz-button
                nzType="default"
                (click)="
                  uiService.showAdvancedFilter(
                    'room-list',
                    this.advancedStoreKey
                  )
                "
              >
                <a nz-icon nzType="align-right" nzTheme="outline"></a>
              </button>
            </nz-badge>
          </div>
        </div>
        <div>
          <button
            *ngIf="isRoomTypeAdd"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
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
          [nzPageSizeOptions]="pageSizeOption"
          [nzData]="lists"
          [nzLoading]="loading"
          [nzTotal]="param.rowCount || 0"
          [nzPageSize]="param.pageSize || 0"
          [nzPageIndex]="param.pageIndex || 0"
          [nzNoResult]="noResult"
          [nzFrontPagination]="false"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th class="col-header col-rowno">#</th>
              <th nzWidth="100px">{{ "RoomNumber" | translate }}</th>
              <th nzWidth="150px">{{ "RoomType" | translate }}</th>
              <th nzWidth="100px">{{ "Floor" | translate }}</th>
              <th nzWidth="150px">{{ "HouseKeepingStatus" | translate }}</th>
              <th nzWidth="150px">{{ "Status" | translate }}</th>
              <th>{{ "Tags" | translate }}</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists; let i = index">
              <td nzEllipsis>
                {{
                  i
                    | rowNumber
                      : {
                          index: param.pageIndex || 0,
                          size: param.pageSize || 0
                        }
                }}
              </td>
              <td nzEllipsis>
                <ng-container *ngIf="isRoomTypeView">
                  <a (click)="uiService.showView(data.id!)">{{
                    data.roomNumber
                  }}</a>
                </ng-container>
                <ng-container *ngIf="!isRoomTypeView">
                  {{ data.roomNumber }}
                </ng-container>
              </td>
              <td nzEllipsis>{{ data.roomTypeName }}</td>
              <td nzEllipsis>{{ data.floorName }}</td>
              <td nzEllipsis>{{ data.houseKeepingStatusNameKh }}</td>
              <td nzEllipsis>{{ data.statusNameKh }}</td>
              <td nzEllipsis>
                <div class="show-tag">
                  <nz-tag *ngFor="let tag of data.tagNames; let last = last"
                    >{{ tag }}{{ last ? "" : " " }}
                  </nz-tag>
                </div>
              </td>

              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isRoomTypeEdit">
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
                  <ng-container *ngIf="isRoomTypeRemove">
                    <a
                      *nzSpaceItem
                      nz-typography
                      style="color: #F31313"
                      (click)="uiService.showDelete(data.id || 0)"
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
  styleUrls: ["../../../assets/scss/content_style.scss"],
  styles: [
    `
      :host ::ng-deep .ant-btn-icon-only {
        vertical-align: middle;
      }
    `,
  ],
  standalone: false,
})
export class RoomListComponent extends BaseListComponent<Room> {
  constructor(
    service: RoomService,
    sessionStorageService: SessionStorageService,
    public uiService: RoomUiService,
    private activated: ActivatedRoute
  ) {
    super(service, sessionStorageService, "room-list");
  }

  houseKeepingStatusId: number = 0;
  roomTypeId: number = 0;
  floorId: number = 0;
  roomStatusId: number = 0;
  tagIds: number[] = [];
  lookupType = LOOKUP_TYPE;
  advancedStoreKey = "room-advanced-filter";

  isRoomTypeAdd: boolean = true;
  isRoomTypeEdit: boolean = true;
  isRoomTypeRemove: boolean = true;
  isRoomTypeView: boolean = true;
  hasAdvancedFilter: boolean = false;

  override ngOnInit() {
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      if (result.key === "advanced-filter-room") {
        this.setAdvancedFilter(result.value);
      }
      this.getAdvancedFilter();
      this.search();
    });
    this.getAdvancedFilter();
    if (this.hasAdvancedFilter) {
      this.setAdvancedFilter(
        this.sessionStorageService.getValue(this.advancedStoreKey)
      );
    }
    this.search();
  }

  getAdvancedFilter() {
    const advancedFilter: RoomAdvancedFilter =
      this.sessionStorageService.getValue(this.advancedStoreKey);
    this.hasAdvancedFilter = advancedFilter?.isAdvancedFilter ?? false;
  }
  setAdvancedFilter(advancedFilter: RoomAdvancedFilter) {
    this.roomStatusId = advancedFilter.roomStatusId;
    this.tagIds = advancedFilter.tagIds.filter((id: number) => id !== 0);
    this.floorId = advancedFilter.floorId;
    this.houseKeepingStatusId = advancedFilter.houseKeepingStatusId;
    this.roomTypeId = advancedFilter.roomTypeId;
  }

  override search() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: "search", operator: "contains", value: this.searchText },
      ];
      if (this.floorId) {
        filters.push({ field: "floorId", operator: "eq", value: this.floorId });
      }
      if (this.houseKeepingStatusId) {
        filters.push({
          field: "houseKeepingStatus",
          operator: "eq",
          value: this.houseKeepingStatusId,
        });
      }

      if (this.roomTypeId) {
        filters.push({
          field: "roomTypeId",
          operator: "eq",
          value: this.roomTypeId,
        });
      }

      if (this.roomStatusId) {
        filters.push({
          field: "status",
          operator: "eq",
          value: this.roomStatusId,
        });
      }

      if (this.tagIds.length > 0) {
        filters.push({
          field: "tagIds",
          operator: "in",
          value: this.tagIds.join(","),
        });
      }
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (result: { results: Room[]; param: QueryParam }) => {
          this.loading = true;
          this.lists = result.results;

          this.param.rowCount = result.param.rowCount;
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
          console.log(error);
        },
      });
    }, 50);
  }
}
