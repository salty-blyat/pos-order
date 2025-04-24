import {Component, Inject, OnDestroy, OnInit, signal} from "@angular/core";
import { SessionStorageService } from "../services/sessionStorage.service";
import { Subscription } from "rxjs";
import { PAGE_SIZE_OPTION } from "../../const";
import {BaseApiService, Filter, QueryParam} from "../services/base-api.service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import {BaseUiService} from "../services/base-ui.service";

interface SharedDomain {
  id?: number;
  name?: string;
}
@Component({
  template: ``,
  standalone: false,
})
export class BaseListComponent<T extends SharedDomain> implements OnInit, OnDestroy
{
  constructor(
    protected service: BaseApiService<T>,
    protected uiService: BaseUiService<T>,
    protected sessionStorageService: SessionStorageService,
    @Inject("pageSizeKey") private pageSizeKey: string,

  ) {}
  pageSizeOptionKey = signal<string>(this.pageSizeKey);
  refreshSub: Subscription = new Subscription();
  isLoading = signal<boolean>(false);
  searchText = signal<string>("");
  pageSizeOption = signal<number[]>(PAGE_SIZE_OPTION);
  lists = signal<T[]>([]);
  param = signal<QueryParam>({
    pageSize:
        this.sessionStorageService.getCurrentPageSizeOption(
            this.pageSizeOptionKey()
        ) ?? 25,
    pageIndex: 1,
    sorts: "",
    filters: "",
  });

  ngOnInit(): void {
    this.refreshSub = this.uiService?.refresher?.subscribe(() => {
      this.search();
    });
    this.search();
  }
  search(filters: Filter[] = [{ field: 'search', operator: 'contains', value: this.searchText()}]) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      filters.map((filter: Filter) => {
        return  {field: filter.field, operator: filter.operator, value: filter.value};
      })
      this.param().filters = JSON.stringify(filters);
      this.service.search(this.param()).subscribe({
        next: (result: { results: T[]; param: QueryParam }) => {
          this.isLoading.set(true);
          this.lists.set(result.results);
          this.param().rowCount = result.param.rowCount;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }, 50);
  }

  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = param;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key);
    const sortOrder = (currentSort && currentSort.value);
    if (sortField != null) {
      this.param().sorts = (sortField ) + (sortOrder == 'ascend' ? '' : '-');
    }
    this.param().pageSize = pageSize;
    this.param().pageIndex = pageIndex;
    this.sessionStorageService.setPageSizeOptionKey(pageSize, this.pageSizeOptionKey());
    this.search();
  }

  ngOnDestroy(): void {
    if (this.refreshSub){
      this.refreshSub?.unsubscribe();
    }
  }
}
