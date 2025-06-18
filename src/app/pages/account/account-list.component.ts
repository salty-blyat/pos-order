import {
  Component,
  computed,
  inject,
  Input,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AuthService } from "../../helpers/auth.service";
import { ActivatedRoute } from "@angular/router";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { Account, AccountService, Transaction } from "./account.service";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { NotificationService } from "../../utils/services/notification.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import { AccountUiService } from "./account-ui.service";
import { TranslateService } from "@ngx-translate/core";
import {
  AccountTypes,
  LOOKUP_TYPE,
  TransactionTypes,
} from "../lookup/lookup-type.service";
import { DatetimeHelper } from "../../helpers/datetime-helper";
import { Subscription } from "rxjs";

@Component({
  selector: "app-account-list",
  standalone: false,
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
              class="fixed-width-select"
              [storageKey]="'account-list-' + accountId"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>

            <app-date-range-input
              storageKey="account-date-range"
              style="width:230px;"
              (valueChanged)="
                transDate = $event; param().pageIndex = 1; search()
              "
            ></app-date-range-input>

            <app-transaction-type-select
              class="fixed-width-select"
              [showAllOption]="true"
              [accountType]="accountType!"
              storageKey="acc-trans-type-list-search"
              (valueChanged)="
                typeId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-transaction-type-select>

            <app-location-select
              class="fixed-width-select"
              [showAllOption]="true"
              storageKey="location-account-list-search"
              (valueChanged)="
                locationId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-location-select>
          </div>

          <div nz-flex nzGap="small">
            <button
              *ngIf="
                (accountType == AccountTypes.Wallet && isWalletAdjust()) ||
                (accountType == AccountTypes.Point && isPointAdjust())
              "
              style="margin-right: 4px;"
              nz-button
              nzType="primary"
              (click)="
                uiService.showAdjust(
                  '',
                  accountId!,
                  TransactionTypes.Adjust,
                  accountType!
                )
              "
            >
              {{ "Adjust" | translate }}
            </button>
            <button
              *ngIf="isTopup && isWalletTopup()"
              nz-button
              nzType="primary"
              (click)="
                uiService.showAdjust(
                  '',
                  accountId!,
                  TransactionTypes.Topup,
                  accountType!
                )
              "
            >
              {{ "Topup" | translate }}
            </button>
            <button
              *ngIf="!isTopup && isPointEarn()"
              nz-button
              nzType="primary"
              (click)="
                uiService.showAdjust(
                  '',
                  accountId!,
                  TransactionTypes.Earn,
                  accountType!
                )
              "
            >
              {{ "Earn" | translate }}
            </button>
          </div>
        </div>
      </nz-header>

      <nz-content>
        <nz-table
          nzSize="small"
          nzShowSizeChanger
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
          style="height: calc(100vh - 270px);"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th nzWidth="120px">
                {{ "TransNo" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.DATE">
                {{ "Date" | translate }}
              </th>
              <th nzWidth="120px">
                {{ "Type" | translate }}
              </th>
              <th nzEllipsis nzWidth="180px">{{ "Location" | translate }}</th>
              <th nzEllipsis>{{ "Note" | translate }}</th>
              <th nzWidth="100px" nzAlign="right">
                {{ "Balance" | translate }}
              </th>
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
                  *ngIf="
                    (accountType == AccountTypes.Wallet && isWalletView()) ||
                    (accountType == AccountTypes.Point && isPointView())
                  "
                  (click)="
                    uiService.showTransaction(data.id || 0, data.accountType!)
                  "
                  >{{ data.transNo }}</a
                >
                <span
                  *ngIf="
                    (accountType == AccountTypes.Wallet && !isWalletView()) ||
                    (accountType == AccountTypes.Point && !isPointView())
                  "
                  >{{ data.transNo }}</span
                >
              </td>
              <td nzEllipsis>{{ data.transDate | customDateTime }}</td>
              <td nzEllipsis>
                {{
                  translateService.currentLang == "en"
                    ? data.typeNameEn
                    : data.typeNameKh
                }}
              </td>

              <td nzEllipsis>
                <span *ngIf="data.branchName">{{
                  data.branchName + ", "
                }}</span>
                <span>
                  {{ data.locationName }}
                </span>
              </td>
              <td nzEllipsis>
                <span *ngIf="data.offerName">{{ data.offerName + " " }}</span
                >{{ data.note }}
              </td>
              <td
                nzEllipsis
                nzAlign="right"
                [ngStyle]="{
                  color:
                    data.amount! > 0
                      ? 'black'
                      : data.amount! < 0
                      ? 'red'
                      : 'black',
                  'font-weight': 'semi-bold'
                }"
              >
                {{ data.amount | accountBalance : data.accountType! : true }}
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AccountListComponent extends BaseListComponent<Transaction> {
  constructor(
    override service: AccountService,
    override uiService: AccountUiService,
    private authService: AuthService,
    public translateService: TranslateService,
    private ref: NzModalRef,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "transaction-list",
      notificationService
    );
  }
  readonly modal: any = inject(NZ_MODAL_DATA);
  readonly SIZE_COLUMNS = SIZE_COLUMNS;

  @Input() accountId = 0;
  @Input() accountType = 0;
  transDate: any = [];
  isWalletTopup = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__WALLET__TOPUP)
  );
  isWalletAdjust = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__WALLET__ADJUST)
  );
  isWalletView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__WALLET__VIEW)
  );

  isPointEarn = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__POINT__EARN)
  );
  isPointAdjust = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__POINT__ADJUST)
  );
  isPointView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__POINT__VIEW)
  );

  account!: Account;
  isTopup = false;
  locationId = signal<number>(0);
  typeId = signal<number>(0);
  accountRefresh$ = new Subscription();

  protected override getCustomFilters(): Filter[] {
    let filters: Filter[] = [];

    if (this.typeId()) {
      filters.push({
        field: "type",
        operator: "eq",
        value: this.typeId(),
      });
    }
    if (this.locationId()) {
      filters.push({
        field: "locationId",
        operator: "eq",
        value: this.locationId(),
      });
    }
    if (this.transDate.length > 0) {
      filters.push({
        field: "transDate",
        operator: "contains",
        value: `${DatetimeHelper.toShortDateString(
          this.transDate[0]
        )} ~ ${DatetimeHelper.toShortDateString(this.transDate[1])}`,
      });
    }
    return filters;
  }

  override ngOnInit(): void {
    this.refreshSub = this.uiService.refresher.subscribe((e) => {
      if (e.key == "added" && e.value.accountId == this.accountId) {
        this.search();
      }
    });
    this.isTopup = this.accountType == AccountTypes.Wallet;
  }

  override search(delay: number = 50) {
    if (!this.transDate) return;
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.param.set({ ...this.param(), sorts: "-transDate" });
      this.param().filters = this.buildFilters();
      this.accountRefresh$ = this.service
        .getTransactions(this.accountId, this.param())
        .subscribe({
          next: (result: { results: Transaction[]; param: QueryParam }) => {
            this.lists.set(result.results);
            this.param.set(result.param);
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
    }, delay);
  }

  readonly AccountTypes = AccountTypes;
  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  readonly TransactionTypes = TransactionTypes;
  override ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.accountRefresh$?.unsubscribe();
  }
}
