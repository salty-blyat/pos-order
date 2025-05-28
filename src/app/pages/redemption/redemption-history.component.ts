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
import { AccountUiService } from "../account/account-ui.service";
import { Transaction } from "../account/account.service";
import { getAccountBalance } from "../../utils/components/get-account-balance";
import { DatetimeHelper } from "../../helpers/datetime-helper";

@Component({
  selector: "app-redemption-history",
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
                    redeemDate = $event; param().pageIndex = 1; search()
                  "
                ></app-date-range-input>
              </div>
            </div>
            <div nz-flex nzGap="small">
              <!-- button goes here -->
            </div>
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
                <td nzEllipsis="">
                  <a
                    *ngIf="isRedemptionHistoryView()"
                    (click)="
                      uiService.showTransaction(data.id || 0, data.accountType!)
                    "
                    >{{ data.redeemNo }}</a
                  >
                  <span *ngIf="!isRedemptionHistoryView()">{{
                    data.redeemNo
                  }}</span>
                </td>
                <td nzEllipsis>{{ data.offerName }}</td>
                <td nzEllipsis>{{ data.transDate | customDateTime }}</td>
                <td nzEllipsis>
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
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class RedemptionHistoryComponnet
  extends BaseListComponent<Transaction>
  implements OnChanges
{
  constructor(
    override service: RedemptionService,
    override uiService: AccountUiService,
    private authService: AuthService,
    public translateService: TranslateService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "redemption-history",
      notificationService
    );
  }

  memberId = input(0);
  redeemDate: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabIndex"]) {
      this.search();
    }
  }

  override ngOnInit(): void {
    this.refreshSub = this.uiService?.refresher?.subscribe(() => {
      this.search();
    });
    this.search();
  }
  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [];
    if (this.memberId()) {
      filters.push({
        field: "memberId",
        operator: "eq",
        value: this.memberId(),
      });
    }
    if (this.redeemDate.length > 0) {
      filters.push({
        field: "redeemDate",
        operator: "contains",
        value: `${DatetimeHelper.toShortDateString(
          this.redeemDate[0]
        )} ~ ${DatetimeHelper.toShortDateString(this.redeemDate[1])}`,
      });
    }
    return filters;
  }

  override search(delay: number = 50) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.param().filters = this.buildFilters();
      this.service.memberHistory(this.param()).subscribe({
        next: (result: { results: Redemption[]; param: QueryParam }) => {
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

  isRedemptionHistoryAdd = computed(() => true);
  isRedemptionHistoryEdit = computed(() => true);
  isRedemptionHistoryRemove = computed(() => true);
  isRedemptionHistoryView = computed(() => true);
  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  readonly AccountTypes = AccountTypes;
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
  getAccountBalance = getAccountBalance;
}
