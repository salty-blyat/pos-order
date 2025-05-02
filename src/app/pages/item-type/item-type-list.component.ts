import { Component, computed, OnInit } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { ItemType, ItemTypeService } from "./item-type.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ItemTypeUiService } from "./item-type-ui.service.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";

@Component({
  selector: "app-item-type-list",
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
              <th [nzWidth]="SIZE_COLUMNS.DRAG"></th>
              <th class="col-header col-rowno" [nzWidth]="SIZE_COLUMNS.ID">
                #
              </th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "Name" | translate }}
              </th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NOTE">
                {{ "Note" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION" class="col-action"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList
            cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr *ngFor="let data of lists(); let i = index" cdkDrag>
              <td
                style="align-content: center;text-align: center; cursor: move;"
                cdkDragHandle
              >
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
              <td nzEllipsis style="flex: 2">
                <a *ngIf="isItemView()" (click)="uiService.showView(data.id!)">{{
                  data.name
                }}</a>
                <span *ngIf="!isItemView()">{{
                  data.name
                }}</span>
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
export class ItemTypeListComponent extends BaseListComponent<ItemType> {
  constructor(
    service: ItemTypeService,
    sessionStorageService: SessionStorageService,
    public override uiService: ItemTypeUiService,
    private authService: AuthService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "item-type-list");
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  
  isItemAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__TAG));
  isItemEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM));
  isItemRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__TAG__REMOVE));
  isItemView = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM));

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  override ngOnInit() {
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      this.search();
    });
  }
}
