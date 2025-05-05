import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { Item, ItemService } from "./item.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ItemUiService } from "./item-ui.service";
import { ActivatedRoute } from "@angular/router";
import { delay, Observable } from "rxjs";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { Filter } from "../../utils/services/base-api.service";
import { AuthService } from "../../helpers/auth.service";

@Component({
  selector: "app-item-list",
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
              storageKey="item-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div nz-col>
            <app-item-type-select
              [showAllOption]="true"
              storageKey="item-list-item-type-filter"
              (valueChanged)="
                itemTypeId.set($event); param().pageIndex = 1; search()
              "
            ></app-item-type-select>
          </div>
        </div>
        <div>
          <button
            *ngIf="isItemAdd()"
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
              <th nzWidth="60px" nzAlign="center">{{ "Image" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.CODE">{{ "Code" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="120px">{{ "ItemType" | translate }}</th>
              <th nzWidth="120px" nzAlign="center">
                {{ "IsTrackSerial" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
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
              <td nzEllipsis class="image" nzAlign="center">
                <img
                  *ngIf="data.image"
                  class="image-list"
                  height="42"
                  [src]="data.image"
                  alt=""
                />
                <img
                  *ngIf="!data.image"
                  class="image-list"
                  height="42"
                  src="./assets/image/img-not-found.jpg"
                  alt=""
                />
              </td>
              <td nzEllipsis>
                <a
                  *ngIf="isItemView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isItemView()">{{ data.code }}</span>
              </td>
              <td nzEllipsis>{{ data.name }}</td>
              <td nzEllipsis>{{ data.itemTypeName }}</td>
              <td nzAlign="center">
                <label
                  nz-checkbox
                  [ngModel]="data.isTrackSerial"
                  [nzDisabled]="true"
                ></label>
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isItemEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isItemRemove()">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      nz-typography
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
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
      .image {
        padding: 0 !important;
      }

      .image-list {
        height: 38px;
        object-fit: scale-down;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class ItemListComponent extends BaseListComponent<Item> {
  constructor(
    service: ItemService,
    uiService: ItemUiService,
    sessionStorageService: SessionStorageService, 
    private authService: AuthService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "item-list");
  }

  itemTypeId = signal<number>(0);

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isItemAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM__ADD));
  isItemEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM__EDIT));
  isItemRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM__REMOVE)); 
  isItemView = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM__VIEW));

  override search() {
    let filters: Filter[] = [];
    if (this.itemTypeId()) {
      filters.push({
        field: "itemTypeId",
        operator: "eq",
        value: this.itemTypeId(),
      });
    }
    super.search(filters, 100);
  }
}
