import { Component, OnDestroy } from '@angular/core';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AutoNumber, AutoNumberService } from './auto-number.service';
import { AutoNumberUiService } from './auto-number-ui.service';
import { BaseListComponent } from '../../utils/components/base-list.component';
@Component({
    selector: 'app-auto-number-list',
    template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData"
        [data]="breadcrumbData"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div>
            <app-filter-input
              storageKey="auto-number-list-search"
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            >
            </app-filter-input>
          </div>
        </div>
        <div>
          <button
            *ngIf="isAutoNumberAdd"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i
            >{{ 'Add' | translate }}
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
              <th width="15%">{{ 'Name' | translate }}</th>
              <th>{{ 'Format' | translate }}</th>
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
                  *ngIf="isAutoNumberView"
                  (click)="uiService.showView(data.id || 0)"
                  >{{ data.name }}</a
                >
                <span *ngIf="!isAutoNumberView">{{ data.name }}</span>
              </td>
              <td nzEllipsis>{{ data.format }}</td>
              <td nzEllipsis>{{ data.note }}</td>
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isAutoNumberEdit">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showEdit(data.id || 0)"
                    >
                      <i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        style="padding-right: 5px"
                      ></i>
                      {{ 'Edit' | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isAutoNumberRemove">
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
    standalone: false
})
export class AutoNumberListComponent
  extends BaseListComponent<AutoNumber>
  implements OnDestroy
{
  constructor(
    service: AutoNumberService,
    sessionStorageService: SessionStorageService,
    public uiService: AutoNumberUiService,
    private activated: ActivatedRoute,
  
  ) {
    super(service, sessionStorageService, 'auto-number-list');
  }
  breadcrumbData!: Observable<any>;
  isAutoNumberAdd: boolean = true;
  isAutoNumberEdit: boolean = true;
  isAutoNumberRemove: boolean = true;
  isAutoNumberView: boolean = true;
  override ngOnInit() {

    this.breadcrumbData = this.activated.data;
    this.refreshSub = this.uiService.refresher.subscribe((result) => {
      this.search();
    });
    super.ngOnInit();
  }
  ngOnDestroy(): void {
    this.refreshSub.unsubscribe();
  }
}
