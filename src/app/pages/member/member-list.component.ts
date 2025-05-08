import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { Member, MemberAdvancedFilter, MemberService } from "./member.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { MemberUiService } from "./member-ui.service";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { TranslateService } from "@ngx-translate/core";
import { Filter } from "../../utils/services/base-api.service";
import {
  SETTING_KEY,
  SystemSetting,
  SystemSettingService,
} from "../system-setting/system-setting.service";
import { AuthService } from "../../helpers/auth.service";

@Component({
  selector: "app-member-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col nzSpan="5">
            <app-filter-input
              storageKey="member-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div nz-col nzSpan="5">
            <app-member-level-select
              [showAllOption]="true"
              storageKey="member-list-member-level-filter"
              (valueChanged)="
                memberLevelId.set($event); param().pageIndex = 1; search()
              "
            ></app-member-level-select>
          </div>
          <div nz-col nzSpan="5">
            <app-member-unit-select
              [showAllOption]="true"
              storageKey="member-list-unit-filter"
              (valueChanged)="
                memberUnitId.set($event); param().pageIndex = 1; search()
              "
            ></app-member-unit-select>
          </div>
          <div>
            <nz-badge [nzDot]="hasAdvancedFilter()">
              <button
                nz-button
                nzType="default"
                (click)="uiService.showAdvancedFilter(advancedStoreKey)"
              >
                <a nz-icon nzType="align-right" nzTheme="outline"></a>
              </button>
            </nz-badge>
          </div>
        </div>
        <div style="margin-left:auto" nz-flex nzGap="4px" nzAlign="center">
          <button
            *ngIf="pavrEnable()"
            nz-button
            nzType="primary"
            (click)="uiService.showPull()"
          >
            <i nz-icon nzType="arrow-down" nzTheme="outline"></i>
            {{ "Pull" | translate }}
          </button>
          <button
            *ngIf="isMemberAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd(memberUnitId(), memberLevelId())"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            {{ "Add" | translate }}
          </button>
        </div>
      </nz-header>
      <nz-content>
        <nz-table
          class="table-list"
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
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.CODE">
                {{ "Code" | translate }}
              </th>
              <th nzEllipsis nzWidth="140px">{{ "Name" | translate }}</th>
              <th nzEllipsis nzWidth="100px">{{ "Phone" | translate }}</th>
              <th nzEllipsis nzWidth="70px">{{ "Sex" | translate }}</th>
              <th nzEllipsis nzWidth="130px">
                {{ "MemberLevel" | translate }}
              </th>
              <th nzEllipsis nzWidth="130px">
                {{ "MemberGroup" | translate }}
              </th>
              <th nzEllipsis>{{ "MemberUnit" | translate }}</th>
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
              <td nzEllipsis>
                @if (isMemberView()){
                <a (click)="uiService.showView(data.id!)">{{ data.code }}</a>
                } @else {
                <span>{{ data.code }}</span>
                }
              </td>
              <td nzEllipsis title="{{ data.name }}">
                {{ data.name }} {{ data.nameEn }}
              </td>
              <td nzEllipsis title="{{ data.phone }}">{{ data.phone }}</td>
              <td
                nzEllipsis
                title="{{
                  translate.currentLang == 'km'
                    ? data.sexName || data.sexNameEn
                    : data.sexNameEn || data.sexName
                }}"
              >
                {{
                  translate.currentLang == "km"
                    ? data.sexName || data.sexNameEn
                    : data.sexNameEn || data.sexName
                }}
              </td>
              <td nzEllipsis title="{{ data.memberLevelName }}">
                {{ data.memberLevelName }}
              </td>
              <td nzEllipsis title="{{ data.memberGroupName }}">
                {{ data.memberGroupName }}
              </td>
              <td nzEllipsis title="{{ data.memberUnitName }}">
                {{ data.memberUnitName }}
              </td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isMemberEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isMemberRemove()">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
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
export class MemberListComponent extends BaseListComponent<Member> {
  constructor(
    service: MemberService,
    override uiService: MemberUiService,
    sessionStorageService: SessionStorageService,
    protected translate: TranslateService,
    private authService: AuthService,
    private systemSettingService: SystemSettingService
  ) {
    super(service, uiService, sessionStorageService, "member-list");
  }
  readonly advancedStoreKey = "member-list-advanced-filter";
  memberUnitId = signal<number>(0);
  memberLevelId = signal<number>(0);
  hasAdvancedFilter = signal<boolean>(false);
  sexId = signal<number>(0);
  memberGroupId = signal<number>(0);
  nationalityId = signal<number>(0);
  pavrEnable = signal<boolean>(false);

  isMemberAdd = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ADD)
  );
  isMemberEdit = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__EDIT)
  );
  isMemberRemove = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__REMOVE)
  );
  isMemberView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__VIEW)
  );

  setAdvancedFilter(advancedFilter: MemberAdvancedFilter) {
    this.sexId.set(advancedFilter.sexId);
    this.memberGroupId.set(advancedFilter.memberGroupId);
    this.nationalityId.set(advancedFilter.nationalityId);
  }

  override search() {
    let filters: Filter[] = [];
    if (this.memberUnitId()) {
      filters.push({
        field: "memberUnitId",
        operator: "eq",
        value: this.memberUnitId(),
      });
    }
    if (this.memberLevelId()) {
      filters.push({
        field: "memberLevelId",
        operator: "eq",
        value: this.memberLevelId(),
      });
    }
    if (this.memberGroupId()) {
      filters.push({
        field: "memberGroupId",
        operator: "eq",
        value: this.memberGroupId(),
      });
    }
    if (this.nationalityId()) {
      filters.push({
        field: "nationalityId",
        operator: "eq",
        value: this.nationalityId(),
      });
    }
    if (this.sexId()) {
      filters.push({
        field: "sexId",
        operator: "eq",
        value: this.sexId(),
      });
    }
    super.search(filters, 100);
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
