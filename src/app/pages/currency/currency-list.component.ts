import { Component, computed, ViewEncapsulation } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { Currency, CurrencyService } from "./currency.service";
import { CurrencyUiService } from "./currency-ui.service";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-currency",
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
              storageKey="currency-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
        </div>
        <div>
          <button
            *ngIf="isCurrencyAdd()"
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
              <th [nzWidth]="SIZE_COLUMNS.CODE">{{ "Code" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="80px">{{ "Symbol" | translate }}</th>
              <th nzWidth="100px">{{ "Format" | translate }}</th>
              <th nzWidth="100px">{{ "Rounding" | translate }}</th>
              <th nzWidth="100px">{{ "ExchangeRate" | translate }}</th>
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
              <td nzEllipsis>
                <a
                  *ngIf="isCurrencyView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isCurrencyView()">{{ data.code }}</span>
              </td>
              <td nzEllipsis>{{ data.name }}</td>
              <td nzEllipsis>{{ data.symbol }}</td>
              <td nzEllipsis>{{ data.format }}</td>
              <td nzEllipsis>{{ data.rounding }}</td>
              <td nzEllipsis>{{ data.exchangeRate }}</td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isCurrencyEdit()">
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
                  <ng-container *ngIf="isCurrencyRemove()">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      nz-typography
                      class="delete"
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
  encapsulation: ViewEncapsulation.None,
})
export class CurrencyListComponent extends BaseListComponent<Currency> {
  constructor(
    service: CurrencyService,
    sessionStorageService: SessionStorageService,
    public override uiService: CurrencyUiService,
    private activated: ActivatedRoute,
    private authService: AuthService,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "currency-list",
      notificationService
    );
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isCurrencyAdd = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CURRENCY__ADD)
  );
  isCurrencyEdit = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CURRENCY__EDIT)
  );
  isCurrencyRemove = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CURRENCY__REMOVE)
  );
  isCurrencyView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CURRENCY__VIEW)
  );
  override ngOnInit(): void {
    super.ngOnInit();
  }
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
