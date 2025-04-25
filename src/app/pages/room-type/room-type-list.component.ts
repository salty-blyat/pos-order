import {Component, computed, signal, ViewEncapsulation} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { RoomType, RoomTypeService } from "./room-type.service";
import { RoomTypeUiService } from "./room-type-ui.service";
import { SIZE_COLUMNS } from "../../const";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";

@Component({
  selector: "app-room-type-list",
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
                (filterChanged)="searchText.set($event); param().pageIndex = 1; search();" 
                storageKey="room-type-list-search">
            </app-filter-input>
          </div>
        </div>
        <div nz-col>
          <button
            *ngIf="isRoomTypeAdd()"
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
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="120px" class="text-center">{{ "Occupancy" | translate }}</th>
              <th>{{ "Note" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists() ?? []; let i = index">
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
                <a (click)="uiService.showView(data.id!)">{{ data.name }}</a>
              </td>
              <td nzEllipsis class="text-center">
                {{ data.occupancy }}
                / {{ data.maxOccupancy }}
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isRoomTypeEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isRoomTypeRemove()">
                    <a
                      *nzSpaceItem
                      nz-typography
                      class="delete"
                      (click)="uiService.showDelete(data.id || 0)"
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
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class RoomTypeListComponent extends BaseListComponent<RoomType> {
  constructor(
    service: RoomTypeService,
    sessionStorageService: SessionStorageService,
    uiService: RoomTypeUiService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "room-type-list");
  }

  breadcrumbData = computed<Observable<any>>(() => this.activated.data);

  isRoomTypeAdd = signal<boolean>(true);
  isRoomTypeEdit = signal<boolean>(true);
  isRoomTypeRemove = signal<boolean>(true);

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
