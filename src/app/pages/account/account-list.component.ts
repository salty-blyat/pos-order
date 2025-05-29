import {
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AuthService } from "../../helpers/auth.service";
import { ActivatedRoute } from "@angular/router";
import { SIZE_COLUMNS } from "../../const";
import { AccountService, Transaction } from "./account.service";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { NotificationService } from "../../utils/services/notification.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import { MemberAccount } from "../member/member.service";
import { AccountUiService } from "./account-ui.service";
import { TranslateService } from "@ngx-translate/core";
import {
  AccountTypes,
  LOOKUP_TYPE,
  TransactionTypes,
} from "../lookup/lookup-type.service";
import { getAccountBalance } from "../../utils/components/get-account-balance";
import { DatetimeHelper } from "../../helpers/datetime-helper";
import { CurrencyService } from "../currency/currency.service";

@Component({
  selector: "app-account-list",
  standalone: false,
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      {{ "TransactionHistory" | translate }}
    </div>
    <div class="modal-content">
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
              <div style='width:140px'>
                <app-filter-input
                  class="fixed-width-select"
                  [storageKey]="'account-list-' + accounts[tabIndex]?.accountId"
                  (filterChanged)="
                    searchText.set($event); param().pageIndex = 1; search()
                  "
                ></app-filter-input>
              </div>

              <div >
                <app-date-range-input
                  storageKey="account-date-range"
                  (valueChanged)="
                    transDate = $event; param().pageIndex = 1; search()
                  "
                ></app-date-range-input>
              </div>
              <div style='width:190px'>
                <app-lookup-item-select
                  class="fixed-width-select"
                  showAll="AllTransactionType"
                  [showAllOption]="true"
                  storageKey="acc-trans-type-list-search"
                  [lookupType]="LOOKUP_TYPE.TransactionType"
                  (valueChanged)="
                    typeId.set($event); param().pageIndex = 1; search()
                  "
                >
                </app-lookup-item-select>
              </div>
              <div style='width:190px'>
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
            </div>
            <div nz-flex nzGap="small">
              <button
                *ngIf="isAccountAdjust()"
                nz-button
                nzType="primary"
                (click)="
                  uiService.showAdjust( 
                    '',
                    accounts[tabIndex]?.accountId!,
                    TransactionTypes.Adjust,
                    accounts[tabIndex]?.accountType!,
                    accounts
                  )
                "
              >
                <i nz-icon nzType="plus" nzTheme="outline"></i>
                {{ "Adjust" | translate }}
              </button>
              @if(isTopup){
              <button
                *ngIf="isAccountTopup()"
                nz-button
                nzType="primary"
                (click)="
                  uiService.showAdjust(
                    '',
                    accounts[tabIndex]?.accountId!,
                    TransactionTypes.Topup,
                    accounts[tabIndex]?.accountType!,
                    accounts
                  )
                "
              >
                <i nz-icon nzType="plus" nzTheme="outline"></i>
                {{ "Topup" | translate }}
              </button>
              } @else{
              <button
                *ngIf="isAccountReward()"
                nz-button
                nzType="primary"
                (click)="
                  uiService.showAdjust(
                    '',
                    accounts[tabIndex]?.accountId!,
                    TransactionTypes.Earn,
                    accounts[tabIndex]?.accountType!,
                    accounts
                  )
                "
              >
                <i nz-icon nzType="plus" nzTheme="outline"></i>
                {{ "Reward" | translate }}
              </button>
              }
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
                <th nzWidth="100px">
                  {{ "TransNo" | translate }}
                </th>
                <!-- <th nzWidth="150px">
                  {{ "Offer" | translate }}
                </th> -->
                <th nzWidth="150px">
                  {{ "Date" | translate }}
                </th>
                <th nzWidth="250px">
                  {{ "Type" | translate }}
                </th>

                <th nzEllipsis nzWidth="100px">{{ "Location" | translate }}</th>
                <th nzEllipsis>{{ "Note" | translate }}</th>
                <th nzWidth="100px" nzAlign="right">
                  {{ "Amount" | translate }}
                </th>
                <!-- <th [nzWidth]="SIZE_COLUMNS.ACTION"></th> -->
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
                    *ngIf="isTransactionView()"
                    (click)="
                      uiService.showTransaction(
                        data.id || 0,
                        accounts[tabIndex]?.accountType!
                      )
                    "
                    >{{ data.transNo }}</a
                  >
                  <span *ngIf="!isTransactionView()">{{ data.transNo }}</span>
                </td>
                <!-- <td nzEllipsis>{{ data.offerName }}</td> -->
                <td nzEllipsis>{{ data.transDate | customDateTime }}</td>
                <td nzEllipsis>
                  {{
                    translateService.currentLang == "en"
                      ? data.typeNameEn
                      : data.typeNameKh
                  }}
                  {{
                    data.type == TransactionTypes.Redeem
                      ? " - " + data.offerName
                      : ""
                  }}
                </td>

                <td nzEllipsis>{{ data.locationName }}</td>
                <td nzEllipsis>{{ data.note }}</td>
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
                  {{ getAccountBalance(data.accountType!, data.amount) }}
                </td>
              </tr>
            </tbody>
          </nz-table>
        </nz-content>
      </nz-layout>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AccountListComponent
  extends BaseListComponent<Transaction>
  implements OnChanges
{
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

  @Input() accounts: MemberAccount[] = [];
  @Input() tabIndex: number = 0;
  transDate: any = [];
  isTransactionView = computed(() => true);
  isAccountTopup = computed(() => true);
  isAccountReward = computed(() => true);
  isAccountAdjust = computed(() => true);
  isTopup = false;
  locationId = signal<number>(0);
  typeId = signal<number>(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabIndex"] && this.accounts[this.tabIndex] != undefined) {
      if (this.accounts[this.tabIndex].accountType! == AccountTypes.Wallet) {
        this.isTopup = true;
      } else {
        this.isTopup = false;
      }
      this.search();
    }
  }
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
    this.uiService.refresher.subscribe((e) => {
      if (e.key == "added") {
        this.search();
      }
    });
  }

  override search(delay: number = 50) {
    if (this.isLoading() || this.tabIndex > 1) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.param.set({ ...this.param(), sorts: "-transDate" });
      this.param().filters = this.buildFilters();
      this.service
        .getTransactions(
          this.accounts[this.tabIndex].accountId || 0,
          this.param()
        )
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
  readonly getAccountBalance = getAccountBalance;
  override ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}
