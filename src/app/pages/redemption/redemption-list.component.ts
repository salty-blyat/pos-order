import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import { Redemption, RedemptionService } from "./redemption.service";
import { RedemptionUiService } from "./redemption-ui.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-redemption-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="redemption-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            >
            </app-filter-input>
          </div>
        </div>
        <!-- <div>
          <button
            *ngIf="isRedemptionAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i
            >{{ "Add" | translate }}
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
              <th [nzWidth]="SIZE_COLUMNS.ID" class="col-header col-rowno">
                #
              </th>
              <th [nzWidth]="SIZE_COLUMNS.CODE">
                {{ "RedeemNo" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "OfferName" | translate }}
              </th>
              <th nzWidth="150px">{{ "Status" | translate }}</th>
              <th nzWidth="75px">{{ "Qty" | translate }}</th>
              <th nzWidth="100px">{{ "Amount" | translate }}</th>
              <th nzWidth="120px">{{ "Location" | translate }}</th>
              <th nzWidth="150px">{{ "RedeemedDate" | translate }}</th>
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
              <td nzEllipsis>
                <a
                  *ngIf="isRedemptionView()"
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.redeemNo }}</a
                >
                <span *ngIf="!isRedemptionView()">{{ data.redeemNo }}</span>
              </td>
              <td nzEllipsis>{{ data.offerName }}</td>
              <td nzEllipsis>
                {{
                  translateService.currentLang == "km"
                    ? data.statusNameKh
                    : data.statusNameEn
                }}
              </td>
              <td nzEllipsis>{{ data.qty }}</td>
              <td nzEllipsis>{{ data.amount }}</td>
              <td nzEllipsis>{{ data.locationName }}</td>
              <td nzEllipsis>{{ data.redeemedDate | customDate }}</td>
              <td nzEllipsis>{{ data.note }}</td>
              <td class="col-action">
                <!-- <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isRedemptionEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        style="padding-right: 5px"
                      ></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container> -->
                <!-- <ng-container *ngIf="isRedemptionRemove()"> -->
                <a
                  *nzSpaceItem
                  nz-typography
                  style="color: #F31313"
                  (click)="uiService.showDelete(data.id || 0)"
                >
                  <i
                    nz-icon
                    nzType="delete"
                    nzTheme="outline"
                    style="padding-right: 5px"
                  ></i>
                  {{ "Delete" | translate }}
                </a>
                <!-- </ng-container> -->
                <!-- </nz-space> -->
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
export class RedemptionListComponent extends BaseListComponent<Redemption> {
  constructor(
    service: RedemptionService,
    uiService: RedemptionUiService,
    private authService: AuthService,
    public translateService: TranslateService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "redemption-list");
  }

  isRedemptionAdd = computed(() => true);
  isRedemptionEdit = computed(() => true);
  isRedemptionRemove = computed(() => true);
  isRedemptionView = computed(() => true);
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
