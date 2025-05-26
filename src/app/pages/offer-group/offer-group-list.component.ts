import { Component, computed, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OfferGroup, OfferGroupService } from "./offer-group.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { OfferGroupUiService } from "./offer-group-ui.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import { Observable } from "rxjs";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-offer-group-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="offer-group-list"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            >
            </app-filter-input>
          </div>
        </div>
        <div>
          <button
            *ngIf="isOfferGroupAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            {{ "Add" | translate }}
          </button>
        </div>
      </nz-header>
      <nz-content>
        <nz-table
          nzSize="small"
          nzTableLayout="fixed"
          nzShowSizeChanger
          #fixedTable
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
              <th [nzWidth]="SIZE_COLUMNS.IMAGE" nzEllipsis nzAlign="center">
                {{ "Image" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME" nzEllipsis>
                {{ "Name" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE" nzEllipsis>
                {{ "Note" | translate }}
              </th>
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
              <td nzEllipsis class="image" nzAlign="center">
                <img
                  *ngIf="data.image"
                  class="image-list"
                  height="42"
                  [src]="data.image"
                  alt=""
                />
                <img
                  *ngIf="!data.image"
                  class="image-list"
                  height="42"
                  src="./assets/image/img-not-found.jpg"
                  alt=""
                />
              </td>
              <td nzEllipsis>
                <a
                  *ngIf="isOfferGroupView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.name }}</a
                >
                <span *ngIf="!isOfferGroupView()">{{ data.name }}</span>
              </td>
              <td nzEllipsis>
                <span>{{ data.note }}</span>
              </td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isOfferGroupEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        class="edit"
                      ></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isOfferGroupRemove()">
                    <a
                      *nzSpaceItem
                      class="delete"
                      (click)="uiService.showDelete(data.id || 0)"
                    >
                      <i nz-icon nzType="delete" nzTheme="outline"></i>
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
  styles: [
    `
      .image {
        padding: 0 !important;
      }
      .image-list {
        height: 38px;
        object-fit: scale-down;
      }

      .color-box {
        width: 22px;
        height: 22px;
        margin-right: 4px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class OfferGroupListComponent extends BaseListComponent<OfferGroup> {
  constructor(
    public override uiService: OfferGroupUiService,
    service: OfferGroupService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    public authService: AuthService,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "offer-group-list",
      notificationService
    );
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isOfferGroupAdd = computed(() => true);
  isOfferGroupEdit = computed(() => true);
  isOfferGroupRemove = computed(() => true);
  isOfferGroupView = computed(() => true);

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
