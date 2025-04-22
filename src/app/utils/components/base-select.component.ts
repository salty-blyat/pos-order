import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BaseApiService, QueryParam } from '../services/base-api.service';
import { SessionStorageService } from '../services/sessionStorage.service';
import { ControlValueAccessor } from '@angular/forms';
import { UUID } from 'uuid-generator-ts';
import { BaseUiService } from '../services/base-ui.service';

interface SharedDomain {
  id?: number;
  name?: string;
}
@Component({
    template: ``,
    standalone: false
})
export class BaseSelectComponent<T extends SharedDomain>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(
    protected service: BaseApiService<any>,
    protected sessionStorageService: SessionStorageService,
    @Inject('parentStorageKey') private parentStorageKey: string,
    @Inject('selectedAllKey') private selectedAllKey: string
  ) {}
  @Input() storageKey: string = '';
  @Input() showAllOption: boolean = false;
  @Input() addOption: boolean = false;
  @Input() showAllLabel: string = '';
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  componentId: string = UUID.createUUID();
  disabled: boolean = false;
  loading: boolean = false;
  searchText: string = '';
  selectedValue: number = 0;
  refreshSub$: any;
  lists: T[] = [];
  param: QueryParam = {
    pageSize: 9999999,
    pageIndex: 1,
    sorts: '',
    filters: '',
  };

  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  ngOnInit(): void {
    if (this.loading) {
      return;
    }
    if (this.showAllOption) this.selectedValue = 0;
    if (this.storageKey) {
      let recentFilters: any = [];
      recentFilters =
        this.sessionStorageService.getValue(this.parentStorageKey) ?? [];
      const recentFilter = recentFilters.filter(
        (item: any) => item.key === this.storageKey
      )[0];
      this.selectedValue = recentFilter?.value.id ?? 0;
      if (this.selectedValue !== 0) this.lists.push(recentFilter?.value);
      this.valueChanged.emit(this.selectedValue);
      this.onChangeCallback(this.selectedValue);
      this.onTouchedCallback(this.selectedValue);
    }
  }

  search() {
    this.loading = true;
    this.param.filters = JSON.stringify([
      { field: 'search', operator: 'contains', value: this.searchText },
    ]);
    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service.search(this.param).subscribe((result: { results: T[] }) => {
      this.loading = false;
      this.lists = result.results;
    });
  }
  onModalChange() {
    this.valueChanged.emit(this.selectedValue);
    this.onChangeCallback(this.selectedValue);
    this.onTouchedCallback(this.selectedValue);
    this.setStorageKey(this.selectedValue);
  }
  writeValue(value: any) {
    this.selectedValue = parseInt(value);
    this.search();
  }
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  setStorageKey(filter: any): void {
    if (this.storageKey) {
      let value: any = [];
      let item: any = this.lists.filter((item: T) => item.id === filter)[0];
      if (filter === 0) item = { id: 0, name: this.selectedAllKey };
      value = this.sessionStorageService.getValue(this.parentStorageKey) || [];
      const index = value.findIndex((e: any) => e.key === this.storageKey);
      index !== -1
        ? (value[index].value = item)
        : value.push({ key: this.storageKey, value: item });
      this.sessionStorageService.setValue({
        key: this.parentStorageKey,
        value,
      });
    }
  }
  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
