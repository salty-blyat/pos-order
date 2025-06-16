import {
  Component,
  computed,
  Input,
  input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import {
  Redemption,
  RedemptionAdvancedFilter,
  RedemptionService,
} from "./redemption.service";
import { RedemptionUiService } from "./redemption-ui.service";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "../../utils/services/notification.service";
import {
  AccountTypes,
  LOOKUP_TYPE,
  RedeemStatuses,
} from "../lookup/lookup-type.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import {
  LookupItem,
  LookupItemService,
} from "../lookup/lookup-item/lookup-item.service";
import { DatetimeHelper } from "../../helpers/datetime-helper";
import { Subscription } from "rxjs";

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
              [storageKey]="
                memberId()
                  ? 'redemption-list-search' + memberId()
                  : 'redemption-list-search'
              "
              class="fixed-width-select"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>

            <app-date-range-input
              style="width:230px;"
              [storageKey]="
                memberId()
                  ? 'trans-date-range' + memberId()
                  : 'trans-date-range'
              "
              (valueChanged)="
                redeemedDate = $event; param().pageIndex = 1; search()
              "
            ></app-date-range-input>

            <app-offer-group-select
              class="fixed-width-select"
              [showAllOption]="true"
              [storageKey]="
                memberId()
                  ? 'redemption-offer-group-list-search' + memberId()
                  : 'redemption-offer-group-list-search'
              "
              (valueChanged)="
                offerGroupId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-offer-group-select>

            <div>
              <nz-badge [nzDot]="hasAdvancedFilter()">
                <button
                  nz-button
                  nzType="default"
                  (click)="uiService.showAdvancedFilter(advancedStoreKey)"
                >
                  <a nz-icon nzType="align-right" nzTheme="outline"></a>
                </button>
              </nz-badge>
            </div>
          </div>
          <button
            *ngIf="isRedemptionAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd('', memberId(), accountTypeInput())"
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
          style="height: calc(100vh - {{ isFromMember ? '270px' : '65px' }});"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th [nzWidth]="SIZE_COLUMNS.ID" class="col-header col-rowno">
                #
              </th>
              <th [nzWidth]="SIZE_COLUMNS.CODE" nzEllipsis>
                {{ "RedeemNo" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.DATE">{{ "Date" | translate }}</th>
              <th nzWidth="250px" nzEllipsis>
                {{ "Name" | translate }}
              </th>
              <th nzWidth="150px" nzEllipsis>
                {{ "Member" | translate }}
              </th>
              <th nzWidth="100px">{{ "Location" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.STATUS">
                {{ "Status" | translate }}
              </th>
              <th nzEllipsis>{{ "Note" | translate }}</th>
              <th nzWidth="100px" nzAlign="right">
                {{ "Balance" | translate }}
              </th>
              <th nzWidth="100px"></th>
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
              <td nzEllipsis [title]="data.redeemNo">
                <a
                  *ngIf="isRedemptionView()"
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.redeemNo }}</a
                >
                <span *ngIf="!isRedemptionView()">{{ data.redeemNo }}</span>
              </td>

              <td nzEllipsis class="no-pad">
                <div style="display:flex; flex-direction:column;">
                  {{ data.redeemedDate | customDateTime }}
                  <span class="subtitle">
                    {{ data.createdBy }}
                  </span>
                </div>
              </td>

              <td nzEllipsis class="no-pad col-img" [title]="data.offerName">
                <img
                  class="image-list"
                  height="42px"
                  *ngIf="data.offerPhoto"
                  [src]="data.offerPhoto"
                  alt=""
                />
                <img
                  class="image-list"
                  height="42px"
                  *ngIf="!data.offerPhoto"
                  src="./assets/image/img-not-found.jpg"
                  alt=""
                />

                <div
                  style="display:flex; flex-direction:column; padding-left:4px"
                >
                  {{ data.offerName }}
                  <span class="subtitle">
                    {{
                      translateService.currentLang === "km"
                        ? data.offerTypeNameKh
                        : data.offerTypeNameEn
                    }}
                  </span>
                </div>
              </td>
              <td nzEllipsis class="no-pad">
                <div style="display:flex; flex-direction:column;">
                  {{ data.memberName }}
                  <span class="subtitle">
                    {{ data.memberCode }}
                  </span>
                </div>
              </td>

              <td nzEllipsis>{{ data.locationName }}</td>
              <td
                class="no-pad col-img"
                style="display: flex ; 
                      align-items: center;"
                nzEllipsis
                [ngStyle]="{ color: getStatusColor(data.status!) }"
              >
                <img
                  class="image-list status-img"
                  height="42px"
                  *ngIf="data.statusImage"
                  [src]="data.statusImage"
                  alt=""
                />
                <img
                  class="image-list status-img"
                  height="42px"
                  style="width: 18px"
                  *ngIf="!data.statusImage"
                  src="./assets/image/img-not-found.jpg"
                  alt=""
                />
                <span>
                  {{
                    translateService.currentLang === "km"
                      ? data.statusNameKh
                      : data.statusNameEn
                  }}
                </span>
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              <td nzEllipsis nzAlign="right">
                {{
                  data?.amount | accountBalance : data?.redeemWith! | translate
                }}
              </td>
              <td class="col-action">
                <a
                  *ngIf="isRedemptionRemove()"
                  class="delete"
                  [nzDisabled]="data.status === RedeemStatuses.Removed"
                  (click)="uiService.showDelete(data.id || 0)"
                  nz-typography
                >
                  <i
                    nz-icon
                    nzType="delete"
                    nzTheme="outline"
                    style="padding-right: 5px"
                  ></i>
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
  styles: [
    `
      .status-img {
        width: 18px !important;
      }
      .subtitle {
        font-size: 10px;
        color: #6f6f6f;
      }
      .col-img {
        display: grid;
        grid-template-columns: 42px 1fr;
        gap: 8px;
      }
      .no-pad {
        padding: 0 0 0 5px !important;
      }
      .image-list {
        width: 42px;
        object-fit: scale-down;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RedemptionListComponent extends BaseListComponent<Redemption> {
  constructor(
    service: RedemptionService,
    public override uiService: RedemptionUiService,
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
  @Input() isFromMember = false;
  lookup = signal<LookupItem[]>([]);
  memberId = input(0);
  accountTypeInput = input(0);
  lookupRefresh$ = new Subscription();
  hasAdvancedFilter = signal<boolean>(false);
  redeemedDate: any = [];

  readonly offerGroupKey = "redemption-offer-group-list-search";

  readonly offerTypeKey = "redemption-offer-type-list-search";
  readonly accountTypeKey = "redemption-account-type-list-search";
  readonly statusKey = "redemption-status-list-search";
  advancedStoreKey = "";
  readonly advancedMemberStoreKey = "redemption-list-member-advanced-filter";
  readonly locationKey = "location-list-advanced-filter";

  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  accountTypeId = signal(
    parseInt(this.sessionStorageService.getValue(this.accountTypeKey) ?? 0)
  );
  offerGroupId = signal(
    parseInt(this.sessionStorageService.getValue(this.offerGroupKey) ?? 0)
  );
  statusId = signal(
    parseInt(this.sessionStorageService.getValue(this.statusKey) ?? 0)
  );
  offerTypeId = signal(
    parseInt(this.sessionStorageService.getValue(this.offerTypeKey) ?? 0)
  );
  locationId = signal(
    parseInt(this.sessionStorageService.getValue(this.locationKey) ?? 0)
  );

  override ngOnInit(): void {
    this.advancedStoreKey = this.memberId()
      ? "redemption-list-member-advanced-filter"
      : "redemption-list-advanced-filter";
    if (this.memberId() != 0) {
      this.offerGroupId.set(0);
      let advancedFilter = {
        offerTypeId: 0,
        accountTypeId: 0,
        statusId: 0,
        locationId: 0,
      };
      this.setAdvancedFilter(advancedFilter);
    }
    this.param.set({
      pageSize:
        this.sessionStorageService.getCurrentPageSizeOption(
          this.pageSizeOptionKey()
        ) ?? 25,
      pageIndex: 1,
      sorts: "-redeemedDate",
      filters: "",
    });
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      if (result.key === "advanced-filter-redemption") {
        this.setAdvancedFilter(result.value);
      }
      this.getAdvancedFilter();
      this.search();
    });
    this.getAdvancedFilter();
    if (this.hasAdvancedFilter()) {
      this.setAdvancedFilter(
        this.sessionStorageService.getValue(this.advancedStoreKey)
      );
    }
    this.getStatus();
  }
  getAdvancedFilter() {
    const advancedFilter: RedemptionAdvancedFilter =
      this.sessionStorageService.getValue(this.advancedStoreKey);
    this.hasAdvancedFilter.set(advancedFilter?.isAdvancedFilter ?? false);
  }
  setAdvancedFilter(advancedFilter: any) {
    this.offerTypeId.set(advancedFilter.offerTypeId);
    this.accountTypeId.set(advancedFilter.accountTypeId);
    this.statusId.set(advancedFilter.statusId);
    this.locationId.set(advancedFilter.locationId);
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
    this.lookupRefresh$ = this.lookupItemService
      .search(lookupParam)
      .subscribe({ next: (v) => this.lookup.set(v.results) });
  }
  getStatusColor(statusId: number): string {
    const found = this.lookup().find((l) => l.valueId === statusId);
    return found?.color || "inherit";
  }

  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [];
    if (this.memberId() != 0) {
      filters.push({
        field: "memberId",
        operator: "eq",
        value: this.memberId(),
      });
    }

    if (this.redeemedDate.length > 0) {
      filters.push({
        field: "redeemedDate",
        operator: "contains",
        value: `${DatetimeHelper.toShortDateString(
          this.redeemedDate[0]
        )} ~ ${DatetimeHelper.toShortDateString(this.redeemedDate[1])}`,
      });
    }

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
    } else if (this.accountTypeInput()) {
      filters.push({
        field: "redeemWith",
        operator: "eq",
        value: this.accountTypeInput(),
      });
    }

    if (this.offerGroupId()) {
      filters.push({
        field: "offerGroupId",
        operator: "eq",
        value: this.offerGroupId(),
      });
    }
    if (this.statusId()) {
      filters.push({
        field: "status",
        operator: "eq",
        value: this.statusId(),
      });
    }
    if (this.locationId()) {
      filters.push({
        field: "locationId",
        operator: "eq",
        value: this.locationId(),
      });
    }

    return filters;
  }

  isRedemptionAdd = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__REDEMPTION__ADD)
  );
  isRedemptionRemove = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__REDEMPTION__REMOVE)
  );
  isRedemptionView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__REDEMPTION__VIEW)
  );
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  readonly AccountTypes = AccountTypes;
  readonly RedeemStatuses = RedeemStatuses;

  override ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.lookupRefresh$?.unsubscribe();
  }
}
