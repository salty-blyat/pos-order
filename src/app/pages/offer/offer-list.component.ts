import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import { Offer, OfferService } from "./offer.service";
import { OfferUiService } from "./offer-ui.service";
import { TranslateService } from "@ngx-translate/core";
import { Filter } from "../../utils/services/base-api.service";
import { AccountTypes, LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { NotificationService } from "../../utils/services/notification.service";
@Component({
  selector: "app-offer-list",
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
              storageKey="offer-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            >
            </app-filter-input>

            <app-lookup-item-select
              class="fixed-width-select"
              showAll="AllOfferType"
              [showAllOption]="true"
              storageKey="offer-type-list-search"
              [lookupType]="LOOKUP_TYPE.OfferType"
              (valueChanged)="
                offerTypeId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-lookup-item-select>

            <app-offer-group-select
              class="fixed-width-select"
              [showAllOption]="true"
              storageKey="offer-group-list-search"
              (valueChanged)="
                offerGroupId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-offer-group-select>

            <app-lookup-item-select
              class="fixed-width-select"
              showAll="AllAccountType"
              storageKey="account-type-list-search"
              [showAllOption]="true"
              [lookupType]="LOOKUP_TYPE.AccountType"
              (valueChanged)="
                accountTypeId.set($event); param().pageIndex = 1; search()
              "
            ></app-lookup-item-select>
          </div>

          <button
            *ngIf="isOfferAdd()"
            nz-button
            nzType="primary"
            (click)="
              uiService.showAdd(offerGroupId(), offerTypeId(), accountTypeId())
            "
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i
            >{{ "Add" | translate }}
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
              <th [nzWidth]="SIZE_COLUMNS.ID" class="col-header col-rowno">
                #
              </th>
              <th [nzWidth]="SIZE_COLUMNS.CODE">{{ "Code" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.IMAGE" nzEllipsis nzAlign="center">
                {{ "Image" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME" nzEllipsis>
                {{ "Name" | translate }}
              </th>
              <th nzWidth="100px" nzAlign="right">
                {{ "RedeemCost" | translate }}
              </th>
              <th nzWidth="110px" nzAlign="right">
                {{ "RedeemedQty" | translate }}
              </th>
              <th nzWidth="100px">
                {{ "OfferType" | translate }}
              </th>
              <th nzWidth="100px">
                {{ "OfferGroup" | translate }}
              </th>

              <th nzWidth="190px">
                {{ "OfferDuration" | translate }}
              </th>
              <th nzWidth="190px">
                {{ "Note" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists(); let i = index">
              <td nzEllipsis class="col-rowno">
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
                  *ngIf="isOfferView()"
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isOfferView()">{{ data.code }}</span>
              </td>
              <td nzEllipsis class="image" nzAlign="center">
                <img
                  *ngIf="data.photo"
                  class="image-list"
                  height="42"
                  [src]="data.photo"
                  alt=""
                />
              </td>
              <td nzEllipsis>
                {{ data.name }}
              </td>
              <td nzEllipsis nzAlign="right">
                @if(data.redeemCost == 0){
                {{ "Free" | translate }}
                } @else { @if (data.redeemWith == AccountTypes.Point){
                <span> {{ data.redeemCost + " pts" }}</span>
                } @else if (data.redeemWith == AccountTypes.Wallet){
                <span> {{ data.redeemCost + " $" }}</span>
                } @else {
                <span>{{ data.redeemCost }}</span>
                } }
              </td>
              <td nzEllipsis nzAlign="right">
                {{ data.redeemedQty }} / {{ data.maxQty }}
              </td>
              <td nzEllipsis>
                {{
                  translateService.currentLang == "km"
                    ? data.offerTypeNameKh
                    : data.offerTypeNameEn
                }}
              </td>
              <td nzEllipsis>{{ data.offerGroupName }}</td>
              <td nzEllipsis>
                {{ data.offerStartAt | customDate }} ~
                {{ data.offerEndAt | customDate }}
              </td>
              <td nzEllipsis>
                {{ data.note }}
              </td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isOfferEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        style="padding-right: 5px"
                      ></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isOfferRemove()">
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
  styles: [
    `
      .image {
        padding: 0 !important;
      }
      .image-list {
        height: 38px;
        object-fit: scale-down;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OfferListComponent extends BaseListComponent<Offer> {
  constructor(
    service: OfferService,
    override uiService: OfferUiService,
    private authService: AuthService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    public translateService: TranslateService,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "offer-list",
      notificationService
    );
  }

  readonly offerGroupKey = "offer-group-list-search";
  readonly offerTypeKey = "offer-type-list-search";
  readonly accountTypeKey = "account-type-list-search";

  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  accountTypeId = signal(
    parseInt(this.sessionStorageService.getValue(this.accountTypeKey) ?? 0)
  );
  offerGroupId = signal(
    parseInt(this.sessionStorageService.getValue(this.offerGroupKey) ?? 0)
  );
  offerTypeId = signal(
    parseInt(this.sessionStorageService.getValue(this.offerTypeKey) ?? 0)
  );

  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [];
    if (this.offerTypeId()) {
      filters.push({
        field: "OfferType",
        operator: "eq",
        value: this.offerTypeId(),
      });
    }
    if (this.accountTypeId()) {
      filters.push({
        field: "redeemWith",
        operator: "eq",
        value: this.accountTypeId(),
      });
    }

    if (this.offerGroupId()) {
      filters.push({
        field: "offerGroupId",
        operator: "eq",
        value: this.offerGroupId(),
      });
    }
    return filters;
  }
  isOfferAdd = computed(() => true);
  isOfferEdit = computed(() => true);
  isOfferRemove = computed(() => true);
  isOfferView = computed(() => true);
  readonly AccountTypes = AccountTypes;
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
