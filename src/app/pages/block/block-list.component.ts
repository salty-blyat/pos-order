import { Component, computed, signal } from "@angular/core";
import { Observable } from "rxjs";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { BlockUiService } from "./block-ui.service";
import { Block, BlockService } from "./block.service";
import { NotificationService } from "../../utils/services/notification.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";

@Component({
  selector: "app-block-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-content style="display: flex">
        <div
          style="border-right: 1px solid var(--ant-border-color);padding:14px 14px 0 0"
        >
          <nz-sider nzWidth="250px" nzTheme="light">
            <div class="filter-box" style="width: 250px">
              <app-filter-input
                storageKey="block-list-search"
                (filterChanged)="
                  searchText.set($event); param().pageIndex = 1; search()
                "
              ></app-filter-input>
            </div>
            <ul
              nz-menu
              nzMode="inline"
              class="menu-custom-block"
              cdkDropList
              style="margin-top: 10px"
              (cdkDropListDropped)="drop($event)"
              [cdkDropListData]="lists()"
            >
              <ul
                *ngFor="let data of lists(); let i = index"
                cdkDrag
                class="block-ordering"
                cdkDragLockAxis="y"
                nz-flex nzAlign="center"
              >
                <span
                  nz-icon
                  nzType="holder"
                  nzTheme="outline"
                  class="block-move"
                  cdkDragHandle
                ></span>
                <li
                  nz-menu-item
                  style="padding-left: 36px;height: 40px;margin: 0;"
                  (click)="changeBlockId(data.id!)"
                  [nzSelected]="blockId() === data.id!"
                >
                  {{ data.name }}
                </li>
                <a
                  [nzDropdownMenu]="menu"
                  class="action-button menu-dropdown"
                  nz-dropdown
                  nzTrigger="click"
                  nzPlacement="bottomRight"
                >
                  <i
                    nz-icon
                    nzType="ellipsis"
                    nzTheme="outline"
                    style="font-size: 22px"
                  ></i>
                </a>
                <nz-dropdown-menu #menu="nzDropdownMenu">
                  <ul nz-menu>
                    <li
                      class="menu-item edit"
                      nz-menu-item
                      (click)="uiService.showEdit(data.id!)"
                    >
                      <span>
                        <i nz-icon nzType="edit"></i>&nbsp;
                        <span class="action-text">{{
                          "Edit" | translate
                        }}</span>
                      </span>
                    </li>
                    <li
                      class="menu-item delete"
                      nz-menu-item
                      (click)="uiService.showDelete(data.id!)"
                    >
                      <span>
                        <i nz-icon nzType="delete"></i>&nbsp;
                        <span class="action-text">
                          {{ "Delete" | translate }}</span
                        >
                      </span>
                    </li>
                  </ul>
                </nz-dropdown-menu>
              </ul>
              <div *ngIf="!draged()">
                <button
                  nz-button
                  nzType="dashed"
                  nzBlock
                  (click)="uiService.showAdd()"
                >
                  <i nz-icon nzType="plus" nzTheme="outline"></i>
                  {{ "Add" | translate }}
                </button>
              </div>
              <div *ngIf="draged()">
                <button
                  nz-button
                  nzType="dashed"
                  nzBlock
                  (click)="saveOrdering()"
                  [nzLoading]="isLoading()"
                >
                  {{ "Save" | translate }}
                </button>
              </div>
            </ul>
          </nz-sider>
        </div>
        <div style="padding-left: 10px;">
          <app-floor-list *ngIf="blockId()" [blockId]="blockId()"></app-floor-list>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  styles: [`
    .block-move{
      position: absolute;
      left: 10px;
      font-size: 12px;
    }
    
    .menu-dropdown{
      position: absolute;
      right: 10px;
      i[nz-icon]{
        font-size: 18px !important;
      }
    }
    
    .menu-custom-block{
      background: #fff;
      gap: 6px;
      display: grid;
    }
  `]
})
export class BlockListComponent extends BaseListComponent<Block> {
  constructor(
    override service: BlockService,
    sessionStorageService: SessionStorageService,
    public override uiService: BlockUiService,
    private activated: ActivatedRoute,
    notificationService: NotificationService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "block-list",
      notificationService
    );
  }
  readonly blockSelectedKey = 'block-selected-key';
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  blockId = signal(parseInt(this.sessionStorageService.getValue(this.blockSelectedKey) ?? 0) ?? 0);


  override ngOnInit() {
    super.ngOnInit();
  }

  override search() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      const filters: Filter[] = [{
        field: "search",
        operator: "contains",
        value: this.searchText(),
      }];
      this.param().filters = JSON.stringify(filters);
      this.service.search(this.param()).subscribe({
        next: (result: { results: Block[]; param: QueryParam }) => {
          this.isLoading.set(true);
          this.lists.set(result.results);
          if (!this.blockId()){
            this.blockId.set(result.results[0].id!);
          }
          this.param().rowCount = result.param.rowCount;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }, 50);
  }

  changeBlockId(id: number) {
    this.sessionStorageService.setValue({key: this.blockSelectedKey, value: id});
    this.blockId.set(id);
  }
}
