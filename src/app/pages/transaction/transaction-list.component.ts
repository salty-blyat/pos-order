import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AuthService } from "../../helpers/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import { SIZE_COLUMNS } from "../../const";
import { AccountService, Transaction } from "../account/account.service";
import { MemberUiService } from "../member/member-ui.service";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";

@Component({
  selector: "app-transaction-list",
  standalone: false,
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      {{ "TransactionHistory" | translate }}
    </div>
    <div class="modal-content">
      <nz-layout>
        <nz-header>
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
        </nz-header>
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
                <th [nzWidth]="SIZE_COLUMNS.ID" class="col-header col-rowno">
                  #
                </th>
                <th [nzWidth]="SIZE_COLUMNS.NAME">
                  {{ "TransNo" | translate }}
                </th>
                <th nzWidth="100px">
                  {{ "Date" | translate }}
                </th>
                <th nzWidth="100px">
                  {{ "Amount" | translate }}
                </th>
                <th nzWidth="100px">
                  {{ "RefNo" | translate }}
                </th>
                <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
              </tr>
            </thead>

          <tbody>
            <!-- <tr *ngFor="let data of lists(); let i = index">
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
                    (click)="uiService.showView(data.id || 0)"
                    >{{ data.name }}</a
                  >
                  <span *ngIf="!isTransactionView()">{{ data.name }}</span>
                </td>
                <td nzEllipsis>{{ data.format }}</td>
                <td nzEllipsis>{{ data.note }}</td>
              </tr> -->
          </tbody>
        </nz-table>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],

  encapsulation: ViewEncapsulation.None,
})
export class TransactionListComponent extends BaseListComponent<Transaction> {
  constructor(
    override service: AccountService,
    uiService: MemberUiService,
    private authService: AuthService,
    private ref: NzModalRef,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "transaction-list");
    effect(() => {
      console.log(this.accountId());
    });
  }
  readonly modal: any = inject(NZ_MODAL_DATA);
  readonly SIZE_COLUMNS = SIZE_COLUMNS;
  accountId = input<number>(0);
  isTransactionView = computed(() => true);
  cancel() {
    this.ref.triggerCancel().then();
  }
  override ngOnInit(): void {
    this.search();
  }

  override search(filters: Filter[] = [], delay: number = 50) {
    this.isLoading.set(true);
    setTimeout(() => {
      filters?.unshift({
        field: "search",
        operator: "contains",
        value: this.searchText(),
      });

      filters?.map((filter: Filter) => {
        return {
          field: filter.field,
          operator: filter.operator,
          value: filter.value,
        };
      });

      this.param().filters = JSON.stringify(filters);
      this.service.getTransactions(this.accountId(), this.param()).subscribe({
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
}
