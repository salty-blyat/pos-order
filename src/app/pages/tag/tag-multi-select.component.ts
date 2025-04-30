import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { QueryParam } from "../../utils/services/base-api.service";
import { Tag, TagGroupService } from "./tag-group.service";
import { AuthService } from "../../helpers/auth.service";
@Component({
  selector: "app-tag-multiple-select",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagMultiSelectComponent),
      multi: true,
    },
  ],
  template: `
    <nz-select
      nzShowSearch
      [ngClass]="{ 'no-padding': nzBorderless }"
      [nzMaxTagCount]="nzMaxCount"
      [nzServerSearch]="true"
      nzMode="multiple"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzScrollToBottom)="searchMore()"
      (nzOnSearch)="searchText = $event; param.pageIndex = 1; searchTags()"
      [nzDisabled]="disabled"
      [nzBorderless]="nzBorderless"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      [nzRemoveIcon]="removeIcon"
    >
      <nz-option
        *ngIf="showAllOption"
        [nzValue]="0"
        [nzLabel]="'AllTag' | translate"
      ></nz-option>
      <nz-option
        nzCustomContent
        *ngFor="let item of lists"
        [nzValue]="item.id"
        [nzLabel]="item.name + ''"
      >
        <span style="color: rgba(0, 0, 0, 0.50);" class="b-name">{{
          item.groupName
        }}</span>
        <span class="b-name">{{ item.name }}</span>
      </nz-option>
    </nz-select>
    <ng-template #tagPlaceHolder let-selectedList>
      {{ selectedList.length }}
      {{
        (selectedList.length > 1 ? "items" : "item") + " selected" | translate
      }}
    </ng-template>
    <ng-template #removeIcon>
      <span
        *ngIf="!selectedValue.includes(0)"
        nz-icon
        nzType="close"
        nzTheme="outline"
      ></span>
    </ng-template>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
      .item-action {
        flex: 0 0 auto;
        padding: 6px 8px;
        display: block;
      }
      .b-code {
        font-weight: bolder;
      }
      .b-name {
        font-size: 12px;
        padding-left: 5px;
      }
      ::ng-deep .ant-select-item-group {
        color: rgba(0, 0, 0, 0.4);
      }

      .no-padding {
        .ant-select-selector {
          padding: 0 !important;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class TagMultiSelectComponent implements OnInit, ControlValueAccessor, OnDestroy {
  constructor(
    private service: TagGroupService,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService
  ) {}
  @Input() storageKey: string = "";
  @Input() showAllOption!: boolean;
  @Input() addOption!: boolean;
  @Input() spaceId: number = 0;
  @Input() nzBorderless: boolean = false;
  @Output() valueChanged = new EventEmitter<any>();
  parentStorageKey = "tag-group-filter";

  disabled = false;
  loading = false;
  value: any = "";
  searchText = "";
  nzMaxCount = 1;
  selectedValue = [0];
  refreshSub$: any;
  lists: Tag[] = [];
  param: QueryParam = {
    pageSize: 100,
    pageIndex: 1,
    sorts: "",
    filters: "",
  };

  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  ngOnInit(): void {
    if (this.loading) {
      return;
    }
    if (this.showAllOption) this.selectedValue = [0];
    if (this.storageKey) {
      let recentFilters: any = [];
      recentFilters =
        this.sessionStorageService.getValue(this.parentStorageKey) ?? [];
      const recentFilter = recentFilters.filter(
        (item: any) => item.key === this.storageKey
      )[0];
      this.selectedValue = recentFilter?.value.id ?? 0;
      if (this.selectedValue !== null) this.lists.push(recentFilter?.value);
      this.valueChanged.emit(this.selectedValue);
      this.onChangeCallback(this.selectedValue);
      this.onTouchedCallback(this.selectedValue);
      this.searchTags();
    }
  }
  searchMore() {
    if (this.param.pageIndex! < this.param.pageCount!) {
      this.param.pageIndex! += 1;
      this.searchTags();
    }
  }
  searchTags() {
    this.loading = true;
    const filters: any[] = [
      { field: "search", operator: "contains", value: this.searchText },
    ];
    this.param.filters = JSON.stringify(filters);
    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service.searchTags(this.param).subscribe((result: any) => {
      this.loading = false;
      this.param = result.param;
      this.lists = [
        ...this.lists,
        ...result.results?.filter(
          (x: any) => !this.lists.map((x) => x.id).includes(x.id)
        ),
      ];
      let ids = this.lists.map((item) => {
        return item.id;
      });
      if (
        this.selectedValue?.filter((x) => !ids.includes(x)).length > 0 &&
        !this.searchText
      ) {
        let idsFilter = JSON.stringify(
          this.selectedValue.filter((x) => !ids.includes(x))
        );
        this.param.filters = JSON.stringify([
          { field: "ids", operator: "contains", value: idsFilter },
        ]);
        this.service.searchTags(this.param).subscribe({
          next: (result: any) => {
            this.loading = false;
            return this.lists.push(
              ...result.results.filter(
                (x: any) => !this.lists.map((x) => x.id).includes(x.id)
              )
            );
          },
          error: (error: any) => console.log(error),
        });
      } else {
        this.loading = false;
      }
    });
  }
  onModalChange() {
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
    this.valueChanged.emit(this.selectedValue);
    this.onChangeCallback(this.selectedValue);
    this.onTouchedCallback(this.selectedValue);
    this.setStorageKey(this.selectedValue);
  }
  writeValue(value: any) {
    this.selectedValue = value;
    this.searchTags();
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
      let item = this.lists.filter((item) => item.id === filter)[0];
      if (filter === 0) item = { id: 0, name: "all_tag" };
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
