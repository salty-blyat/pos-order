import { Component, computed } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { UnitService, Unit } from "./unit.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { SIZE_COLUMNS } from "../../const";
import { Observable } from "rxjs";
import { UnitUiService } from "./unit-ui.service";

@Component({
  selector: "app-unit-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div style="width: 220px; margin-right: 4px;">
            <app-filter-input
              storageKey="member-list-search"
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
        <div>
          <button
            *ngIf="isMemberLevelAdd"
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
          nzHideOnSinglePage="true"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th nzColumnKey="drag" [nzWidth]="SIZE_COLUMNS.DRAG"></th>
              <th class="col-header col-rowno" [nzWidth]="SIZE_COLUMNS.ID">
                #
              </th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
              <th class="col-action" [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr *ngFor="let data of lists(); let i = index" cdkDrag>
              <td style=" cursor: move;" cdkDragHandle>
                <span nz-icon nzType="holder" nzTheme="outline"></span>
              </td>
              <td nzEllipsis style="flex: 1;">
                {{
                  i
                    | rowNumber
                      : {
                          index: param().pageIndex || 0,
                          size: param().pageSize || 0
                        }
                }}
              </td>
              <td nzEllipsis style="flex: 3;" title="{{ data.name }}">
                {{ data.name }}
              </td>
              <td nzEllipsis style="flex: 2;" title="{{ data.note }}">
                {{ data.note }}
              </td>
              <td nzAlign="right">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isMemberLevelEdit">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isMemberLevelRemove">
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
})
export class UnitListComponent extends BaseListComponent<Unit> {
  constructor(
    service: UnitService,
    uiService: UnitUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "unit-list");
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isMemberLevelAdd: boolean = true;
  isMemberLevelEdit: boolean = true;
  isMemberLevelRemove: boolean = true;
  isMemberLevelView: boolean = true;
  readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
