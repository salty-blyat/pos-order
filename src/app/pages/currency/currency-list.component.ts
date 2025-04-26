import { Component, computed } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { Currency, CurrencyService } from "./currency.service";
import { CurrencyUiService } from "./currency-ui.service";
import { SIZE_COLUMNS } from "../../const";

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
          <div style="width: 220px; margin-right: 4px;">
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
            *ngIf="isCurrencyAdd"
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
              <th [nzWidth]="SIZE_COLUMNS.ID" class="col-header col-rowno">
                #
              </th>
              <th
                [nzWidth]="SIZE_COLUMNS.CODE"
                class="col-code-max"
                nzColumnKey="code"
              >
                {{ "Code" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="100px">{{ "Symbol" | translate }}</th>
              <th nzWidth="100px">{{ "Format" | translate }}</th>
              <th nzWidth="100px">{{ "Rounding" | translate }}</th>
              <th nzWidth="150px">{{ "ExchangeRate" | translate }}</th>
              <th
                [nzWidth]="SIZE_COLUMNS.ACTION"
                class="col-action"
                nzAlign="right"
              ></th>
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
                  *ngIf="isCurrencyView"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isCurrencyView">{{ data.code }}</span>
              </td>
              <td nzEllipsis>{{ data.name }}</td>
              <td nzEllipsis>{{ data.symbol }}</td>
              <td nzEllipsis>{{ data.format }}</td>
              <td nzEllipsis>{{ data.rounding }}</td>
              <td nzEllipsis>{{ data.exchangeRate }}</td>
              <td nzAlign="right">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isCurrencyEdit">
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
                  <ng-container *ngIf="isCurrencyRemove">
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
export class CurrencyListComponent extends BaseListComponent<Currency> {
  constructor(
    service: CurrencyService,
    sessionStorageService: SessionStorageService,
    public override uiService: CurrencyUiService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "currency-list");
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isCurrencyAdd: boolean = true;
  isCurrencyEdit: boolean = true;
  isCurrencyRemove: boolean = true;
  isCurrencyView: boolean = true;
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;

  override ngOnInit() {
    // this.isCurrencyAdd = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__CURRENCY__ADD
    // );
    // this.isCurrencyEdit = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__CURRENCY__EDIT
    // );
    // this.isCurrencyRemove = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__CURRENCY__REMOVE
    // );
    // this.isCurrencyView = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__CURRENCY__VIEW
    // );

    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      this.search();
    });
    super.ngOnInit();
  }
}
