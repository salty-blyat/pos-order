import { Component, Inject, OnInit } from '@angular/core'; 
import { Subscription } from 'rxjs'; 
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseApiService, QueryParam } from '../services/base-api.service';
import { SessionStorageService } from '../services/sessionStorage.service';
import { PAGE_SIZE_OPTION } from '../../const';
// import { BaseApiService, QueryParam } from 'sgx-shared';

interface SharedDomain {
  id?: number;
  name?: string;
}
@Component({
  template: ``,
})
export class OldBaseListComponent<T extends SharedDomain> implements OnInit {
  constructor(
    protected service: BaseApiService<any>,
    protected sessionStorageService: SessionStorageService,
    @Inject('pageSizeKey') private pageSizeKey: string
  ) {}
  pageSizeOptionKey: string = this.pageSizeKey;
  refreshSub!: Subscription;
  loading: boolean = false;
  searchText: string = '';
  pageSizeOption: number[] = PAGE_SIZE_OPTION;
  pageCount: number = 0;
  lists: T[] = [];
  param: QueryParam = {
    pageSize:
      this.sessionStorageService.getCurrentPageSizeOption(
        this.pageSizeOptionKey
      ) ?? 25,
    pageIndex: 1,
    sorts: '',
    filters: '',
  };

  ngOnInit(): void {
    this.search();
  }
  search() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: 'search', operator: 'contains', value: this.searchText },
      ];
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (result: { results: T[]; param: QueryParam }) => {
          this.loading = true;
          this.lists = result.results;

          //this still an issue we need to fix later on!
          // this.param = result.param;
          // this.pageCount = result.param.rowCount ?? 0;
          // console.log(this.lists);
          this.param.rowCount = result.param.rowCount;
          this.loading = false;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }, 50);
  }
  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = param;
    const sortFound = sort.find((x) => x.value);
    this.param.sorts =
      (sortFound?.key ?? this.param.sorts) +
      (sortFound?.value === 'descend' ? '-' : '');
    this.param.pageSize = pageSize;
    this.param.pageIndex = pageIndex;
    this.sessionStorageService.setPageSizeOptionKey(
      pageSize,
      this.pageSizeOptionKey
    );
    this.search();
  }
}
