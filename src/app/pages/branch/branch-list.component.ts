import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Branch, BranchService } from './branch.service';
import { BranchUiService } from './branch-ui.service';
import { AuthService } from '../../helpers/auth.service';
import { BaseListComponent } from '../../utils/components/base-list.component';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';

@Component({
    selector: 'app-branch-list',
    template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData"
        [data]="breadcrumbData"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div class="filter-box">
            <app-filter-input
              storageKey="branch-list-search"
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
        </div>
        <div>
          <button
            *ngIf="isBranchAdd"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            {{ 'Add' | translate }}
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
              <th class="col-code">
                {{ 'Code' | translate }}
              </th>
              <th nzWidth="20%">{{ 'Name' | translate }}</th>
              <th class="col-phone">
                {{ 'Phone' | translate }}
              </th>
              <th>{{ 'Address' | translate }}</th>
              <th>{{ 'Note' | translate }}</th>
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
                <a
                  *ngIf="isBranchView"
                  (click)="uiService.showView(data.id!)"
                  >{{ data.code }}</a
                >
                <span *ngIf="!isBranchView">{{ data.code }}</span>
              </td>
              <td nzEllipsis>{{ data.name }}</td>
              <td nzEllipsis>{{ data.phone }}</td>
              <td nzEllipsis>{{ data.address }}</td>
              <td nzEllipsis>{{ data.note }}</td>
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isBranchEdit">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showEdit(data.id || 0)"
                    
                    >
                      <i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        class="pr-sm"
                      ></i>
                      {{ 'Edit' | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isBranchRemove">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      nz-typography
                      style="color: #F31313"
                    >
                      <i
                        nz-icon
                        nzType="delete"
                        nzTheme="outline"
                        class="pr-sm"
                      ></i>
                      {{ 'Delete' | translate }}
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
    styleUrls: ['../../../assets/scss/content_style.scss'],
    styles: ['button{margin-left: 20px;}'],
    standalone: false
})
export class BranchListComponent
  extends BaseListComponent<Branch>
  implements OnDestroy
{
  constructor(
    service: BranchService,
    sessionStorageService: SessionStorageService,
    public uiService: BranchUiService,
    private activated: ActivatedRoute,
    private authService: AuthService
  ) {
    super(service, sessionStorageService, 'branch-list');
  }
  breadcrumbData!: Observable<any>;
  isBranchAdd: boolean = true;
  isBranchEdit: boolean = true;
  isBranchRemove: boolean = true;
  isBranchView: boolean = true;

  override ngOnInit() {
    this.breadcrumbData = this.activated.data;
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      this.search();
    });
    super.ngOnInit();
  }
  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}
