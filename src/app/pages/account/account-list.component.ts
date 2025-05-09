import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { AuthService } from "../../helpers/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SIZE_COLUMNS } from "../../const";
import { AccountUiService } from "./account-ui.service";
import { Account, AccountService } from "./account.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-account-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="account-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
        </div>
        <!-- <div>
          <button
            *ngIf="isAccountAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd(branchId())"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            {{ "Add" | translate }}
          </button>
        </div> -->
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
              <th [nzWidth]="SIZE_COLUMNS.CODE">
                {{ "MemberId" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "AccountType" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION" nzAlign="right"></th>
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
                  *ngIf="isAccountView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.memberId }}</a
                >
                <span *ngIf="!isAccountView()">{{ data.memberId }}</span>
              </td>
              <td nzEllipsis>{{ data.memberName }}</td>
              <td nzEllipsis>
                {{
                  translateService.currentLang == "km"
                    ? data.accountTypeNameKh
                    : data.accountTypeNameEn
                }}
              </td>

              <td class="col-action">
                <a
                  *ngIf="isAccountRemove()" 
                  (click)="uiService.showDelete(data.id || 0)"
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
export class AccountListComponent extends BaseListComponent<Account> {
  constructor(
    service: AccountService,
    sessionStorageService: SessionStorageService,
    public override uiService: AccountUiService,
    private activated: ActivatedRoute,
    private authService: AuthService,
    public translateService: TranslateService
  ) {
    super(service, uiService, sessionStorageService, "location-list");
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  readonly branchKey = this.sessionStorageService.getValue("branch-filter");
  branchId = signal<number>(0);
  isAccountAdd = signal<boolean>(true);
  isAccountEdit = signal<boolean>(true);
  isAccountRemove = signal<boolean>(true);
  isAccountView = signal<boolean>(true);
  readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
