import { Component, OnInit } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { ItemType, ItemTypeService } from "./item-type.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ItemTypeUiService } from "./item-type-ui.service.component";
import { SIZE_COLUMNS } from "../../const";

@Component({
  selector: "app-item-type-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData"
        [data]="breadcrumbData"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div style="width: 220px; margin-right: 4px;">
            <app-filter-input
              storageKey="item-list-search"
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
        </div>
        <div>
          <button
            *ngIf="isItemAdd"
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
              <th class="col-header col-rowno" [nzWidth]="SIZE_COLUMNS.ID">
                #
              </th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "Name" | translate }}
              </th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NOTE">
                {{ "Note" | translate }}
              </th>
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
                <a *ngIf="isItemView" (click)="uiService.showView(data.id!)">{{
                  data.name
                }}</a>
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isItemEdit">
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
                  <ng-container *ngIf="isItemRemove">
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
  styleUrls: ["../../../assets/scss/content_style.scss"],
  styles: ["button{margin-left: 20px;}"],
  standalone: false,
})
export class ItemTypeListComponent extends BaseListComponent<ItemType> {
  constructor(
    service: ItemTypeService,
    sessionStorageService: SessionStorageService,
    public uiService: ItemTypeUiService,
    private activated: ActivatedRoute
  ) {
    super(service, sessionStorageService, "item-type-list");
  }
  breadcrumbData!: Observable<any>;
  isItemAdd: boolean = true;
  isItemEdit: boolean = true;
  isItemRemove: boolean = true;
  isItemView: boolean = true;
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  override ngOnInit() {
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      this.search();
    });
    this.breadcrumbData = this.activated.data;
  }
}
