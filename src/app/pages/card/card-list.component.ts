import {
  Component,
  computed,
  input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import { NotificationService } from "../../utils/services/notification.service";
import { Filter } from "../../utils/services/base-api.service";
import { Card, CardService } from "./card.service";
import { CardUiService } from "./card-ui.service";

@Component({
  selector: "app-card-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <!-- <app-filter-input
              storageKey="card-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input> -->
          </div>
          
        </div>
        <div>
          <button
            nz-button
            nzType="primary"
            *ngIf="isCardAdd()"
            (click)="uiService.showAdd(this.accountId())"
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
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "CardNumber" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "IssueDate" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "ExpiryDate" | translate }}
              </th>
              <!-- <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Status" | translate }}</th> -->
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
                <span *ngIf="!isCardAdd()">{{ data.cardNumber }}</span>
                <a *ngIf="isCardAdd()" (click)="uiService.showView(data.id!)">{{
                  data.cardNumber
                }}</a>
              </td>

              <td nzEllipsis>{{ data.issueDate | customDate }}</td>
              <td nzEllipsis>{{ data.expiryDate | customDate }}</td>
              <!-- <td nzEllipsis>{{ data.status }}</td> -->
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isCardEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)"
                      ><i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        class="pr-sm"
                      ></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isCardRemove()">
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
                        class="pr-sm"
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
export class CardListComponent
  extends BaseListComponent<Card>
  implements OnChanges
{
  constructor(
    override service: CardService,
    uiService: CardUiService,
    sessionStorageService: SessionStorageService,
    private authService: AuthService,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "card-list",
      notificationService
    );
  }

  accountId = input<number>(0);
  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [
      { field: "search", operator: "contains", value: this.searchText() },
    ];
    if (this.accountId()) {
      filters.push({
        field: "accountId",
        operator: "eq",
        value: 2,
      });
    }
    return filters;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["accountId"]) {
      this.search();
    }
  }

  isCardAdd = computed(() => true);
  isCardView = computed(() => true);
  isCardRemove = computed(() => true);
  isCardEdit = computed(() => true);

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
