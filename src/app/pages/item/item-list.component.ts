import { Component, computed, OnInit, signal } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { Item, ItemService } from "./item.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ItemUiService } from "./item-ui.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SIZE_COLUMNS } from "../../const";
import { Filter } from "../../utils/services/base-api.service";

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
              storageKey="item-list-filter"
              [showAllOption]="true"
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
              <th class="col-header col-rowno" [nzWidth]="SIZE_COLUMNS.ID">
                #
              </th>
              <th [nzWidth]="SIZE_COLUMNS.CODE" nzColumnKey="code">
                {{ "Code" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="70px">{{ "Image" | translate }}</th>
              <th nzWidth="150px">{{ "ItemType" | translate }}</th>
              <th nzWidth="150px" nzAlign="center">
                {{ "IsTrackSerial" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION" class="col-action"></th>
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
                  *ngIf="isItemView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isItemView()">{{ data.code }}</span>
              </td>
              <td nzEllipsis>{{ data.name }}</td>
              <td nzEllipsis>
                <nz-avatar
                  nzShape="square"
                  [nzSize]="40"
                  [nzSrc]="data.image"
                ></nz-avatar>
              </td>
              <td nzEllipsis>{{ data.itemTypeId }}</td>
              <td nzAlign="center">
                <label
                  nz-checkbox
                  [ngModel]="data.isTrackSerial"
                  [nzDisabled]="true"
                  style="margin: auto;"
                ></label>
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              <td nzAlign="right">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isItemEdit()">
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
                  <ng-container *ngIf="isItemRemove()">
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
})
export class ItemListComponent extends BaseListComponent<Item> implements OnInit{
  constructor(
    service: ItemService,
    uiService: ItemUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "item-list");
  }
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isItemAdd = signal<boolean>(true);
  isItemEdit = signal<boolean>(true);
  isItemRemove = signal<boolean>(true);
  isItemView = signal<boolean>(true); 
  readonly itemSelectedKey = "item-list-filter";
  itemTypeId = signal(
    parseInt(this.sessionStorageService.getValue(this.itemSelectedKey) ?? 0) ??
      0
  ); 
  override search() {
    const filters: Filter[] = [];
    if (this.itemTypeId()) {
      filters.push({
        field: "itemTypeId",
        operator: "eq",
        value: this.itemTypeId(),
      });
    }
    super.search(filters);
  }
  override ngOnInit(): void {
    this.search(); 
  }
}
