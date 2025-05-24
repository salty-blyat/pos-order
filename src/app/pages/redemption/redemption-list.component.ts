import {
  Component,
  computed,
  Query,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import { Redemption, RedemptionService } from "./redemption.service";
import { RedemptionUiService } from "./redemption-ui.service";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "../../utils/services/notification.service";
import { AccountTypes, LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import {
  LookupItem,
  LookupItemService,
} from "../lookup/lookup-item/lookup-item.service";

@Component({
  selector: "app-redemption-list",
  template: `
    <nz-layout>
      <nz-header>
        <div
          nz-flex
          nzWrap="nowrap"
          nzJustify="space-between"
          nzAlign="center"
          nzGap="middle"
          style="width:100%"
        >
          <div nz-flex nzGap="small">
            <app-filter-input
              storageKey="redemption-list-search"
              class="fixed-width-select"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
            <app-lookup-item-select
              class="fixed-width-select"
              showAll="AllOfferType"
              [showAllOption]="true"
              storageKey="redemption-offer-type-list-search"
              [lookupType]="LOOKUP_TYPE.OfferType"
              (valueChanged)="
                offerTypeId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-lookup-item-select>

            <app-offer-group-select
              class="fixed-width-select"
              [showAllOption]="true"
              storageKey="redemption-offer-group-list-search"
              (valueChanged)="
                offerGroupId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-offer-group-select>

            <app-lookup-item-select
              class="fixed-width-select"
              showAll="AllAccountType"
              storageKey="redemption-account-type-list-search"
              [showAllOption]="true"
              [lookupType]="LOOKUP_TYPE.AccountType"
              (valueChanged)="
                accountTypeId.set($event); param().pageIndex = 1; search()
              "
            ></app-lookup-item-select>
          </div>
          <button
            *ngIf="isRedemptionAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i
            >{{ "Add" | translate }}
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
              <th [nzWidth]="SIZE_COLUMNS.CODE">
                {{ "RedeemNo" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "Offer" | translate }}
              </th>
              <th nzWidth="100px">{{ "Status" | translate }}</th>
              <th nzWidth="100px" nzAlign="right">
                {{ "Amount" | translate }}
              </th>
              <th nzWidth="120px">{{ "Location" | translate }}</th>
              <th nzWidth="150px">{{ "RedeemedDate" | translate }}</th>
              <th nzWidth="150px">{{ "Note" | translate }}</th>
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
                  *ngIf="isRedemptionView()"
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.redeemNo }}</a
                >
                <span *ngIf="!isRedemptionView()">{{ data.redeemNo }}</span>
              </td>
              <td nzEllipsis>{{ data.offerName }}</td>
              <td
                nzEllipsis
                [ngStyle]="{ color: getStatusColor(data.status!) }"
              >
                {{
                  translateService.currentLang === "km"
                    ? data.statusNameKh
                    : data.statusNameEn
                }}
              </td>

              <td
                nzEllipsis
                nzAlign="right"
                [ngStyle]="{
                  color:
                    data.amount! > 0
                      ? 'green'
                      : data.amount! < 0
                      ? 'red'
                      : 'black',
                  'font-weight': 'semi-bold'
                }"
              >
                @if (data.redeemWith == AccountTypes.Point){
                <span> {{ data.amount + " pts" }}</span>
                } @else if (data.redeemWith == AccountTypes.Wallet){
                <span> {{ data.amount + " $" }}</span>
                } @else {
                <span>{{ data.amount }}</span>
                }
              </td>
              <td nzEllipsis>{{ data.locationName }}</td>
              <td nzEllipsis>{{ data.redeemedDate | customDate }}</td>
              <td nzEllipsis>{{ data.note }}</td>
              <td class="col-action">
                <a (click)="uiService.showDelete(data.id || 0)" class="delete">
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  {{ "Delete" | translate }}
                </a>
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
export class RedemptionListComponent extends BaseListComponent<Redemption> {
  constructor(
    service: RedemptionService,
    uiService: RedemptionUiService,
    private authService: AuthService,
    public translateService: TranslateService,
    sessionStorageService: SessionStorageService,
    public lookupItemService: LookupItemService,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "redemption-list",
      notificationService
    );
  }
  readonly offerGroupKey = "redemption-offer-group-list-search";
  readonly offerTypeKey = "redemption-offer-type-list-search";
  readonly accountTypeKey = "redemption-account-type-list-search";
  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  accountTypeId = signal(
    parseInt(this.sessionStorageService.getValue(this.accountTypeKey) ?? 0)
  );
  offerGroupId = signal(
    parseInt(this.sessionStorageService.getValue(this.offerGroupKey) ?? 0)
  );
  offerTypeId = signal(
    parseInt(this.sessionStorageService.getValue(this.offerTypeKey) ?? 0)
  );
  lookup = signal<LookupItem[]>([]);

  override ngOnInit(): void {
    super.ngOnInit();
    this.getStatus();
  }
  getStatus() {
    const filter: Filter[] = [
      {
        field: "lookupTypeId",
        operator: "eq",
        value: LOOKUP_TYPE.RedeemStatus,
      },
    ];
    const lookupParam: QueryParam = {
      pageSize:
        this.sessionStorageService.getCurrentPageSizeOption(
          this.pageSizeOptionKey()
        ) ?? 25,
      pageIndex: 1,
      sorts: "",
      filters: JSON.stringify(filter),
    };
    this.lookupItemService
      .search(lookupParam)
      .subscribe({ next: (v) => this.lookup.set(v.results) });
  }
  getStatusColor(statusId: number): string {
    const found = this.lookup().find((l) => l.valueId === statusId);
    return found?.color || "inherit";
  }

  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [];
    if (this.offerTypeId()) {
      filters.push({
        field: "offerType",
        operator: "eq",
        value: this.offerTypeId(),
      });
    }
    if (this.accountTypeId()) {
      filters.push({
        field: "redeemWith",
        operator: "eq",
        value: this.accountTypeId(),
      });
    }

    if (this.offerGroupId()) {
      filters.push({
        field: "offerGroupId",
        operator: "eq",
        value: this.offerGroupId(),
      });
    }
    return filters;
  }

  isRedemptionAdd = computed(() => true);
  isRedemptionEdit = computed(() => true);
  isRedemptionRemove = computed(() => true);
  isRedemptionView = computed(() => true);
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  readonly AccountTypes = AccountTypes;
}
