import {
  Component,
  Inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from "@angular/core";
import {
  BaseApiService,
  QueryParam,
  SharedDomain,
} from "../services/base-api.service";
import { SessionStorageService } from "../services/sessionStorage.service";
import { ControlValueAccessor } from "@angular/forms";
import { UUID } from "uuid-generator-ts";
import { BaseUiService } from "../services/base-ui.service";
import { BaseFilterComponent } from "./base-filter.component";

@Component({
  template: ``,
  standalone: false,
})
export class BaseSelectComponent<T extends SharedDomain>
  extends BaseFilterComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(
    protected service: BaseApiService<any>,
    protected uiService: BaseUiService,
    protected sessionStorageService: SessionStorageService,
    @Inject("parentStorageKey") protected parentStorageKey: string,
    @Inject("selectedAllKey") private selectedAllKey: string
  ) {
    super();
  }
  storageKey = input<string>("");
  showAllOption = input<boolean>(false);
  addOption = input<boolean>(false);
  showAllLabel = input<string>("");
  valueChanged = output<any>();
  componentId: string = UUID.createUUID();
  disabled = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  selected = signal<number>(0);
  isDefault = input<boolean>(false);
  refreshSub$: any;
  lists = signal<T[]>([]);
  param = signal<QueryParam>({
    pageSize: 9999999,
    pageIndex: 1,
    sorts: "",
    filters: "",
  });

  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
      if (e.key === "added" && e.componentId === this.componentId) {
        this.isLoading.set(true);
        this.selected.set(e.value?.valueId ?? e.value?.id);
        this.service.find(this.selected()).subscribe((result: any) => {
          this.isLoading.set(false);
          this.lists.update((value) => [...value, result]);
          this.onModalChange();
        });
      }
    });
    if (this.isLoading()) return;
    if (this.showAllOption()) this.selected.set(0);
    if (this.storageKey()) {
      let recentFilters: any[] =
        this.sessionStorageService.getValue(this.parentStorageKey) ?? [];
      const recentFilter = recentFilters.filter(
        (item: any) => item.key === this.storageKey()
      )[0];
      this.selected.set(
        recentFilter?.value?.valueId ?? recentFilter?.value?.id ?? 0
      );
      if (this.selected() !== 0)
        this.lists.update((value) => [...value, recentFilter?.value]);
      this.valueChanged.emit(this.selected());
      this.onChangeCallback(this.selected());
      this.onTouchedCallback(this.selected());
    }
    if (this.isDefault()) {
      this.search();
    }
  }

  search(delay: number = 50) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.param().filters = this.buildFilters();
      if (this.searchText() && this.param().pageIndex === 1) {
        this.lists.set([]);
      }
      this.service.search(this.param()).subscribe({
        next: (result: { results: T[] }) => {
          this.isLoading.set(false);
          this.lists.set(result.results);
          if (
            this.isDefault() &&
            this.selected() == 0 &&
            this.lists().length > 0
          ) {
            this.selected.set(this.lists()[0]?.id!);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, delay);
  }
  onModalChange() {
    this.valueChanged.emit(this.selected());
    this.onChangeCallback(this.selected());
    this.onTouchedCallback(this.selected());
    this.setStorageKey(this.selected());
  }
  writeValue(value: any) {
    if (value) {
      this.selected.set(value);
      this.search();
    }
  }
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  setStorageKey(filter: any): void {
    if (this.storageKey()) {
      let item: any = this.lists().filter(
        (item: T | any) => (item.valueId ?? item.id) === filter
      )[0];
      if (filter === 0) item = { id: 0, name: this.selectedAllKey };
      let value: any[] =
        this.sessionStorageService.getValue(this.parentStorageKey) || [];
      const index = value.findIndex((e: any) => e.key === this.storageKey());
      index !== -1
        ? (value[index].value = item)
        : value.push({ key: this.storageKey(), value: item });
      this.sessionStorageService.setValue({
        key: this.parentStorageKey,
        value,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSub$) {
      this.refreshSub$.unsubscribe();
    }
  }
}
