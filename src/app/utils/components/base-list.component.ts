import { Component, Inject, input, OnDestroy, OnInit, signal } from "@angular/core";
import { SessionStorageService } from "../services/sessionStorage.service";
import { Subscription } from "rxjs";
import { PAGE_SIZE_OPTION } from "../../const";
import {
  BaseApiService,
  QueryParam,
  SharedDomain,
} from "../services/base-api.service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
// import { BaseUiService } from "../services/base-ui.service"; 
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { BaseFilterComponent } from "./base-filter.component";

@Component({
  template: ``,
  standalone: false,
})
export class BaseListComponent<T extends SharedDomain>
  extends BaseFilterComponent
  implements OnInit, OnDestroy {
  constructor(
    protected service: BaseApiService<T>,
    // protected uiService: BaseUiService<T>,
    protected sessionStorageService: SessionStorageService,
    @Inject("pageSizeKey") private pageSizeKey: string,
  ) {
    super();
  }
  pageSizeOptionKey = signal<string>(this.pageSizeKey);
  refreshSub: Subscription = new Subscription();
  isLoading = signal<boolean>(false);
  pageSizeOption = signal<number[]>(PAGE_SIZE_OPTION);
  loadMoreOption = signal<boolean>(false);
  lists = signal<T[]>([]);
  param = signal<QueryParam>({
    pageSize: this.loadMoreOption() ? 25 : 999999,
    pageIndex: 1,
    sorts: "",
    filters: "",
  });
  draged = signal(false);

  ngOnInit(): void {
    // this.refreshSub = this.uiService?.refresher?.subscribe(() => {
    //   this.search();
    // });
    this.search();
  }

  search(delay: number = 50) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.param().filters = this.buildFilters();
      this.service.search(this.param()).subscribe({
        next: (result: { results: T[]; param: QueryParam }) => {
          this.param.set(result.param);
          if (this.loadMoreOption()) {
            this.lists.update((value) => [
              ...value,
              ...result.results,
            ]);
            this.isLoading.set(false);
          } else {
            this.lists.set(result.results);
            this.isLoading.set(false);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }, delay);
  }

  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = param;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = currentSort && currentSort.key;
    const sortOrder = currentSort && currentSort.value;
    if (sortField != null) {
      this.param().sorts = sortField + (sortOrder == "ascend" ? "" : "-");
    }
    this.param().pageSize = pageSize;
    this.param().pageIndex = pageIndex;
    this.sessionStorageService.setPageSizeOptionKey(
      pageSize,
      this.pageSizeOptionKey()
    );
    this.search();
  } 

  searchMore() {
    console.log('this.param() ' + this.param().pageIndex);
    console.log('this.param().pageCount ' + this.param().pageCount!);

    if (this.param().pageIndex! < this.param().pageCount!) {
      this.param().pageIndex! += 1;
      this.search();
    }
  }
  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub?.unsubscribe();
    }
  }
}
