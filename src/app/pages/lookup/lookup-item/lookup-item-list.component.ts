import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { LookupItemUiService } from "./lookup-item-ui.service";
import { ActivatedRoute } from "@angular/router";
import { LookupItem, LookupItemService } from "./lookup-item.service";
import { PAGE_SIZE_OPTION, SIZE_COLUMNS } from "../../../const";
import { QueryParam } from "../../../utils/services/base-api.service";
import { Subscription } from "rxjs";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { SessionStorageService } from "../../../utils/services/sessionStorage.service";
import { FilterInputComponent } from "../../../utils/components/filter-input.component";
import { AuthService } from "../../../helpers/auth.service";


@Component({
  selector: "app-lookup-item",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div>
            <app-filter-input
              storageKey="lookup-item-list-search-{{ lookupTypeId }}"
              (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
            >
            </app-filter-input>
          </div>
        </div>
        <div>
          <button *ngIf="isLookupAdd" nz-button nzType="primary" (click)="uiService.showAdd(lookupTypeId)">
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
          [nzPageSizeOptions]="pageSizeOption"
          [nzData]="list"
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
              <th nzEllipsis nzWidth="100px" nzAlign="center">{{ "Image" | translate }}</th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NAME">{{ "NameEn" | translate }}</th>
              <th nzEllipsis nzWidth="120px" >{{ "Color" | translate }}</th>
              <th nzEllipsis>{{ "Note" | translate }}</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of list; let i = index">
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
              <td nzEllipsis nzAlign="center" >
                <img *ngIf="data.image" class="image-list" height="42" [src]="data.image.url" alt="" />
                <img *ngIf="!data.image" class="image-list" height="42" src="./assets/image/img-not-found.jpg" alt=""  />
              </td>
              <td nzEllipsis>
                <a *ngIf="isLookupView" (click)="uiService.showView(data.id!)">{{ data.name }}</a>
                <span *ngIf="!isLookupView">{{ data.name }}</span>
              </td>
              <td nzEllipsis>{{ data.nameEn }}</td>
              <td nzEllipsis >
                <div nz-flex>
                  <div [ngStyle]="{ backgroundColor: data.color ?? 'white' }" class="color-box"></div>
                  <span>{{data.color ?? ''}}</span>
                </div>
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isLookupEdit">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id, data.lookupTypeId || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline" style="padding-right: 5px"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isLookupRemove">
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
  styleUrls: ["../../../../assets/scss/content_style.scss"],
  styles: [
    `
      ::ng-deep .ant-menu-light .ant-menu-submenu-active,
      ::ng-deep .ant-menu-light .ant-menu-submenu-title:hover,
      ::ng-deep .ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
        color: var(--primary-color) !important;
      }

      .image-list {
        max-width: 80px; 
        object-fit: cover; 
      }

      .color-box {
        width: 22px; 
        height:22px; 
        margin-right:4px;
      }
    `,
  ],
  standalone: false,
})
export class LookupItemListComponent implements OnInit, OnDestroy {
  @ViewChild(FilterInputComponent) filter!: any;

  constructor(
    public uiService: LookupItemUiService,
    public service: LookupItemService,
    private route: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService
  ) { }

  lookupTypeId: any;
  list: LookupItem[] = [];
  pageSizeOption = PAGE_SIZE_OPTION;
  loading = true;
  searchText = "";
  pageSizeOptionKey = "lookup-item-list";
  refreshSub!: Subscription;
  param: QueryParam = {
    pageSize: this.sessionStorageService.getCurrentPageSizeOption(this.pageSizeOptionKey) ?? 25,
    pageIndex: 1,
    sorts: "name",
    filters: "",
  };

  isLookupAdd: boolean = true;
  isLookupEdit: boolean = true;
  isLookupRemove: boolean = true;
  isLookupView: boolean = true;

  ngOnInit(): void {
    // this.isLookupAdd = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__LOOKUP__ADD
    // );
    // this.isLookupEdit = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__LOOKUP__EDIT
    // );
    // this.isLookupRemove = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__LOOKUP__REMOVE
    // );
    // this.isLookupView = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__LOOKUP__VIEW
    // );

    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      this.search();
    });
    this.route.paramMap.subscribe((param) => {
      this.filter?.changeStorageKey("lookup-item-list-search-" + param.get("id"));
      this.search();
    });
  }

  search() {
    this.route.paramMap.subscribe((params) => {
      this.lookupTypeId = params.get("id");
    });
    this.loading = true;
    this.param.filters = JSON.stringify([
      {
        field: "name",
        operator: "contains",
        value: this.searchText.toLowerCase(),
      },
      {
        field: "lookupTypeId",
        operator: "eq",
        value: this.lookupTypeId,
      },
    ]);
    this.service.search(this.param).subscribe(
      (result: { results: LookupItem[]; param: QueryParam }) => {
        this.loading = false;
        this.list = result.results;
        this.param = result.param;
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = param;
    // const sortFound = sort.find(x => x.value);
    // this.param.sorts = (sortFound?.key ?? 'code') + (sortFound?.value === 'descend' ? '-' : '');
    this.param.pageSize = pageSize;
    this.param.pageIndex = pageIndex;
    this.sessionStorageService.setPageSizeOptionKey(pageSize, this.pageSizeOptionKey);
    this.search();
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
