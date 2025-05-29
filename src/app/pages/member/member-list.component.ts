import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { Member, MemberService } from "./member.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { MemberUiService } from "./member-ui.service";
import { SIZE_COLUMNS } from "../../const";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../helpers/auth.service";
import { MemberClass } from "../member-class/member-class.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-member-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col nzSpan="5">
            <app-filter-input
              class="fixed-width-select"
              storageKey="member-list"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div nz-col nzSpan="5">
            <app-member-class-select
              class="fixed-width-select"
              storageKey="member-class-list-search"
              (valueChanged)="
                memberClassId.set($event); param().pageIndex = 1; search()
              "
              [showAllOption]="true"
            >
            </app-member-class-select>
          </div>
          <div nz-col nzSpan="5">
            <app-agent-select
              storageKey="agent-list-search"
              class="fixed-width-select"
              [showAllOption]="true"
              (valueChanged)="
                agentId.set($event); param().pageIndex = 1; search()
              "
            >
            </app-agent-select>
          </div>
        </div>
        <div style="margin-left:auto" nz-flex nzAlign="center">
          <button
            *ngIf="isMemberAdd()"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd(memberClassId(), agentId())"
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
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NAME">
                {{ "Name" | translate }}
              </th>
              <th nzEllipsis [nzWidth]="SIZE_COLUMNS.PHONE">
                {{ "Phone" | translate }}
              </th>
              <th nzEllipsis nzWidth="200px">
                {{ "MemberClass" | translate }}
              </th>
              <th nzEllipsis nzWidth="150px">
                {{ "Agent" | translate }}
              </th>
              <th nzEllipsis nzWidth="150px">
                {{ "Address" | translate }}
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
              <td nzEllipsis>
                @if (isMemberView()){
                <a (click)="uiService.showView(data.id!)">{{ data.code }}</a>
                } @else {
                <span>{{ data.code }}</span>
                }
              </td>
              <td nzEllipsis>{{ data.name }}</td>
              <td nzEllipsis>{{ data.phone }}</td>
              <td nzEllipsis>{{ data.memberClassName }}</td>
              <td nzEllipsis>{{ data.agentName }}</td>
              <td nzEllipsis>{{ data.address }}</td> 
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
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "member-list",
      notificationService
    );
  }
  readonly agentIdKey = "agent-list-search";
  readonly memberClassIdKey = "member-class-list-search";
  agentId = signal(
    parseInt(this.sessionStorageService.getValue(this.agentIdKey) ?? 0)
  );
  memberClassId = signal(
    parseInt(this.sessionStorageService.getValue(this.memberClassIdKey) ?? 0)
  );

  isMemberAdd = computed(() => true);
  isMemberEdit = computed(() => true);
  isMemberRemove = computed(() => true);
  isMemberView = computed(() => true);

  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [];
    if (this.agentId()) {
      filters.push({
        field: "agentId",
        operator: "eq",
        value: this.agentId(),
      });
    }

    if (this.memberClassId()) {
      filters.push({
        field: "memberClassId",
        operator: "eq",
        value: this.memberClassId(),
      });
    }

    return filters;
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
