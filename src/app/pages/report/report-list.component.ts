import {
  Component,
  computed,
  input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Data } from "@angular/router";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable } from "rxjs";
import { Filter } from "../../utils/services/base-api.service";
import { Report, ReportService } from "./report.service";
import { ReportUiService } from "./report-ui.service";
import { AuthService } from "../../helpers/auth.service";
import { NotificationService } from "../../utils/services/notification.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthKeys, SIZE_COLUMNS } from "../../const";

@Component({
  selector: "app-report-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="position-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div *ngIf="draged()">
            <button
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
            *ngIf="isReportAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd(reportGroupId)"
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
              <th nzWidth="20px"></th>
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "DisplayName" | translate }}
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
              <th nzWidth="200px"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList
            cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr *ngFor="let data of lists(); let i = index" cdkDrag>
              <td style="width: 35px; cursor: move;" cdkDragHandle>
                <span nz-icon nzType="holder" nzTheme="outline"></span>
              </td>
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
                  *ngIf="isReportView()"
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.name! | translate }}</a
                >
                <span *ngIf="!isReportView()">{{ data.name! | translate }}</span>
              </td>
              <td nzEllipsis>{{ data.label! | translate }}</td>
              <td nzEllipsis style="flex: 3;">{{ data.note }}</td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *nzSpaceItem>
                    <span
                      style="color: rgb(231, 76, 60);"
                      *ngIf="data.isHidden"
                      nz-icon
                      nzType="eye-invisible"
                      nzTheme="outline"
                    ></span>
                    <span
                      style="color: rgb(46, 204, 113);"
                      *ngIf="!data.isHidden"
                      nz-icon
                      nzType="eye"
                      nzTheme="outline"
                    ></span>
                  </ng-container>
                  <ng-container *ngIf="isReportEdit()">
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
                  <ng-container *ngIf="isReportRemove()">
                    <a
                      *nzSpaceItem
                      nz-typography
                      (click)="uiService.showDelete(data.id || 0)"
                      style="color: #F31313"
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
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class ReportListComponent
  extends BaseListComponent<Report>
  implements OnChanges {
  constructor(
    service: ReportService,
    uiService: ReportUiService,
    private activated: ActivatedRoute,
    sessionStorageService: SessionStorageService,
    private authService: AuthService
  ) {
    super(service, uiService, sessionStorageService, "report-list");
  }

  reportGroupId = input<number>(0);
  breadcrumbData = computed<Observable<Data>>(() => this.activated.data);
  isReportAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT__ADD));
  isReportEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT__EDIT));
  isReportRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT__REMOVE));
  isReportView = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT__VIEW));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["reportGroupId"]) {
      this.search(changes["reportGroupId"].currentValue);
    }
  }

  override search(reportGroupId?: any) {
    const filters = [
      {
        field: "reportGroupId",
        operator: "eq",
        value: reportGroupId,
      },
    ];
    super.search(filters, 100);
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
