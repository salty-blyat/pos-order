import {
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import {
  Redemption,
  RedemptionService,
  TransHistory,
} from "./redemption.service";
import { RedemptionUiService } from "./redemption-ui.service";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "../../utils/services/notification.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";

@Component({
  selector: "app-redemption-history",
  template: `
    <nz-layout>
      <!-- <nz-header>
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
              storageKey="redemption-history"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <button
            *ngIf="isRedemptionAdd()"
            nz-button
            nzType="primary"
            (click)="
              uiService.showAdd()
            "
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i
            >{{ "Add" | translate }}
          </button>
        </div>
      </nz-header> -->
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
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "TransNo" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "Type" | translate }}
              </th>

              <th nzWidth="100px">
                {{ "RefNo" | translate }}
              </th>
              <th nzWidth="100px">
                {{ "Date" | translate }}
              </th>
              <th nzWidth="100px">
                {{ "Amount" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
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
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.transNo }}</a
                >
                <span *ngIf="!isRedemptionHistoryView()">{{
                  data.transNo
                }}</span>
              </td>
              <td nzEllipsis>{{ data.typeNameEn }}</td>
              <td nzEllipsis>{{ data.refNo }}</td>
              <td nzEllipsis>{{ data.transDate | customDate }}</td>
              <td nzEllipsis>{{ data.amount }}</td>
              <td nzEllipsis>{{ data.note }}</td>
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
export class RedemptionHistoryComponnet extends BaseListComponent<TransHistory> {
  constructor(
    override service: RedemptionService,
    uiService: RedemptionUiService,
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
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
