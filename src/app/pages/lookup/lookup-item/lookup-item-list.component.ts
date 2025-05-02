import { Component, computed, signal, ViewChild, ViewEncapsulation } from "@angular/core";
import { LookupItemUiService } from "./lookup-item-ui.service";
import { ActivatedRoute } from "@angular/router";
import { LookupItem, LookupItemService } from "./lookup-item.service";
import { AuthKeys, SIZE_COLUMNS } from "../../../const";
import { Filter, QueryParam } from "../../../utils/services/base-api.service";
import { SessionStorageService } from "../../../utils/services/sessionStorage.service";
import { FilterInputComponent } from "../../../utils/components/filter-input.component";
import { BaseListComponent } from "../../../utils/components/base-list.component";
import { AuthService } from "../../../helpers/auth.service";

@Component({
  selector: "app-lookup-item",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="lookup-item-list-search-{{ lookupTypeId() }}"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            >
            </app-filter-input>
          </div>
        </div>
        <div>
          <button
            *ngIf="isLookupAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd(lookupTypeId())"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            {{ "Add" | translate }}
          </button>
        </div>
      </nz-header>
      <nz-content>
        <nz-table
          nzSize="small"
          nzTableLayout="fixed"
          nzShowSizeChanger
          #fixedTable
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
              <th nzWidth="30px">#</th>
              <th nzEllipsis nzWidth="80px" nzAlign="center">
                {{ "Image" | translate }}
              </th>
              <th nzEllipsis nzWidth="20%">
                {{ "Name" | translate }}
              </th>
              <th nzEllipsis nzWidth="20%">
                {{ "NameEn" | translate }}
              </th>
              <th nzEllipsis>{{ "Color" | translate }}</th>
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
                  [src]="data.image.url"
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
                  *ngIf="isLookupView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.name }}</a
                >
                <span *ngIf="!isLookupView()">{{ data.name }}</span>
              </td>
              <td nzEllipsis>{{ data.nameEn }}</td>
              <td nzEllipsis>
                <div nz-flex>
                  <div
                    [ngStyle]="{ backgroundColor: data.color ?? 'white' }"
                    class="color-box"
                  ></div>
                  <span>{{ data.color ?? "" }}</span>
                </div>
              </td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isLookupEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        class="edit"
                      ></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isLookupRemove()">
                    <a
                      *nzSpaceItem
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
  styleUrls: ["../../../../assets/scss/list.style.scss"],
  styles: [
    `
      .image {
        padding: 0 !important;
      }
      .image-list {
        height: 38px;
        object-fit: scale-down;
      }

      .color-box {
        width: 22px;
        height: 22px;
        margin-right: 4px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class LookupItemListComponent extends BaseListComponent<LookupItem> {
  @ViewChild(FilterInputComponent) filter!: any;

  constructor(
    uiService: LookupItemUiService,
    service: LookupItemService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    public authService: AuthService
  ) {
    super(service, uiService, sessionStorageService, "lookup-item-list");
  }

  lookupTypeId = signal<number>(0);
  loading = true;
  isLookupAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__LOOKUP__ADD));
  isLookupEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__LOOKUP__EDIT));
  isLookupRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__LOOKUP__REMOVE));
  isLookupView = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__LOOKUP__VIEW));

  override ngOnInit(): void {
    super.ngOnInit();
    this.activated.paramMap.subscribe((param) => {
      this.filter?.changeStorageKey(
        "lookup-item-list-search-" + param.get("id")
      );
      this.lookupTypeId.set(parseInt(<string>param.get("id")));
    });
  }

  override search() {
    if (this.lookupTypeId()) {
      if (this.isLoading()) return;
      this.isLoading.set(true);
      setTimeout(() => {
        const filters: Filter[] = [
          { field: "search", operator: "contains", value: this.searchText() },
        ];
        if (this.lookupTypeId()) {
          filters.push({
            field: "lookupTypeId",
            operator: "eq",
            value: this.lookupTypeId(),
          });
        }
        this.param().filters = JSON.stringify(filters);
        this.service.search(this.param()).subscribe({
          next: (result: { results: LookupItem[]; param: QueryParam }) => {
            this.isLoading.set(true);
            this.lists.set(result.results);
            this.param().rowCount = result.param.rowCount;
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }, 100);
    }
  }
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
