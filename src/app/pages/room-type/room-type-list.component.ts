import {
  Component, computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { RoomType } from "./room-type.service";
import { RoomTypeService } from "./room-type.service";
import { RoomTypeUiService } from "./room-type-ui.service";
import { SIZE_COLUMNS } from "../../const";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { BaseListSignalComponent, FILTER_OPERATOR } from "../../utils/components/base-list-signal.component";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-room-type-list",
  template: `
      <nz-layout>
        <app-breadcrumb *ngIf="breadcrumbData()" [data]="breadcrumbData()"></app-breadcrumb>
        <nz-header>
          <div nz-row>
            <div class="filter-box">
              <app-filter-input
                  #filterBox
                  storageKey="room-type-list-search"
                  (filterChanged)="onFilterChanged('search',FILTER_OPERATOR.CONTAINS,$event)"
              >
              </app-filter-input>
            </div>
            <div class="filter-box">
              <app-lookup-item-select
                  [lookupType]="LOOKUP_TYPE.RoomClass"
                  storageKey="room-type-list-roomClass-select-filter"
                  [showAllOption]="true"
                  [typeLabelAll]="'AllRoomClass' | translate"
                  (valueChanged)="onFilterChanged('roomClass', FILTER_OPERATOR.EQUAL,$event)"
              ></app-lookup-item-select>
            </div>
          </div>
          <div>
            <button *ngIf="isRoomTypeAdd()" nz-button nzType="primary" (click)="uiService.showAdd()">
              <i nz-icon nzType="plus" nzTheme="outline"></i>{{ "Add" | translate }}
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
              [nzData]="lists.value()?.results ?? []"
              [nzLoading]="lists.isLoading()"
              [nzTotal]="lists.value()?.param?.rowCount || 0"
              [nzPageSize]="lists.value()?.param?.pageSize || 0"
              [nzPageIndex]="lists.value()?.param?.pageIndex || 0"
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
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="120px">{{ "RoomClass" | translate }}</th>
              <th class="col-basePrice">{{ "BasePrice" | translate }}</th>
              <th nzWidth="100px">{{ "RoomSize" | translate }}</th>
              <th class="col-qty">{{ "MaxAdults" | translate }}</th>
              <th class="col-qty">{{ "MaxChildren" | translate }}</th>
              <th class="col-qty">{{ "MaxOccupancy" | translate }}</th>
              <th>{{ "Description" | translate }}</th>
              <th class="col-action"></th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let data of lists.value()?.results ?? []; let i = index">
              <td nzEllipsis>
                {{
                  i
                      | rowNumber
                      : {
                        index: lists.value()?.param?.pageIndex || 0,
                        size: lists.value()?.param?.pageSize || 0
                      }
                }}
              </td>
              <td nzEllipsis><a (click)="uiService.showView(data.id!)">{{ data.name }}</a></td>
              <td nzEllipsis>{{ data.roomClassNameEn }}</td>
              <td nzEllipsis class="col-basePrice">{{ data.basePrice | customCurrency }}</td>
              <td nzEllipsis>{{ data.size }}</td>
              <td nzEllipsis class="col-qty">{{ data.maxAdults }}</td>
              <td nzEllipsis class="col-qty">{{ data.maxChildren }}</td>
              <td nzEllipsis class="col-qty">{{ data.maxOccupancy }}</td>
              <td nzEllipsis>{{ data.description }}</td>
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isRoomTypeEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline" style="padding-right: 5px"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isRoomTypeRemove()">
                    <a *nzSpaceItem nz-typography style="color: #F31313" (click)="uiService.showDelete(data.id || 0)">
                      <i nz-icon nzType="delete" nzTheme="outline" style="padding-right: 5px"></i>
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
      .center-align {
        text-align: center;
      }
      .right-align {
        text-align: right;
      }
      .col-basePrice{
        width: 90px;
        text-align: right;
      }
    `
  ],
  standalone: false
})
export class RoomTypeListComponent extends BaseListSignalComponent<RoomType> {
  readonly uiService = inject(RoomTypeUiService);
  readonly activated = inject(ActivatedRoute);

  breadcrumbData = computed<Observable<any>>(() => this.activated.data);

  isRoomTypeAdd = signal<boolean>(true);
  isRoomTypeEdit = signal<boolean>(true);
  isRoomTypeRemove = signal<boolean>(true);
  isRoomTypeView = signal<boolean>(true);
  refreshSignal = toSignal(this.uiService.refresher);

  constructor() {
    super(inject(RoomTypeService));
    effect(() => {
      const refresh = this.refreshSignal();
      if (refresh) {
        this.lists.reload();
      }
    });
    this.pageSizeOptionKey.set("room-type-list");
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  protected readonly FILTER_OPERATOR = FILTER_OPERATOR;
  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
