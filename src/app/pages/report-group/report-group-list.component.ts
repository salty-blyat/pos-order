import { Component, computed, signal, ViewEncapsulation, } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { Report } from "../report/report.service";
import { ReportGroupService } from "./report-group.service";
import { ReportGroupUiService } from "./report-group-ui.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Block } from "../block/block.service";
import { QueryParam } from "../../utils/services/base-api.service";
import { AuthKeys } from "../../const";
import { AuthService } from "../../helpers/auth.service";

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
          <nz-sider nzWidth="280px" nzTheme="light">
            <div style="margin: 10px 8px 0 0;">
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
              class="menu-custom-report-group"
              cdkDropList 
              cdkDropListLockAxis="y"
              (cdkDropListDropped)="drop($event)"
              [cdkDropListData]="lists()"
            >
              <ul
                *ngFor="let data of lists(); let i = index"
                style="margin-right: 8px;"
              >
                <li
                  nz-menu-item
                  cdkDrag
                  (click)="changeGroupId(data.id!)"
                  [nzSelected]="reportGroupId() === data.id!"
                  style="padding-left: 36px"
                >
                    <span
                            nz-icon
                            nzType="holder"
                            nzTheme="outline"
                            class="drag-handle"
                            cdkDragHandle
                    ></span>
                  {{ data.name }}
                    <a
                            [nzDropdownMenu]="menu"
                            class="action-button menu-dropdown"
                            nz-dropdown
                            *ngIf="isReportGroupAdd() || isReportGroupEdit() "
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
                </li>
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
                  style="width: 272px;"
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
                  style="width: 272px;"
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
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .inner-content-report-list{
        padding: 0 0 0 14px;
        border-left: 1px solid var(--ant-border-color);
      }
      .drag-handle {
        cursor: move;
        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
      }
      .sider-menu {
        height: 91.7%;
        background: #fff;
      }
      
      .menu-dropdown {
        position: absolute;
        right: 10px;

        i[nz-icon] {
          font-size: 18px !important;
        }
      }

      .menu-custom-report-group {
        background: #fff;
        gap: 6px;
        display: grid;

        > ul {
          height: 44px;
           li {
            margin: 0;
          }
        }

        > ul:last-of-type {
          margin-bottom: 4px;
        }
      }
    `,
  ],
})
export class ReportGroupListComponent extends BaseListComponent<Report> {
  constructor(
    override service: ReportGroupService,
    uiService: ReportGroupUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    super(service, uiService, sessionStorageService, "report_group_list");
  }
  readonly reportGroupSelectedKey = "report-group-selected-key";

  isReportGroupAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT_GROUP__ADD));
  isReportGroupEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT_GROUP__EDIT));
  isReportGroupRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT_GROUP__REMOVE));
  reportGroupId = signal<number>(parseInt(this.sessionStorageService.getValue(this.reportGroupSelectedKey) ?? 0) ?? 0);
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);

  changeGroupId(id: number) {
    this.sessionStorageService.setValue({
      key: this.reportGroupSelectedKey,
      value: id,
    });
    this.reportGroupId.set(id);
  }

  override search() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      let filters: any[] = [{
        field: "search",
        operator: "contains",
        value: this.searchText(),
      }];
      this.param().filters = JSON.stringify(filters);
      this.service.search(this.param()).subscribe({
        next: (result: { results: Block[]; param: QueryParam }) => {
          this.isLoading.set(true);
          this.lists.set(result.results);
          if (!this.reportGroupId() && result.results.length > 0) {
            this.changeGroupId(result.results[0].id!);
          }
          this.param().rowCount = result.param.rowCount;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }, 50);
  }
}
