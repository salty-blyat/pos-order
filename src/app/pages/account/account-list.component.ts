import {
  Component,
  computed,
  inject,
  Input,
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
import { AccountTypes, TransactionTypes } from "../lookup/lookup-type.service";
import { getAccountBalance } from "../../utils/components/get-account-balance";
import { DatetimeHelper } from "../../helpers/datetime-helper";

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
              <div class="filter-box" style="width: 230px;">
                <app-date-range-input
                  storageKey="trans-"
                  (valueChanged)="
                    dateRange = $event; param().pageIndex = 1; search()
                  "
                ></app-date-range-input>
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
          >
            <ng-template #noResult>
              <app-no-result-found></app-no-result-found>
            </ng-template>
            <thead>
              <tr>
                <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
                <th nzWidth="100px">
                  {{ "RedeemNo" | translate }}
                </th>
                <th nzWidth="150px">
                  {{ "Offer" | translate }}
                </th>
                <th nzWidth="150px">
                  {{ "Date" | translate }}
                </th>
                <th nzWidth="100px">
                  {{ "Type" | translate }}
                </th>

                <th nzWidth="100px" nzAlign="right">
                  {{ "Amount" | translate }}
                </th>
                <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
                <th nzWidth="100px">
                  {{ "RefNo" | translate }}
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
                    >{{ data.redeemNo }}</a
                  >
                  <span *ngIf="!isTransactionView()">{{ data.redeemNo }}</span>
                </td>
                <td nzEllipsis>{{ data.offerName }}</td>
                <td nzEllipsis>{{ data.transDate | customDateTime }}</td>
                <td nzEllipsis="">
                  {{
                    translateService.currentLang == "en"
                      ? data.typeNameEn
                      : data.typeNameKh
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
                  {{ getAccountBalance(data.accountType!, data.amount) }}
                </td>
                <td nzEllipsis>{{ data.offerName }}</td>
                <td nzEllipsis>{{ data.note }}</td>
                <td nzEllipsis>{{ data.refNo }}</td>
                <!-- <td class="col-action">
                  <a
                    (click)="uiService.showDeleteTransaction(data.id || 0)"
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
                </td> -->
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

  @Input() accounts: MemberAccount[] = [];
  @Input() tabIndex: number = 0;
  dateRange: any = [];
  isTransactionView = computed(() => true);
  isAccountTopup = computed(() => true);
  isAccountAdjust = computed(() => true);
  cancel() {
    this.ref.triggerCancel().then();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabIndex"]) {
      this.search();
    }
  }

  protected override getCustomFilters(): Filter[] {
    let filters: Filter[] = [];

    if (this.dateRange.length > 0) {
      filters.push({
        field: "dateRange",
        operator: "contains",
        value: `${DatetimeHelper.toShortDateString(
          this.dateRange[0]
        )} ~ ${DatetimeHelper.toShortDateString(this.dateRange[1])}`,
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
      this.param.set({
        pageSize:
          this.sessionStorageService.getCurrentPageSizeOption(
            this.pageSizeOptionKey()
          ) ?? 25,
        pageIndex: 1,
        sorts: "-transDate",
        filters: "",
      });
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
  readonly TransactionTypes = TransactionTypes;
  readonly getAccountBalance = getAccountBalance;
}
