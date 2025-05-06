import {Component, ViewEncapsulation} from "@angular/core";
import {SIZE_COLUMNS} from "../../../const";
import {BaseListComponent} from "../../../utils/components/base-list.component";
import {BillingCycle, BillingCycleService} from "./billing-cycle.service";
import {BillingCycleUiService} from "./billing-cycle-ui.service";
import {SessionStorageService} from "../../../utils/services/sessionStorage.service";

@Component({
  selector: 'app-billing-cycle-list',
  template: `
      <nz-layout>
          <nz-header class="header-top">
              <div nz-row>
                  <div nz-col>
                      <app-filter-input></app-filter-input>
                  </div>
              </div>
              <div nz-row>
                  <button nz-button nzType="primary" (click)="uiService.showAdd()">
                      <i nz-icon nzType="plus"></i>
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
                      <th nzEllipsis nzWidth="190px">{{ "Date" | translate }}</th>
                      <th nzEllipsis nzWidth="190px">{{ "Name" | translate }}</th>
                      <th nzEllipsis nzWidth="90px" nzAlign="center">{{ "TotalDay" | translate }}</th>
                      <th nzEllipsis nzWidth="90px" nzAlign="center">{{ "TotalRoom" | translate }}</th>
                      <th nzEllipsis>{{ "Note" | translate }}</th>
                      <th nzEllipsis [nzWidth]="SIZE_COLUMNS.ACTION"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr *ngFor="let data of lists(); let i = index">
                      <td nzEllipsis>
                          {{ i | rowNumber : { index: param().pageIndex || 0, size: param().pageSize || 0} }}
                      </td>
                      <td nzEllipsis>
                          <a (click)="uiService.showView(data.id!)">
                              {{ data.startDate | customDate }} ~ {{ data.endDate | customDate }}
                          </a>
                      </td>
                      <td nzEllipsis>
                          {{ data.name }}
                      </td>
                      <td nzEllipsis nzAlign="center">
                          {{ data.totalDay }}
                      </td>
                      <td nzEllipsis nzAlign="center">
                        {{ data.totalRoom }}
                      </td>
                      <td nzEllipsis>{{ data.note }}</td>
                      <td class="col-action" style="flex: 1">
                          <nz-space [nzSplit]="spaceSplit">
                              <ng-template #spaceSplit>
                                  <nz-divider nzType="vertical"></nz-divider>
                              </ng-template>
                              <ng-container>
                                  <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                                      {{ "Edit" | translate }}
                                  </a>
                              </ng-container>
                              <ng-container>
                                  <a *nzSpaceItem
                                     (click)="uiService.showDelete(data.id || 0)"
                                     class="delete">
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
  styleUrls: ['../../../../assets/scss/list.style.scss'],
  styles: [`
    .header-top{
      align-items: flex-start;
      line-height: unset !important;
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class BillingCycleListComponent extends BaseListComponent<BillingCycle>{

  constructor(
    service: BillingCycleService,
    uiService: BillingCycleUiService,
    sessionStorageService:  SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService, "billing-cycle-list");
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}