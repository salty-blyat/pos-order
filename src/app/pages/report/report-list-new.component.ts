import {
  Component,
  computed,
  EventEmitter,
  OnDestroy,
  Output,
  signal, ViewEncapsulation,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { QueryParam } from "../../utils/services/base-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, timer } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Report } from "./report.service";
import {
  ReportGroup,
  ReportGroupService,
} from "../report-group/report-group.service";
import { ReportGroupUiService } from "../report-group/report-group-ui.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-report-new-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-content>
        <nz-layout>
          <nz-sider nzWidth="300px" nzTheme="light">
            <div style="margin: 14px 8px 8px 0px;">
              <app-filter-input
                storageKey="report-new-list-search"
                (filterChanged)="
                  searchText.set($event); param().pageIndex = 1; search()
                "
              ></app-filter-input>
            </div>

            <ul
              nz-menu
              nzMode="inline"
              class="sider-menu"
              cdkDropList cdkDropListLockAxis="y"
              (cdkDropListDropped)="drop($event)"
              [cdkDropListData]="lists()"
            >
              <ul
                *ngFor="let data of lists(); let i = index"
                cdkDrag
                style="margin-right: 8px;"
                class="block-ordering"
              >
                <span
                  nz-icon
                  nzType="holder"
                  nzTheme="outline"
                  class="block-move"
                  cdkDragHandle
                ></span>
                <li
                  nz-menu-item
                  (click)="changeGroupId(data.id!)"
                  [nzSelected]="reportGroupId() === data.id!"
                  style="padding-left: 36px"
                >
                  {{ data.name }}
                </li>

                <a
                  [nzDropdownMenu]="menu"
                  class="action-button menu-dropdown"
                  nz-dropdown
                  nzTrigger="click"
                  nzPlacement="bottomRight"
                >
                  <i
                    nz-icon
                    nzType="ellipsis"
                    nzTheme="outline"
                    style="font-size: 22px"
                  ></i>
                </a>
                <nz-dropdown-menu #menu="nzDropdownMenu">
                  <ul nz-menu nzSelectable>
                    <li
                      *ngIf="isReportGroupEdit()"
                      class="menu-item edit"
                      nz-menu-item
                      (click)="uiService.showEdit(data.id!)"
                    >
                      <span>
                        <i nz-icon nzType="edit"></i>&nbsp;
                        <span class="action-text">
                          {{ "Edit" | translate }}</span
                        >
                      </span>
                    </li>
                    <li
                      *ngIf="isReportGroupRemove()"
                      class="menu-item delete"
                      nz-menu-item
                      (click)="uiService.showDelete(data.id!)"
                    >
                      <span>
                        <i nz-icon nzType="delete"></i>&nbsp;
                        <span class="action-text">
                          {{ "Delete" | translate }}</span
                        >
                      </span>
                    </li>
                  </ul>
                </nz-dropdown-menu>
              </ul>
              <div *ngIf="!draged()">
                <button
                  *ngIf="isReportGroupAdd()"
                  nz-button
                  nzType="dashed"
                  style="width: 292px;"
                  (click)="uiService.showAdd(reportGroupId())"
                >
                  <i nz-icon nzType="plus" nzTheme="outline"></i>
                  {{ "Add" | translate }}
                </button>
              </div>
              <div *ngIf="draged()">
                <button
                  *ngIf="isReportGroupAdd()"
                  nz-button
                  nzType="primary"
                  (click)="saveOrdering()"
                  [nzLoading]="isLoading()"
                  style="width: 292px;"
                >
                  {{ "Save" | translate }}
                </button>
              </div>
            </ul>
          </nz-sider>
          <nz-content class="inner-content-report-list">
            <app-report-list
              [reportGroupId]="reportGroupId()"
            ></app-report-list>
          </nz-content>
        </nz-layout>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .inner-content-report-list{
        padding: 0 0 0 14px;
        border-left: 1px solid var(--ant-border-color);
      }
      .sider-menu {
        height: 91.7%;
        background: #fff;
      }
      .ant-layout-content {
        margin: 0 -15px;
      }
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
        margin-top: -8px;
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
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class ReportNewListComponent extends BaseListComponent<Report> {
  constructor(
    override service: ReportGroupService,
    uiService: ReportGroupUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    public translate: TranslateService
  ) {
    super(service, uiService, sessionStorageService, "report_group_list");
  }

  // @Output() reportGroup: EventEmitter<any> = new EventEmitter<any>();
  isReportGroupAdd = signal<boolean>(true);
  isReportGroupEdit = signal<boolean>(true);
  isReportGroupRemove = signal<boolean>(true);
  isReportGroupView = signal<boolean>(true);
  reportGroupId = signal<number>(0);
  // draged = signal<boolean>(false);
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  override ngOnInit() {
    // this.isReportGroupAdd = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT_GROUP__ADD
    // );
    // this.isReportGroupEdit = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT_GROUP__EDIT
    // );
    // this.isReportGroupRemove = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT_GROUP__REMOVE
    // );
    // this.isReportGroupView = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT_GROUP__VIEW
    // );
    // this.refreshSub = this.uiService.refresher.subscribe((result) => {
    //   this.search();
    // });
    //
    // super.ngOnInit();
  }

  // saveOrdering() {
  //   this.isLoading.set(true);
  //   let newLists: Report[] = [];

  //   this.lists().forEach((item, i) => {
  //     item.ordering = i + 1;
  //     newLists.push(item);
  //   });
  //   this.service.updateOrdering(newLists).subscribe(() => {
  //     this.isLoading.set(false);
  //     this.draged.set(false);
  //     this.notificationService.successNotification('Successfully Saved');
  //   });
  // }

  // // drop(event: CdkDragDrop<any, any, any>) {
  // //   moveItemInArray(this.lists(), event.previousIndex, event.currentIndex);
  // //   if (event.previousIndex !== event.currentIndex) this.draged.set(true);
  // // }
  changeGroupId(id: number) {
    this.reportGroupId.set(id);
  }
}
