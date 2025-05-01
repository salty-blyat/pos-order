import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { SIZE_COLUMNS } from "../../const";
import { Observable } from "rxjs";
import { MemberUnit, MemberUnitService } from "./member-unit.service";
import { MemberUnitUiService } from "./member-unit-ui.service";
import {
  SETTING_KEY,
  SystemSetting,
  SystemSettingService,
} from "../system-setting/system-setting.service";

@Component({
  selector: "app-member-unit-list",
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
              storageKey="member-unit-list-search"
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
        <div nz-flex nzGap="4px" nzAlign="center">
          <button
            *ngIf="pavrEnable"
            nz-button
            nzType="primary"
            (click)="uiService.showPull()"
          >
            <i nz-icon nzType="arrow-down" nzTheme="outline"></i>
            {{ "Pull" | translate }}
          </button>
          <button
            *ngIf="isMemberUnitAdd"
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
              <th [nzWidth]="SIZE_COLUMNS.CODE">{{ "Code" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
              <th class="col-action" [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList
            cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr *ngFor="let data of lists(); let i = index" cdkDrag>
              <td style=" cursor: move;" cdkDragHandle>
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
              <td nzEllipsis title="{{ data.code }}">
                <a (click)="uiService.showView(data.id!)">{{ data.code }}</a>
              </td>
              <td nzEllipsis title="{{ data.name }}">
                 {{ data.name }} 
              </td>
              <td nzEllipsis title="{{ data.note }}">
                {{ data.note }}
              </td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isMemberUnitEdit">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isMemberUnitRemove">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      nz-typography
                      class="delete"
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
export class MemberUnitListComponent extends BaseListComponent<MemberUnit> {
  constructor(
    service: MemberUnitService,
    public override uiService: MemberUnitUiService,
    sessionStorageService: SessionStorageService,
    public systemSettingService: SystemSettingService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "member-unit-list");
  }

  pavrEnable = signal<boolean>(false);
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isMemberUnitAdd: boolean = true;
  isMemberUnitEdit: boolean = true;
  isMemberUnitRemove: boolean = true;
  isMemberUnitView: boolean = true;

  readonly SIZE_COLUMNS = SIZE_COLUMNS;

  override ngOnInit(): void {
    super.ngOnInit();
    this.systemSettingService.find(SETTING_KEY.PavrEnable).subscribe({
      next: (result: SystemSetting) => {
        this.pavrEnable.set(Boolean(result.value));
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }
}
