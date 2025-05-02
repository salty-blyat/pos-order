import { Component, computed, input, OnChanges, SimpleChanges } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Floor, FloorService } from "./floor.service";
import { FloorUiService } from "./floor-ui.service";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { AuthService } from "../../helpers/auth.service";

@Component({
  selector: "app-floor-list",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col>
            <app-filter-input
              storageKey="floor-list-search"
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
            nz-button
            nzType="primary" *ngIf="isFloorAdd()"
            (click)="uiService.showAdd(this.blockId())"
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
              <th [nzWidth]="SIZE_COLUMNS.DRAG"></th>
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th>{{ "Note" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList
            cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr *ngFor="let data of lists(); let i = index" cdkDrag>
              <td
                style="align-content: center;text-align: center; cursor: move;"
                cdkDragHandle
              >
                <span nz-icon nzType="holder" nzTheme="outline"></span>
              </td>
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
              <td nzEllipsis style="flex:2"> 
                <span *ngIf="!isFloorAdd()" >{{ data.name }}</span>
                <a  *ngIf="isFloorAdd()" (click)="uiService.showView(data.id!)">{{ data.name }}</a>
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              <td class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isFloorEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)"
                      ><i
                        nz-icon
                        nzType="edit"
                        nzTheme="outline"
                        class="pr-sm"
                      ></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isFloorRemove()">
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
export class FloorListComponent
  extends BaseListComponent<Floor>
  implements OnChanges {
  constructor(
    override service: FloorService,
    uiService: FloorUiService,
    sessionStorageService: SessionStorageService,
    private authService: AuthService,
  ) {
    super(service, uiService, sessionStorageService, "floor-list");
  }

  blockId = input<number>(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["blockId"]) {
      this.search(changes["blockId"]?.currentValue);
    }
  }

  isFloorAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__FLOOR__ADD));
  isFloorView = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__FLOOR__VIEW));
  isFloorRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__FLOOR__REMOVE));
  isFloorEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__FLOOR__EDIT));

  override search(blockId?: any): void {
    if (blockId) {
      let filters = [
        {
          field: "blockId",
          operator: "eq",
          value: blockId,
        },
      ];
      super.search(filters);
    }
  }

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
