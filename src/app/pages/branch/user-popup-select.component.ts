import { Component, inject } from "@angular/core";
import { BranchService, User } from "./branch.service";
import { BranchUiService } from "./branch-ui.service";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";

@Component({
  selector: "app-user-popup-select",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ "AddUser" | translate }}</span>
    </div>
    <div class="modal-content" style="height:400px">
      <nz-layout>
        <nz-header>
          <div nz-row>
            <div class="filter-box">
              <app-filter-input
                storageKey="branch-list-search"
                (filterChanged)="
                  searchText.set($event); param().pageIndex = 1; search()
                "
              ></app-filter-input>
            </div>
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
                <th class="col-header" nzWidth="36px">#</th>
                <th class="col-header" nzWidth="36px"></th>
                <th class="col-header" nzWidth="46px"></th>
                <th>
                  {{ "Names" | translate }}
                </th>
                <th>{{ "Username" | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of lists(); let i = index">
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
                <td
                  [nzChecked]="setOfCheckedId.has(data.name!)"
                  (nzCheckedChange)="onItemChecked(data.name!, $event)"
                ></td>
                <td>
                  <nz-avatar nzIcon="user" [nzSrc]="data.profile"></nz-avatar>
                </td>
                <td nzEllipsis>{{ data.fullName }}</td>
                <td nzEllipsis>{{ data.name }}</td>
              </tr>
            </tbody>
          </nz-table>
        </nz-content>
      </nz-layout>
    </div>
    <div *nzModalFooter>
      <div>
        <button nz-button nzType="primary" (click)="ok()">
          <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
          {{ "Select" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
    </div>
  `,
  standalone: false,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [
    ` 
      .modal-content {
        padding: 0 24px;
      }
      nz-table {
        height: auto;
      }
      .modal-header-ellipsis {
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 0 !important;
      }
    `,
  ],
})
export class UserPopupSelectComponent extends BaseListComponent<User> {
  constructor(
    override service: BranchService,
    sessionStorageService: SessionStorageService,
    public override uiService: BranchUiService,
    private ref: NzModalRef<UserPopupSelectComponent>
  ) {
    super(service, uiService, sessionStorageService, "user-list");
  }
  readonly modal = inject(NZ_MODAL_DATA);
  setOfCheckedId = new Set<string>();
  requestData!: User[];
  onItemChecked(user: string, checked: boolean): void {
    this.updateCheckedSet(user, checked);
  }
  updateCheckedSet(user: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(user);
    } else {
      this.setOfCheckedId.delete(user);
    }
  }
  override ngOnInit(): void {
    this.modal?.users?.map((user: any) => {
      this.updateCheckedSet(user.name, true);
    });

    super.ngOnInit();
  }

  // override search() {
  //   if (this.isLoading()) {
  //     return;
  //   }
  //   this.isLoading.set(true);
  //   setTimeout(() => {
  //     const filters: any[] = [
  //       { field: 'search', operator: 'contains', value: this.searchText },
  //     ];
  //     this.param.filters = JSON.stringify(filters);
  //     this.service.getAllUsers(this.param).subscribe({
  //       next: (result: { results: User[]; param: QueryParam }) => {
  //         this.isloading.set(true);
  //         this.lists = result.results;

  //         //this still an issue we need to fix later on!
  //         // this.param = result.param;
  //         // this.pageCount = result.param.rowCount ?? 0;
  //         // console.log(this.lists);
  //         // this.param.rowCount = result.param.rowCount;
  //         this.loading = false;
  //       },
  //       error: (error: any) => {
  //         console.log(error);
  //       },
  //     });
  //   }, 50);
  // }
  override search(filters: Filter[] = [], delay: number = 50) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      filters?.unshift({
        field: "search",
        operator: "contains",
        value: this.searchText(),
      });
      filters?.map((filter: Filter) => {
        return {
          field: filter.field,
          operator: filter.operator,
          value: filter.value,
        };
      });
      this.param().filters = JSON.stringify(filters);
      this.service.getAllUsers(this.param()).subscribe({
        next: (result: { results: User[]; param: QueryParam }) => {
          this.lists.set(result.results);
          console.log(result);

          this.param.set(result.param);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }, delay);
  }

  ok() {
    this.requestData = this.lists().filter((data) =>
      this.setOfCheckedId.has(data.name!)
    );
    this.ref.triggerOk();
  }
  cancel() {
    this.ref.triggerCancel();
  }
}
