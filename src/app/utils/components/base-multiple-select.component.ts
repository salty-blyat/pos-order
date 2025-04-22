import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzSelectComponent } from 'ng-zorro-antd/select';
// @ts-ignore
import * as uuid from 'uuid';
import { BaseApiService, QueryParam } from '../services/base-api.service';
interface SharedDomain {
  id?: number;
  name?: string;
}
@Component({
    template: '',
    standalone: false
})
export class BaseMultipleSelectComponent<TModel extends SharedDomain>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(
    public translate: TranslateService,
    public service: BaseApiService<any>
  ) {}
  @ViewChild('selectComponent') selectComponent!: NzSelectComponent;
  @Input() addOption!: boolean;
  @Output() valueChanged = new EventEmitter<any>();
  isAuthListAllBranch: boolean = false;
  componentId = uuid.v4();
  disabled = false;
  loading = false;
  branchId!: number;
  searchText = '';
  selectedValue: any[] = [0];
  oldSelectedValue: any[] = [...this.selectedValue];
  refreshSub$: any;
  lists: TModel[] = [];
  param: QueryParam = {
    pageSize: 50,
    pageIndex: 1,
    sorts: '',
    filters: '',
  };
  hideSelectedValues = false;
  isAuthAdd: boolean = false;
  nzMaxCount: number = 1;
  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  ngOnInit(): void {
    this.search(this.onModalChange.bind(this));
  }

  applyDefaultValue(values: any[]) {
    this.selectedValue = values;
    this.oldSelectedValue = [...this.selectedValue];
    this.onModalChange();
  }
  searchMore() {
    if (this.param.pageIndex! < this.param.pageCount!) {
      this.param.pageIndex! += 1;
      this.search();
    }
  }
  search(callBack: Function = () => {}) {
    this.loading = true;
    const filters: any[] = [
      { field: 'search', operator: 'contains', value: this.searchText },
    ];
    this.param.filters = JSON.stringify(filters);
    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service.search(this.param).subscribe((result: any) => {
      this.param = result.param;
      this.lists = [
        ...this.lists,
        ...result.results.filter(
          (x: any) => !this.lists.map((x) => x.id).includes(x.id)
        ),
      ];
      let ids = this.lists.map((item) => {
        return item.id;
      });
      if (
        this.selectedValue.filter((x) => !ids.includes(x)).length > 0 &&
        !this.searchText
      ) {
        let idsFilter =
          this.selectedValue.filter((x) => !ids.includes(x)) ?? [];
        const filters: any[] = [];
        if (idsFilter[0] != 0) {
          filters.push({
            field: 'ids',
            operator: 'contains',
            value: JSON.stringify(idsFilter),
          });
        }
        this.param.filters = JSON.stringify(filters);
        this.service.search(this.param).subscribe({
          next: (result: any) => {
            this.loading = false;
            return this.lists.push(
              ...result.results.filter(
                (x: any) => !this.lists.map((x) => x.id).includes(x.id)
              )
            );
          },
          error: (error: any) => {
            console.log(error);
            this.loading = false;
          },
        });
      } else {
        this.loading = false;
      }
      callBack();
    });
  }
  onModalChange(e?: any) {
    let defaultValue = 0; // chose first value as default value (select all)
    let lastSelectedValue = this.selectedValue[this.selectedValue.length - 1];
    this.nzMaxCount = 1;

    if (lastSelectedValue == defaultValue || !lastSelectedValue) {
      this.selectedValue = [defaultValue];
    } else {
      this.selectedValue = this.selectedValue.filter((x) => x != defaultValue);
    }

    let totalSelected = this.selectedValue.length;
    if (totalSelected > 1) {
      this.nzMaxCount = 0;
    }

    let model = this.formatOutputValue();
    this.valueChanged.emit(model);
    this.onChangeCallback(model);
    this.onTouchedCallback(model);
  }
  formatOutputValue() {
    return {
      id: this.selectedValue.join(),
      label: this.lists
        .filter((x) => this.selectedValue.includes(x.id))
        .map(
          (x: any) =>
            x.sortName ||
            this.formatJson(x.name) ||
            x.fullName + ' ' + this.formatData(x.data) ||
            this.formatJson(x.title)
        )
        .join(),
    };
  }

  formatJson(name: any): string {
    try {
      let value = JSON.parse(name);
      return value[this.translate.currentLang];
    } catch (e) {
      return name;
    }
  }

  formatData(data: string): string {
    try {
      let value = JSON.parse(data);
      return value?.phone;
    } catch (e) {
      return '';
    }
  }

  writeValue(value: any) {
    this.selectedValue = value;
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
  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
  cancel() {
    this.selectedValue = [...this.oldSelectedValue];
    this.selectComponent.nzOpen = false;
    this.onModalChange();
  }
  ok() {
    this.oldSelectedValue = [...this.selectedValue];
    this.selectComponent.nzOpen = false;
    this.onModalChange();
  }
  openChange($event: boolean) {
    if (!$event) {
      this.cancel();
    }
  }
}
