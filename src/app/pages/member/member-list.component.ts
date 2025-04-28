import {Component, ViewEncapsulation} from "@angular/core";
import { Member, MemberService } from "./member.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { MemberUiService } from "./member-ui.service";
import {SIZE_COLUMNS} from "../../const";

@Component({
  selector: "app-member-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="member-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
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
          nzHideOnSinglePage="true"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th [nzWidth]="SIZE_COLUMNS.CODE">
                {{ "Code" | translate }}
              </th>
              <th>{{ "Name" | translate }}</th>
              <th>{{ "Sex" | translate }}</th>
              <th>{{ "Unit" | translate }}</th>
              <th>{{ "Level" | translate }}</th>
              <th>{{ "Phone" | translate }}</th>
              <th>{{ "Nationality" | translate }}</th>
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
                <a (click)="uiService.showView(data.id!)">{{ data.code }}</a>
              </td>
              <td nzEllipsis title="{{ data.name }}">
                {{ data.name }}
              </td>
              <td nzEllipsis title="{{ data.sex }}">{{ data.sex }}</td>
              <td nzEllipsis title="{{ data.unit }}">{{ data.unit }}</td>
              <td nzEllipsis title="{{ data.level }}">{{ data.level }}</td>
              <td nzEllipsis title="{{ data.phone }}">{{ data.phone }}</td>
              <td nzEllipsis title="{{ data.nationality }}">
                {{ data.nationality }}
              </td>
              <td>
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
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      nz-typography
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
export class MemberListComponent extends BaseListComponent<Member> {
  constructor(
    service: MemberService,
    uiService: MemberUiService,
    sessionStorageService: SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService, "member-list");
  }
  isMemberAdd: boolean = true;
  isMemberEdit: boolean = true;
  isMemberRemove: boolean = true;
  isMemberView: boolean = true;
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
