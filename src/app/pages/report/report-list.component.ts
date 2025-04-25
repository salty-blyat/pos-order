import {
  Component,
  computed,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Data } from "@angular/router";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable, Subscription } from "rxjs";
import { PAGE_SIZE_OPTION } from "../../const";
import { QueryParam } from "../../utils/services/base-api.service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { Report, ReportService } from "./report.service";
import { ReportUiService } from "./report-ui.service";
import { AuthService } from "../../helpers/auth.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-report-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div style="width: 220px; margin-right: 4px;">
            <app-filter-input
              storageKey="position-list-search"
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div *ngIf="draged">
            <button
              nz-button
              nzType="primary"
              (click)="saveOrdering()"
              [nzLoading]="loading"
            >
              {{ "Save" | translate }}
            </button>
          </div>
        </div>
        <div>
          <button
            *ngIf="isReportAdd"
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
          [nzPageSizeOptions]="pageSizeOption"
          [nzData]="list"
          [nzLoading]="loading"
          [nzTotal]="param.rowCount || 0"
          [nzPageSize]="param.pageSize || 0"
          [nzPageIndex]="param.pageIndex || 0"
          [nzNoResult]="noResult"
          [nzFrontPagination]="false"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th class="col-rowno" nzColumnKey="drag"></th>
              <th class="col-header col-rowno">#</th>
              <th nzWidth="25%">
                {{ "Name" | translate }}
              </th>
              <th nzWidth="25%">
                {{ "DisplayName" | translate }}
              </th>
              <th>{{ "Note" | translate }}</th>
              <th nzWidth="30px"></th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="list"
          >
            <tr *ngFor="let data of list; let i = index" cdkDrag>
              <td style="width: 35px; cursor: move;" cdkDragHandle>
                <span nz-icon nzType="holder" nzTheme="outline"></span>
              </td>
              <td nzEllipsis>
                {{
                  i
                    | rowNumber
                      : {
                          index: param.pageIndex || 0,
                          size: param.pageSize || 0
                        }
                }}
              </td>
              <td nzEllipsis style="flex: 3;">{{ data.name }}</td>
              <td nzEllipsis style="flex: 2;">
                <a
                  *ngIf="isReportView"
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.label! | translate }}</a
                >
                <span *ngIf="!isReportView">{{ data.label! | translate }}</span>
              </td>

              <td nzEllipsis style="flex: 3;">{{ data.note }}</td>
              <td nzEllipsis>
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
              </td>
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container>
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
                  <ng-container>
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
  styles: [
    `
      .menu-dropdown {
        position: absolute;
        right: 10px;
        margin-bottom: 4px;
      }
      ::ng-deep .cdk-drag-preview {
        display: flex;
        background: rgba(0, 0, 0, 0.1);
        gap: 1em;

        align-items: center;
        padding: 0 4px;
      }

      ::ng-deep .cdk-drag-placeholder {
        opacity: 0;
      }
      .block-ordering {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin: 0;
      }
      .block-move {
        position: absolute;
        z-index: 1000;
        width: 35px;
        cursor: move;
        padding: 7px;
        margin-bottom: 5px;
      }
    `,
  ],
  standalone: false,
})
export class ReportListComponent implements OnInit, OnChanges {
  constructor(
    private service: ReportService,
    public uiService: ReportUiService,
    private activated: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  @Input() reportGroupId: number = 0;
  list: Report[] = [];
  refreshSub!: Subscription;
  pageSizeOption = PAGE_SIZE_OPTION;
  loading = false;
  searchText = "";
  breadcrumbData = computed<Observable<Data>>(() => this.activated.data);
  pageSizeOptionKey = "report-list";
  param: QueryParam = {
    pageSize:
      this.sessionStorageService.getCurrentPageSizeOption(
        this.pageSizeOptionKey
      ) ?? 25,
    pageIndex: 1,
    sorts: "",
    filters: "",
  };
  draged: boolean = false;
  isReportAdd: boolean = true;
  isReportEdit: boolean = true;
  isReportRemove: boolean = true;
  isReportView: boolean = true;
  ngOnInit(): void {
    // this.isReportAdd = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT__ADD
    // );
    // this.isReportEdit = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT__EDIT
    // );
    // this.isReportRemove = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT_GROUP__REMOVE
    // );
    // this.isReportView = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT__VIEW
    // );

    
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      this.search();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.search();
  }

  search() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: "name", operator: "contains", value: this.searchText },
      ];

      if (this.reportGroupId) {
        filters.push({
          field: "reportGroupId",
          operator: "eq",
          value: this.reportGroupId,
        });
      }
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe(
        (result: { results: Report[]; param: QueryParam }) => {
          this.loading = false;
          this.list = result.results;
          this.param = result.param;
        },
        (error: any) => {
          this.loading = false;
          console.log(error);
        }
      );
    }, 50);
  }
  drop(event: CdkDragDrop<Report[], any, any>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    if (event.previousIndex !== event.currentIndex) this.draged = true;
  }

  saveOrdering() {
    this.loading = true;
    let newLists: Report[] = [];

    this.list.forEach((item, i) => {
      item.ordering = i + 1;
      newLists.push(item);
    });
    this.service.updateOrdering(newLists).subscribe(() => {
      this.loading = false;
      this.draged = false;
      this.notificationService.successNotification("Successfully Saved");
    });
  }

  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = param;
    const sortFound = sort.find((x) => x.value);
    this.param.sorts =
      (sortFound?.key ?? "name") + (sortFound?.value === "descend" ? "-" : "");
    this.param.pageSize = pageSize;
    this.param.pageIndex = pageIndex;
    this.sessionStorageService.setPageSizeOptionKey(
      pageSize,
      this.pageSizeOptionKey
    );
    this.search();
  }
}
