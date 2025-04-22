import {Component, inject, signal} from "@angular/core";
import {BaseApiService, QueryParam, SharedDomain} from "../services/base-api.service";
import {SessionStorageService} from "../services/sessionStorage.service";
import {PAGE_SIZE_OPTION} from "../../const";
import {rxResource} from "@angular/core/rxjs-interop";
import {NzTableQueryParams} from "ng-zorro-antd/table";

export enum FILTER_OPERATOR {
  CONTAINS = 'contains',
  EQUAL = 'eq'
}

@Component({
  selector: 'app-base-list-signal',
  template: ``,
  standalone: false,
})

export class BaseListSignalComponent<T extends SharedDomain> {
  constructor(
    protected service :BaseApiService<T>,
  ) {}
  readonly sessionStorageService = inject(SessionStorageService);
  readonly pageSizeOptionKey = signal<string>('');
  pageSizeOption = signal<number[]>(PAGE_SIZE_OPTION);
  filters = signal<object[]>([{ field: 'search', operator: 'contains', value: ''}])
  lists = rxResource({
    request: (() => ({ filters: JSON.stringify(this.filters())})),
    loader:(({request}) => {
      this.param.update((current) => ({
        ...current,
        pageIndex: 1,
        filters: request.filters
      }));

      return  this.service.search(this.param())
    })
  });
  param  = signal<QueryParam>({
    pageSize:  this.sessionStorageService.getValue(this.pageSizeOptionKey()) ?? 25,
    pageIndex: 1,
    sorts: '',
    filters: '',
  })

  onFilterChanged(field: string, operator: FILTER_OPERATOR, value: string): void {
    const filter = {field: field, operator: operator, value: value};
    this.filters.update((current:any[]) => {
      const filterIndex = current.findIndex(
        (f: any) => f.field === field && f.operator === operator
      );
      if (filterIndex !== -1) {
        current[filterIndex].value = value;
        return [...current];
      } else {
        return [...current, filter];
      }

    });
  }

  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = param;
    const sortFound = sort.find((x) => x.value);
    this.param.update((current) => ({
      ...current,
      sorts : (sortFound?.key ?? this.param().sorts) + (sortFound?.value === 'descend' ? '-' : ''),
      pageSize: pageSize,
      pageIndex: pageIndex,
    }))
    this.sessionStorageService.setPageSizeOptionKey(
      pageSize,
      this.pageSizeOptionKey()
    );
    this.lists.reload();
  }

}