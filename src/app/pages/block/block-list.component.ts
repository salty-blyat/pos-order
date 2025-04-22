import { Component, OnDestroy } from '@angular/core';
import {Observable, timer} from 'rxjs';
import { BaseListComponent } from '../../utils/components/base-list.component';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import {ActivatedRoute} from "@angular/router";
import {BlockUiService} from "./block-ui.service";
import {Block, BlockService} from "./block.service";
import {QueryParam} from "../../utils/services/base-api.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {NotificationService} from "../../utils/services/notification.service";

@Component({
    selector: 'app-block-list',
    template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData"
        [data]="breadcrumbData"
      ></app-breadcrumb>
      <nz-content style="display: flex">
          <div style="border-right: 1px solid var(--ant-border-color);padding:14px 14px 0 0">
              <nz-sider  nzWidth="250px" nzTheme="light">
                  <div class="filter-box" style="width: 250px">
                      <app-filter-input
                              storageKey="block-list-search"
                              (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
                      ></app-filter-input>
                  </div>
                  <ul nz-menu nzMode="inline" class="sider-menu" cdkDropList  style="margin-top: 10px"  
                      (cdkDropListDropped)="drop($event)"
                      [cdkDropListData]="lists">
                      <ul *ngFor="let data of lists; let i = index" cdkDrag class="block-ordering" cdkDragLockAxis="y">
                <span nz-icon nzType="holder" nzTheme="outline" class="block-move" cdkDragHandle></span>
                          <li nz-menu-item style="padding-left: 36px;height: 30px" (click)="changeBlockId(data.id!)" 
                              [nzSelected]="blockId === data.id!">
                              {{ data.name }}
                          </li>
                          <a [nzDropdownMenu]="menu" class="action-button menu-dropdown" nz-dropdown nzTrigger="click" nzPlacement="bottomRight">
                              <i nz-icon nzType="ellipsis" nzTheme="outline" style="font-size: 22px"></i>
                          </a>
                          <nz-dropdown-menu #menu="nzDropdownMenu">
                              <ul nz-menu >
                                  <li class="menu-item" nz-menu-item (click)="uiService.showEdit(data.id!)">
                              <span>
                                <i nz-icon nzType="edit"></i>&nbsp;
                                <span class="action-text">{{ 'Edit' | translate }}</span>
                              </span>
                                  </li>
                                  <li class="menu-item" nz-menu-item (click)="uiService.showDelete(data.id!)"   style="color: var(--danger-color);">
                              <span>
                                <i nz-icon nzType="delete"></i>&nbsp;
                                <span class="action-text">
                                  {{ 'Delete' | translate }}</span
                                >
                              </span>
                                  </li>
                              </ul>
                          </nz-dropdown-menu>
                      </ul>
                      <div *ngIf="!draged">
                          <button nz-button nzType="dashed" nzBlock (click)="uiService.showAdd()" >
                              <i nz-icon nzType="plus" nzTheme="outline"></i>
                              {{ 'Add' | translate }}
                          </button>
                      </div>
                      <div *ngIf="draged">
                          <button nz-button nzType="dashed" nzBlock (click)="saveOrdering()"
                                  [nzLoading]="loading">
                              {{ 'Save' | translate }}
                          </button>
                         
                      </div>
                  </ul>
              </nz-sider>
          </div>
          <div style="padding-left: 10px;"><app-floor-list [blockId] = "this.blockId"></app-floor-list></div>
          
      </nz-content>
    </nz-layout>
  `,
    styleUrls: ['../../../assets/scss/content_style.scss'],
    styles: [` .menu-dropdown {
      position: absolute;
      right: 10px;
      margin-bottom: 4px;
    }
    ::ng-deep .cdk-drag-preview {
      display: flex;
      background: rgba(0, 0, 0, 0.1);
      gap: 1em;

      align-items: center;
      padding: 0 4px;
    }

    ::ng-deep .cdk-drag-placeholder {
      opacity: 0;
    }
    .block-ordering {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      margin:0;
    }
    .block-move {
      position: absolute;
      z-index: 1000;
      width: 35px;
      cursor: move;
      padding: 7px;
      margin-bottom: 5px;
    }`],
    standalone: false
})
export class BlockListComponent
    extends BaseListComponent<Block>
    implements OnDestroy
{
    constructor(
       override service: BlockService,
        sessionStorageService: SessionStorageService,
        public uiService: BlockUiService,
        private activated: ActivatedRoute,
        private notificationService: NotificationService
    ) {
        super(service, sessionStorageService, 'block-list');
    }
    breadcrumbData!: Observable<any>;
    blockId: number = 0;
    draged:boolean = false;

    override ngOnInit() {
        this.breadcrumbData = this.activated.data;
        this.refreshSub = this.uiService.refresher.subscribe((result) => {
            this.search();
        });
        super.ngOnInit();

    }
    override search(): void {
        if (this.loading) {
            return;
        }
        this.loading = true;
        setTimeout(() => {
            const filters: any[] = [
                { field: 'name', operator: 'contains', value: this.searchText },
            ];
            this.param.filters = JSON.stringify(filters);
            this.service.search(this.param).subscribe({
                next: (result: { results: Block[]; param: QueryParam }) => {
                    this.loading = false;
                    this.lists = result.results;
                    timer(100).subscribe(() => {
                        this.blockId = this.lists[0].id!;
                    });
                    this.param.rowCount = result.param.rowCount;
                },
                error: (error: any) => {
                    console.log(error);
                },
            });
        }, 50);
    }

    changeBlockId(id: number) {
        this.blockId = id;
    }
    saveOrdering() {
        this.loading = true;
        let newLists: Block[] = [];

        this.lists.forEach((item, i) => {
            item.ordering = i + 1;
            newLists.push(item);
        });
        this.service.updateOrdering(newLists).subscribe(() => {
            this.loading = false;
            this.draged = false;
            this.notificationService.successNotification('Successfully Saved');
        });
    }
    drop(event: CdkDragDrop<Block[], any, any>): void {
        moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
        if (event.previousIndex !== event.currentIndex) this.draged = true;
    }
    
}
