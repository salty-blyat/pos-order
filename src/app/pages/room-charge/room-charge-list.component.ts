import {Component, computed, input, signal, ViewEncapsulation} from "@angular/core";
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
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="room-charge-list-search"
              (filterChanged)="searchText.set($event); param().pageIndex = 1; search()"
            ></app-filter-input>
          </div>
          <!-- <div nz-col>
              <app-date-range-input
                      storageKey="room-member-filter-date"
                      (valueChanged)="startDate.set($event); param().pageIndex = 1; search()"
              ></app-date-range-input>
          </div> -->
          <div nz-col >
              <app-charge-select
                      [showAllOption]="true"
                      storageKey="room-charge-charge-filter"
                      (valueChanged)=" chargeId.set($event); param().pageIndex = 1; search()"
              ></app-charge-select>
          </div>
        </div>
        <div style="margin-left:auto">
          <button
            *ngIf="isRoomChargeAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd(roomId())"
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
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th nzEllipsis >{{ "Charge" | translate }} / {{ 'Serial' | translate }}</th>
              <th nzEllipsis nzWidth="240px">{{ "StartDate" | translate }}</th>
              <th nzEllipsis nzWidth="120px">{{ "Status" | translate }}</th>
              <th nzEllipsis nzWidth="40px"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists(); let i = index">
              <td nzEllipsis>
                {{ i | rowNumber: {index: param().pageIndex || 0, size: param().pageSize || 0} }}
              </td>
              <td nzEllipsis>
                  {{ data.chargeName }}
                  @if (data.serial) {
                      <span>/</span>
                      <a (click)="uiService.showView(data.id!)"> {{ data.serial}}</a>
                  }
              </td>
              <td nzEllipsis>
                  {{ data.startDate | customDate }}
                  <span *ngIf="data.endDate"> - 
                      {{ data.endDate | customDate  }} 
                  </span>
              </td>
              <td nzEllipsis> 

                {{
                   this.translateService.currentLang === "km"
                    ? data.statusName
                    : data.statusNameEn 
                }}
              </td>
              <td class="col-action">
                  <a [nzDropdownMenu]="menu"
                     class="action-button menu-dropdown"
                     nz-dropdown
                     nzTrigger="click"
                     nzPlacement="bottomRight">
                      <i nz-icon
                         nzType="ellipsis"
                         nzTheme="outline"
                         style="font-size: 22px"></i>
                  </a>
                  <nz-dropdown-menu #menu="nzDropdownMenu">
                      <ul nz-menu class="dropdown-menu-custom">
                          <li class="menu-item edit"
                              nz-menu-item
                              (click)="uiService.showEdit(data.id!)">
                              <span>
                                <i nz-icon nzType="edit"></i>&nbsp;
                                <span class="action-text">{{ "Edit" | translate }}</span>
                              </span>
                          </li>
                          <li class="menu-item delete"
                              nz-menu-item
                              (click)="uiService.showDelete(data.id!)">
                              <span>
                                <i nz-icon nzType="delete"></i>&nbsp;
                                <span class="action-text">{{ "StopUsing" | translate }}</span>
                              </span>
                          </li>
                      </ul>
                  </nz-dropdown-menu>
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
  roomId = input(0);
  chargeId = signal(0);
  startDate = signal<Date[]>([new Date(), new Date()]);

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
