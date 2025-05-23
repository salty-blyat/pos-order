import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AuthService } from "../../helpers/auth.service";
import { ActivatedRoute } from "@angular/router";
import { SIZE_COLUMNS } from "../../const";
import { AccountService, Transaction } from "../account/account.service";
import { MemberUiService } from "../member/member-ui.service";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { NotificationService } from "../../utils/services/notification.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import { Subscription } from "rxjs";
import { MemberAccount } from "../member/member.service";
import { AccountUiService } from "../account/account-ui.service";
import { TranslateService } from "@ngx-translate/core";
import { AccountTypes } from "../lookup/lookup-type.service";

@Component({
  selector: "app-transaction-list",
  standalone: false,
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      {{ "TransactionHistory" | translate }}
    </div>
    <div class="modal-content">
      <nz-layout>
        <!-- <nz-header>
          <div nz-row>
            <div nz-col>
              <app-filter-input
                storageKey="transaction-list-search"
                (filterChanged)="
                  searchText.set($event); param().pageIndex = 1; search()
                "
              >
              </app-filter-input>
            </div>
          </div>
        </nz-header> -->
        <nz-content>
          <nz-table
            style="height:auto"
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
                  {{ "TransNo" | translate }}
                </th>
                <th nzWidth="100px">
                  {{ "Date" | translate }}
                </th>
                <th nzWidth="100px">
                  {{ "Type" | translate }}
                </th>

                <th nzWidth="75px" nzAlign="right">
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
                    (click)="uiService.showTransaction(data.id || 0)"
                    >{{ data.transNo }}</a
                  >
                  <span *ngIf="!isTransactionView()">{{ data.transNo }}</span>
                </td>
                <td nzEllipsis>{{ data.transDate | customDate }}</td>
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
                  @if (data.accountType == AccountTypes.Point){
                  <span> {{ data.amount + " pts" }}</span>
                  } @else if (data.accountType == AccountTypes.Wallet){
                  <span> {{ data.amount + " $" }}</span>
                  } @else {
                  <span>{{ data.amount }}</span>
                  }
                </td>
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
export class TransactionListComponent
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

  accounts = input<MemberAccount[]>([]);
  tabIndex = input<number>(0);

  isTransactionView = computed(() => true);
  cancel() {
    this.ref.triggerCancel().then();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabIndex"]) {
      this.search();
    }
  }
  override ngOnInit(): void {}

  override search(delay: number = 50) {
    let index = this.tabIndex();
    if (this.isLoading() || index > 1) return; //  only wallet/cash need to search
    let accounts = this.accounts();

    this.isLoading.set(true);
    setTimeout(() => {
      this.param().filters = this.buildFilters();
      this.service
        .getTransactions(accounts[index].accountId || 0, this.param())
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
}
