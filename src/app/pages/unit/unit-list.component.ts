import { Component, computed, ViewEncapsulation } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { Observable } from "rxjs";
import { UnitService } from "./unit.service";
import { Unit } from "./unit.service";
import { UnitUiService } from "./unit-ui.service";
import { AuthService } from "../../helpers/auth.service";

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
                  <div nz-col>
                      <app-filter-input
                              storageKey="unit-list-search"
                              (filterChanged)="searchText.set($event); param().pageIndex = 1; search()"
                      ></app-filter-input>
                  </div>
                  <div *ngIf="draged()">
                      <button nz-button nzType="primary" (click)="saveOrdering()" [nzLoading]="isLoading()">
                          {{ "Save" | translate }}
                      </button>
                  </div>
              </div>
              <div>
                  <button
                          *ngIf="isUnitAdd()"
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
                      <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
                      <th [nzWidth]="SIZE_COLUMNS.NOTE">{{ "Note" | translate }}</th>
                      <th class="col-action" [nzWidth]="SIZE_COLUMNS.ACTION"></th>
                  </tr>
                  </thead>
                  <tbody
                          cdkDropList cdkDropListLockAxis="y"
                          (cdkDropListDropped)="drop($event)"
                          [cdkDropListData]="lists()"
                  >
                  <tr *ngFor="let data of lists(); let i = index" cdkDrag>
                      <td nzEllipsis style=" cursor: move;" cdkDragHandle>
                          <span nz-icon nzType="holder" nzTheme="outline"></span>
                      </td>
                      <td nzEllipsis>
                          {{ i | rowNumber: {index: param().pageIndex || 0, size: param().pageSize || 0} }}
                      </td>
                      <td nzEllipsis title="{{ data.name }}">
                         <a  *ngIf="isUnitView()" (click)="uiService.showView(data.id!)">{{ data.name }}</a> 
                         <span *ngIf="!isUnitView()">{{ data.name }}</span> 
                      </td>
                      <td nzEllipsis title="{{ data.note }}">
                          {{ data.note }}
                      </td>
                      <td class="col-action">
                          <nz-space [nzSplit]="spaceSplit">
                              <ng-template #spaceSplit>
                                  <nz-divider nzType="vertical"></nz-divider>
                              </ng-template>
                              <ng-container *ngIf="isUnitEdit()">
                                  <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                                      {{ "Edit" | translate }}
                                  </a>
                              </ng-container>
                              <ng-container *ngIf="isUnitRemove()">
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
export class UnitListComponent extends BaseListComponent<Unit> {
    constructor(
        service: UnitService,
        uiService: UnitUiService, 
        private authService: AuthService,
        sessionStorageService: SessionStorageService,
        private activated: ActivatedRoute
    ) {
        super(service, uiService, sessionStorageService, "unit-list");
    }
    breadcrumbData = computed<Observable<any>>(() => this.activated.data);
    isUnitAdd = computed<boolean>(()=> this.authService.isAuthorized(AuthKeys.APP__SETTING__UNIT__ADD));
    isUnitEdit = computed<boolean>(()=> this.authService.isAuthorized(AuthKeys.APP__SETTING__UNIT__EDIT));
    isUnitRemove = computed<boolean>(()=> this.authService.isAuthorized(AuthKeys.APP__SETTING__UNIT__REMOVE));
    isUnitView = computed<boolean>(()=> this.authService.isAuthorized(AuthKeys.APP__SETTING__UNIT__VIEW));
    readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
