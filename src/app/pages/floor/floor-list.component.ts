import {Component, Input, OnChanges, OnDestroy, signal, SimpleChanges} from '@angular/core';
import { BaseListComponent } from '../../utils/components/base-list.component';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import {Floor, FloorService} from "./floor.service";
import {FloorUiService} from "./floor-ui.service";
import {Block} from "../block/block.service";
import {Filter, QueryParam} from "../../utils/services/base-api.service";
import {SIZE_COLUMNS} from "../../const";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {NotificationService} from "../../utils/services/notification.service";

@Component({
    selector: 'app-floor-list',
    template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div class="filter-box">
            <app-filter-input
              storageKey="floor-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
            <div *ngIf="draged" >
                <button style="margin-left: 5px"
                        nz-button
                        nzType="primary"
                        (click)="saveOrdering()"
                        [nzLoading]="isLoading()"
                >
                    {{ 'Save' | translate }}
                </button>
            </div>
        </div>
        <div>
          <button
            nz-button
            nzType="primary"
            (click)="uiService.showAdd(this.blockId!)"
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
              <th class="col-header col-rowno" [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ 'Name' | translate }}</th>
              <th>{{ 'Description' | translate }}</th>
              <th class="col-action" ></th>
            </tr>
          </thead>
          <tbody  cdkDropList
                  (cdkDropListDropped)="drop($event)"
                  [cdkDropListData]="lists()">
           <tr *ngFor="let data of lists(); let i = index" cdkDrag>
               <td style="align-content: center;text-align: center; cursor: move;" cdkDragHandle ><span nz-icon nzType="holder" nzTheme="outline" ></span></td>
               <td nzEllipsis>
                   {{i| rowNumber: {index: param().pageIndex || 0, size: param().pageSize || 0} }}
               </td>
               <td nzEllipsis style="flex:2px"><a (click)="uiService.showView(data.id!)" style="color: var( --primary-color)">{{ data.name }}</a></td>
               <td nzEllipsis style="flex:1px"> {{ data.description }}</td>
               <td >
                   <nz-space [nzSplit]="spaceSplit">
                       <ng-template #spaceSplit>
                           <nz-divider nzType="vertical"></nz-divider>
                       </ng-template>
                       <ng-container >
                           <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)"><i nz-icon nzType="edit" nzTheme="outline" class="pr-sm"></i>
                               {{ 'Edit' | translate }}
                           </a>
                       </ng-container>
                       <ng-container >
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
export class FloorListComponent
    extends BaseListComponent<Floor>
    implements OnDestroy,OnChanges
{
      constructor(
        override  service: FloorService,
        uiService: FloorUiService,
        sessionStorageService: SessionStorageService,
        private notificationService: NotificationService
    ) {
        super(service, uiService, sessionStorageService, 'floor-list');
    }
    @Input() blockId:number =0;
    draged = signal(false);
    override ngOnInit() {
        this.refreshSub = this.uiService.refresher.subscribe((result) => {
            this.search();
        });
        super.ngOnInit();
    }
    ngOnChanges(): void {
        this.search();
    }
    override search() {
        if(this.blockId){
            if (this.isLoading()) {
                return;
            }
            this.isLoading.set(true);
            setTimeout(() => {
                const filters: Filter[] = [];
                if (this.blockId) {
                    filters.push({
                        field: 'blockId',
                        operator: 'eq',
                        value: this.blockId,
                    });
                }
                super.search(filters);
            }, 50);
        }

    }
    saveOrdering() {
        this.isLoading.set(true);
        let newLists: Floor[] = [];

        this.lists().forEach((item, i) => {
            item.ordering = i + 1;
            newLists.push(item);
        });
        this.service.updateOrdering(newLists).subscribe(() => {
            this.isLoading.set(false);
            this.draged.set(false);
            this.notificationService.successNotification('Successfully Saved');
        });
    }
    drop(event: CdkDragDrop<Floor[], any, any>): void {
        moveItemInArray(this.lists(), event.previousIndex, event.currentIndex);
        if (event.previousIndex !== event.currentIndex) this.draged.set(true);
    }

    
    protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
