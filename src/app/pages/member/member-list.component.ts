import { Component } from "@angular/core";
import { Member, MemberService } from "./member.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { MemberUiService } from "./member-ui.service";

@Component({
  selector: "app-member-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div style="width: 220px; margin-right: 4px;">
            <app-filter-input
              storageKey="member-list-search"
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
        </div>
        <div>
          <button
            *ngIf="isMemberAdd"
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
          [nzPageSizeOptions]="pageSizeOption"
          [nzData]="lists"
          [nzLoading]="loading"
          [nzTotal]="param.rowCount || 0"
          [nzPageSize]="param.pageSize || 0"
          [nzPageIndex]="param.pageIndex || 0"
          [nzNoResult]="noResult"
          nzHideOnSinglePage="true"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th class="col-header col-rowno">#</th>
              <th class="col-code-max" nzColumnKey="code">
                {{ "Code" | translate }}
              </th>
              <th>{{ "Name" | translate }}</th>
              <th>{{ "Gender" | translate }}</th>
              <th>{{ "Unit" | translate }}</th>
              <th>{{ "Level" | translate }}</th>
              <th>{{ "Phone" | translate }}</th>
              <th>{{ "Nationality" | translate }}</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists; let i = index">
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
              <td nzEllipsis>
                <a (click)="uiService.showView(data.id!)">{{ data.code }}</a>
              </td>
              <td nzEllipsis title="{{ data.name }}">
                {{ data.name }}
              </td>
              <td nzEllipsis title="{{ data.gender }}">{{ data.gender }}</td>
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
  styleUrls: ["../../../assets/scss/content_style.scss"],
  standalone: false,
})
export class MemberListComponent extends BaseListComponent<Member> {
  constructor(
    service: MemberService,
    sessionStorageService: SessionStorageService,
    public uiService: MemberUiService
  ) {
    super(service, sessionStorageService, "member-list");
  }
  isMemberAdd: boolean = true;
  isMemberEdit: boolean = true;
  isMemberRemove: boolean = true;
  isMemberView: boolean = true;

  override lists = [
    {
      id: 1,
      code: "123",
      name: "Sok Dara",
      genderId: 1,
      gender: "Male",
      unit: "HR Department",
      level: "Manager",
      phone: "012345678",
      nationality: "Cambodian",
    },
    {
      id: 2,
      code: "123",
      name: "Chanthy Mey",
      genderId: 1,
      gender: "Male",
      unit: "Finance",
      level: "Officer",
      phone: "098765432",
      nationality: "Cambodian",
    },
    {
      id: 3,
      code: "123",
      name: "Kim Lee",
      genderId: 1,
      gender: "Male",
      unit: "IT",
      level: "Developer",
      phone: "087654321",
      nationality: "Korean",
    },
  ];

  override loading = false;
}
