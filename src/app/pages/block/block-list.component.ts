import { Component, computed, signal } from "@angular/core";
import { Observable } from "rxjs";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ActivatedRoute } from "@angular/router";
import { BlockUiService } from "./block-ui.service";
import { Block, BlockService } from "./block.service";
import { NotificationService } from "../../utils/services/notification.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import { SIZE_COLUMNS } from "../../const";

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
            <div
              class="filter-box"
              style="display: flex; align-items: center; gap: 4px; width: 250px"
            >
              <app-filter-input
                storageKey="block-list-search"
                (filterChanged)="
                  searchText.set($event); param().pageIndex = 1; search()
                "
              ></app-filter-input>
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
            <ul
              nz-menu
              nzMode="inline"
              class="menu-custom-block"
              cdkDropList
              cdkDropListLockAxis="y"
              (cdkDropListDropped)="drop($event)"
              style="margin-top: 10px"
              [cdkDropListData]="lists()"
            >
              <ul
                *ngFor="let data of lists(); let i = index"
                class="block-ordering"
              >
                <li
                  [nzSelected]="blockId() == data.id"
                  nz-menu-item
                  cdkDrag
                  (click)="changeBlockId(data.id!)"
                  style="height: 40px;margin: 0; relative"
                >
                  <span
                    class="drag-handle"
                    nz-icon
                    nzType="holder"
                    nzTheme="outline"
                    cdkDragHandle
                  ></span>
                  {{ data.name }}
                  <a
                    [nzDropdownMenu]="menu"
                    class="action-button menu-dropdown"
                    nz-dropdown
                    nzTrigger="click"
                    style="flex:1"
                    nzPlacement="bottomRight"
                  >
                    <i
                      nz-icon
                      nzType="ellipsis"
                      nzTheme="outline"
                      style="font-size: 22px"
                    ></i>
                  </a>
                </li>
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
            </ul>
          </nz-sider>
        </div>
        <!-- // right side -->
        <div style="padding-left: 10px;">
          <app-floor-list
            *ngIf="blockId()"
            [blockId]="blockId()"
          ></app-floor-list>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  styles: [
    `
      .drag-handle {
        cursor: move;
        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
      }

      .menu-dropdown {
        position: absolute;
        right: 10px;
        i[nz-icon] {
          font-size: 18px !important;
        }
      }

      .menu-custom-block {
        background: #fff;
        gap: 6px;
        display: grid;
      }
    `,
  ],
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
  readonly blockSelectedKey = "block-selected-key";
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  blockId = signal(
    parseInt(this.sessionStorageService.getValue(this.blockSelectedKey) ?? 0) ??
      0
  );

  override ngOnInit() {
    super.ngOnInit();
  }

  // override search() {
  //   if (this.isLoading()) return;
  //   this.isLoading.set(true);
  //   setTimeout(() => {
  //     const filters: Filter[] = [
  //       {
  //         field: "search",
  //         operator: "contains",
  //         value: this.searchText(),
  //       },
  //     ];
  //     this.param().filters = JSON.stringify(filters);
  //     this.service.search(this.param()).subscribe({
  //       next: (result: { results: Block[]; param: QueryParam }) => {
  //         this.isLoading.set(true);
  //         this.lists.set(result.results);
  //         if (!this.blockId()) {
  //           this.blockId.set(result.results[0].id!);
  //         }
  //         this.param().rowCount = result.param.rowCount;
  //         this.isLoading.set(false);
  //       },
  //       error: () => {
  //         this.isLoading.set(false);
  //       },
  //     });
  //   }, 50);
  // }

  changeBlockId(id: number) {
    console.log(id);
    this.sessionStorageService.setValue({
      key: this.blockSelectedKey,
      value: id,
    });
    this.blockId.set(id);
  }
  readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
