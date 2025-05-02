import {Component, input, signal, ViewEncapsulation} from "@angular/core";
import {BaseListComponent} from "../../utils/components/base-list.component";
import {SIZE_COLUMNS} from "../../const";
import {RoomInventory, RoomInventoryService} from "./room-inventory.service";
import {RoomInventoryUiService} from "./room-inventory-ui.service";
import {SessionStorageService} from "../../utils/services/sessionStorage.service";

@Component({
  selector: 'app-room-inventory-list',
  template: `
      <nz-layout>
          <nz-header>
              <div nz-row>
                  <div nz-col>
                      <app-item-select
                              [showAllOption]="true"
                              storageKey="room-inventory-list-search"
                              (valueChanged)="itemId.set($event); param().pageIndex = 1; search()"
                      ></app-item-select>
                  </div>
              </div>
              <div style="margin-left:auto">
                  <button
                          nz-button
                          nzType="primary"
                          (click)="uiService.showAddMulti(roomId())"
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
                      <th nzEllipsis [nzWidth]="SIZE_COLUMNS.ID">#</th>
                      <th nzEllipsis>{{ "ItemName" | translate }}</th>
                      <th nzEllipsis nzWidth="150px" nzAlign="center">{{ "Qty" | translate }}</th>
                      <th nzEllipsis [nzWidth]="SIZE_COLUMNS.ACTION"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr *ngFor="let data of lists(); let i = index">
                      <td nzEllipsis>
                          {{ i | rowNumber: {index: param().pageIndex || 0, size: param().pageSize || 0} }}
                      </td>
                      <td nzEllipsis>{{ data.itemName }}</td>
                      <td nzEllipsis nzAlign="center">{{ data.qty }}</td>
                      <td class="col-action">
                          <nz-space [nzSplit]="spaceSplit">
                              <ng-template #spaceSplit>
                                  <nz-divider nzType="vertical"></nz-divider>
                              </ng-template>
                              <ng-container >
                                  <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                                      <i
                                              nz-icon
                                              nzType="edit"
                                              nzTheme="outline"
                                      ></i>
                                      {{ "Edit" | translate }}
                                  </a>
                              </ng-container>
                              <ng-container >
                                  <a *nzSpaceItem (click)="uiService.showDelete(data.id || 0)" class="delete">
                                      <i
                                              nz-icon
                                              nzType="delete"
                                              nzTheme="outline"
                                              class="delete"
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
      </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class RoomInventoryListComponent extends BaseListComponent<RoomInventory>{
  constructor(
    service: RoomInventoryService,
    override uiService: RoomInventoryUiService,
    sessionStorageService: SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService, "room-inventory-list" );
  }

  itemId = signal<number>(0);
  roomId = input<number>(0);

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}