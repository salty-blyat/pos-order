import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { AuthService } from "../../helpers/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SIZE_COLUMNS } from "../../const";
import { MemberClass, MemberClassService } from "./member-class.service";
import { MemberClassUiService } from "./member-class-ui.service";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-member-class-list",
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
              storageKey="member-class-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div *ngIf="draged()">
            <button
              style="width: 100%"
              nz-button
              nzType="primary"
              (click)="saveOrdering()"
              [nzLoading]="isLoading()"
            >
              {{ "Save" | translate }}
            </button>
          </div>
        </div>
        <div>
          <button
            *ngIf="isMemberClassAdd()"
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
              <th [nzWidth]="SIZE_COLUMNS.DRAG"></th>
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.IMAGE" nzAlign="center">
                {{ "Image" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.CODE">{{ "Code" | translate }}</th>

              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION" nzAlign="right"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList
            cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr cdkDrag *ngFor="let data of lists(); let i = index">
              <td nzEllipsis style="flex: 0.25">
                <span
                  class="drag-handle"
                  nz-icon
                  nzType="holder"
                  nzTheme="outline"
                  cdkDragHandle
                ></span>
              </td>
              <td nzEllipsis style="flex: 0.5">
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
                  *ngIf="data.photo"
                  class="image-list"
                  height="42"
                  [src]="data.photo"
                  alt=""
                />
                <img
                  *ngIf="!data.photo"
                  class="image-list"
                  height="42"
                  src="./assets/image/img-not-found.jpg"
                  alt=""
                />
              </td>
              <td nzEllipsis style="flex: 1">
                <a
                  *ngIf="isMemberClassView()"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isMemberClassView()"> {{ data.code }}</span>
              </td>

              <td nzEllipsis style="flex: 3">
                {{ data.name }}
              </td>

              <td nzEllipsis style="flex: 3">{{ data.note }}</td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isMemberClassEdit()">
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
                  <ng-container *ngIf="isMemberClassRemove()">
                    <a
                      *nzSpaceItem
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
export class MemberClassListComponent extends BaseListComponent<MemberClass> {
  constructor(
    service: MemberClassService,
    sessionStorageService: SessionStorageService,
    public override uiService: MemberClassUiService,
    private activated: ActivatedRoute,
    private authService: AuthService,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "member-class-list",
      notificationService
    );
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  readonly branchKey = this.sessionStorageService.getValue("branch-filter");
  branchId = signal<number>(0);
  isMemberClassAdd = signal<boolean>(true);
  isMemberClassEdit = signal<boolean>(true);
  isMemberClassRemove = signal<boolean>(true);
  isMemberClassView = signal<boolean>(true);
  readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
