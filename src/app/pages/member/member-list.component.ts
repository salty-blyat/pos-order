import {Component, signal, ViewEncapsulation} from "@angular/core";
import {Member, MemberAdvancedFilter, MemberService} from "./member.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { MemberUiService } from "./member-ui.service";
import {SIZE_COLUMNS} from "../../const";
import {TranslateService} from "@ngx-translate/core";
import {Filter} from "../../utils/services/base-api.service";
import {RoomAdvancedFilter} from "../room/room.service";

@Component({
  selector: "app-member-list",
  template: `
      <nz-layout>
          <nz-header>
              <div nz-row>
                  <div nz-col>
                      <app-filter-input
                              storageKey="member-list-search"
                              (filterChanged)="searchText.set($event); param().pageIndex = 1; search()"
                      ></app-filter-input>
                  </div>
                  <div nz-col>
                      <app-member-level-select
                              [showAllOption]="true"
                              storageKey="member-list-member-level-filter"
                              (valueChanged)="unitId.set($event); param().pageIndex = 1; search()"
                      ></app-member-level-select>
                  </div>
                  <div nz-col>
                      <app-unit-select
                              [showAllOption]="true"
                              storageKey="member-list-unit-filter"
                              (valueChanged)="memberLevelId.set($event); param().pageIndex = 1; search()"
                      ></app-unit-select>
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
              <div>
                  <button *ngIf="isMemberAdd" nz-button nzType="primary" (click)="uiService.showAdd()">
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
                      (nzQueryParams)="onQueryParamsChange($event)"
              >
                  <ng-template #noResult>
                      <app-no-result-found></app-no-result-found>
                  </ng-template>
                  <thead>
                  <tr>
                      <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
                      <th [nzWidth]="SIZE_COLUMNS.CODE">{{ "Code" | translate }}</th>
                      <th nzWidth="140px">{{ "Name" | translate }}</th>
                      <th nzWidth="100px">{{ "Phone" | translate }}</th>
                      <th nzWidth="80px">{{ "Sex" | translate }}</th>
                      <th nzWidth="120px">{{ "Level" | translate }}</th>
                      <th nzWidth="120px">{{ "Group" | translate }}</th>
                      <th>{{ "Unit" | translate }}</th>
                      <th [nzWidth]="SIZE_COLUMNS.ACTION"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr *ngFor="let data of lists(); let i = index">
                      <td nzEllipsis>
                          {{ i | rowNumber : { index: param().pageIndex || 0, size: param().pageSize || 0} }}
                      </td>
                      <td nzEllipsis>
                          <a (click)="uiService.showView(data.id!)">{{ data.code }}</a>
                      </td>
                      <td nzEllipsis title="{{ data.name }}">
                          {{ data.name }} {{ data.nameEn }}
                      </td>
                      <td nzEllipsis title="{{ data.phone }}">{{ data.phone }}</td>
                      <td nzEllipsis title="{{ translate.currentLang == 'km' ? (data.sexName || data.sexNameEn) : (data.sexNameEn || data.sexName)}}">
                          {{  translate.currentLang == 'km' ? (data.sexName || data.sexNameEn) : (data.sexNameEn || data.sexName) }}
                      </td>
                      <td nzEllipsis title="{{ data.memberLevelName }}">{{ data.memberLevelName }}</td>
                      <td nzEllipsis title="{{ data.groupName }}">{{ data.groupName }}</td>
                      <td nzEllipsis title="{{ data.unitName }}">{{ data.unitName }}</td>
                      <td class="col-action">
                          <nz-space [nzSplit]="spaceSplit">
                              <ng-template #spaceSplit>
                                  <nz-divider nzType="vertical"></nz-divider>
                              </ng-template>
                              <ng-container *ngIf="isMemberEdit">
                                  <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                                      {{ "Edit" | translate }}
                                  </a>
                              </ng-container>
                              <ng-container *ngIf="isMemberRemove">
                                  <a *nzSpaceItem (click)="uiService.showDelete(data.id || 0)" class="delete">
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
  ) {
    super(service, uiService, sessionStorageService, "member-list");
  }
  readonly advancedStoreKey = "member-list-advanced-filter";
  unitId = signal<number>(0);
  memberLevelId = signal<number>(0);
  hasAdvancedFilter = signal<boolean>(false);
  sexId = signal<number>(0);
  groupId = signal<number>(0);
  nationalityId = signal<number>(0);

  isMemberAdd: boolean = true;
  isMemberEdit: boolean = true;
  isMemberRemove: boolean = true;
  isMemberView: boolean = true;

  override ngOnInit() {
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      if (result.key === "advanced-filter-member") {
        this.setAdvancedFilter(result.value);
      }
      this.getAdvancedFilter();
      this.search();
    });
    this.getAdvancedFilter();
    if (this.hasAdvancedFilter()) {
      this.setAdvancedFilter(
        this.sessionStorageService.getValue(this.advancedStoreKey)
      );
    }

    super.ngOnInit();
  }

  getAdvancedFilter() {
    const advancedFilter: RoomAdvancedFilter = this.sessionStorageService.getValue(this.advancedStoreKey);
    this.hasAdvancedFilter.set(advancedFilter?.isAdvancedFilter ?? false);
  }
  setAdvancedFilter(advancedFilter: MemberAdvancedFilter) {
    this.sexId.set(advancedFilter.sexId);
    this.groupId.set(advancedFilter.groupId);
    this.nationalityId.set(advancedFilter.nationalityId);
  }


  override search() {
    let filters: Filter[] = [];
    if (this.unitId()){
      filters.push({
        field: "unitId",
        operator: "eq",
        value: this.unitId()
      })
    }
    if (this.memberLevelId()){
      filters.push({
        field: "memberLevelId",
        operator: "eq",
        value: this.memberLevelId()
      })
    }
    if (this.groupId()){
      filters.push({
        field: "groupId",
        operator: "eq",
        value: this.groupId()
      })
    }
    if (this.nationalityId()){
      filters.push({
        field: "nationalityId",
        operator: "eq",
        value: this.nationalityId()
      })
    }
    if (this.sexId()){
      filters.push({
        field: "sexId",
        operator: "eq",
        value: this.sexId()
      })
    }
    super.search(filters, 100);
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
