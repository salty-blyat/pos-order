import { Component, input, OnInit } from "@angular/core";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BuildingService } from "./building.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { BuildingUiService } from "./building-ui.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { Building } from "./building.service";

@Component({
  selector: "app-building-list",
  template: ` <nz-layout>
    <app-breadcrumb
      *ngIf="breadcrumbData"
      [data]="breadcrumbData"
    ></app-breadcrumb>
    <nz-header>
      <div nz-row>
        <div class="filter-box">
          <app-filter-input
            storageKey="building-list-search"
            (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
          >
          </app-filter-input>
        </div>
      </div>
      <div>
        <button
          *ngIf="isBuildingAdd"
          nz-button
          nzType="primary"
          (click)="uiService.showAdd()"
        >
          <i nz-icon nzType="plus" nzTheme="outline"></i>{{ "Add" | translate }}
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
        [nzData]="lists"
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
            <th class="col-header col-rowno">#</th>
            <th>{{ "Code" | translate }}</th>
            <th>{{ "BuildingName" | translate }}</th>
            <th>{{ "Note" | translate }}</th>
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
            <td nzEllipsis>
              {{ data.buildingName }}
            </td>
            <td nzEllipsis>{{ data.note }}</td>

            <td nzAlign="right">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <ng-container *ngIf="isBuildingEdit">
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
                <ng-container *ngIf="isBuildingRemove">
                  <a
                    *nzSpaceItem
                    nz-typography
                    style="color: #F31313"
                    (click)="uiService.showDelete(data.id || 0)"
                  >
                    <i
                      nz-icon
                      nzType="delete"
                      nzTheme="outline"
                      style="padding-right: 5px"
                    ></i>
                    {{ "Delete" | translate }}
                  </a>
                </ng-container>
              </nz-space>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </nz-content>
  </nz-layout>`,
  styleUrls: ["../../../assets/scss/content_style.scss"],
  standalone: false,
})
export class BuildingListComponent
  extends BaseListComponent<Building>
  implements OnInit
{
  constructor(
    service: BuildingService,
    sessionStorageService: SessionStorageService,
    public uiService: BuildingUiService,
    private activated: ActivatedRoute
  ) {
    super(service, sessionStorageService, "building-list");
  }
  breadcrumbData!: Observable<any>;
  override lists: Building[] = [
    {
      id: 1,
      code: "111",
      buildingName: "Building 1",
      note: "Note 1",
    },
    {
      id: 2,
      code: "222",
      buildingName: "Building 2",
      note: "Note 2",
    },
  ];
  isBuildingAdd: boolean = true;
  isBuildingEdit: boolean = true;
  isBuildingRemove: boolean = true;
  isBuildingView: boolean = true;

  override ngOnInit() {
    this.breadcrumbData = this.activated.data;
  }
}
