import { Validators } from "@angular/forms";
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { QueryParam } from "../../../utils/services/base-api.service";
import { LookupItem, LookupItemService } from "./lookup-item.service";
import { LookupItemUiService } from "./lookup-item-ui.service";
import { LOOKUP_TYPE } from "../lookup-type.service";
import { SessionStorageService } from "../../../utils/services/sessionStorage.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../../helpers/auth.service";
import { UUID } from "uuid-generator-ts";
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LookupItemSelectComponent),
      multi: true,
    },
  ],
  selector: "app-lookup-item-select",
  template: `
    <nz-select
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [nzAllowClear]="allowClear"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText = $event; param.pageIndex = 1; search()"
      [nzDisabled]="disabled"
      [nzCustomTemplate]="customTemplate"
      style="width: 100%"
    >
      <nz-option
        *ngIf="showAllOption"
        [nzValue]="0"
        [nzLabel]="typeLabelAll ? typeLabelAll : (showAll | translate)"
      ></nz-option>
      <ng-container *ngIf="lookupType !== LOOKUP_TYPE.HouseKeepingStatus">
        <nz-option
          *ngFor="let item of lists"
          [nzValue]="item.valueId"
          nzCustomContent
          [nzLabel]="(this.translate.currentLang === 'km' ? item.name || item.nameEn : item.nameEn || item.name) || ''"
        >
          <div class="option-container">
            <div class="image-container" *ngIf="item.image">
              <img *ngIf="item.image" [src]="item.image.url" alt="" />
            </div>
            <span [ngStyle]="{ color: item.color ?? '#000000D9' }" class="option-text">
              {{ (this.translate.currentLang === "km" ? item.name || item.nameEn : item.nameEn || item.name) || "" }}
            </span>
          </div>
        </nz-option>
      </ng-container>
      <ng-container *ngIf="lookupType == LOOKUP_TYPE.HouseKeepingStatus">
        <nz-option
          *ngFor="let item of lists; let i = index"
          nzCustomContent
          [nzValue]="item.valueId"
          [nzLabel]="(this.translate.currentLang === 'km' ? item.name || item.nameEn : item.nameEn || item.name) || ''"
        >
          <div class="option-container">
            <div class="image-container">
              <img *ngIf="item.image" [src]="item.image.url" alt="" />
              <img *ngIf="!item.image" src="./assets/image/img-not-found.jpg" alt="" />
            </div>
            <span [ngStyle]="{ color: item.color ?? '#000000D9' }" class="option-text">
              {{ (this.translate.currentLang === "km" ? item.name || item.nameEn : item.nameEn || item.name) || "" }}
            </span>
          </div>
        </nz-option>
      </ng-container>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #customTemplate let-selected>
        {{ selected.nzLabel }}
      </ng-template>
      <ng-template #actionItem>
        <a *ngIf="addOption && isLookupAdd" (click)="uiService.showAdd(lookupType, componentId)" class="item-action">
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
        </a>
      </ng-template>
    </nz-select>
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

      .option-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .image-container {
        height: 22px;
        width: 22px;
        border-radius: 50%;
      }

      .image-container img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
      }

      .option-text {
        font-size: 14px;
      }
    `,
  ],
  standalone: false,
})
export class LookupItemSelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    public translate: TranslateService,
    private service: LookupItemService,
    public uiService: LookupItemUiService,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService
  ) { }

  @Input() storageKey!: string;
  @Input() showAllOption!: boolean;
  @Input() addOption!: boolean;
  @Input() typeLabelAll!: string;
  @Input() showAll!: string;
  @Input() allowClear = false;
  @Output() valueChanged = new EventEmitter<any>();
  @Input() lookupType: LOOKUP_TYPE = LOOKUP_TYPE.HouseKeepingStatus;
  parentStorageKey = "lookup-item-filter";
  componentId = UUID.createUUID();
  @Input() disabled = false;
  @Input() statuses: number[] = [];
  loading = false;
  searchText = "";
  selectedValue = 0;
  refreshSub$: any;
  lists: LookupItem[] = [];
  param: QueryParam = {
    pageSize: 9999999,
    pageIndex: 1,
    sorts: "",
    filters: "",
  };
  isLookupAdd: boolean = false;

  onChangeCallback: any = () => { };
  onTouchedCallback: any = () => { };

  ngOnInit(): void {
    // this.isLookupAdd = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__LOOKUP__ADD
    // );

    this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
      console.log(e);
      if (e.key === "added" && e.componentId === this.componentId) {
        this.selectedValue = e.value.valueId;
        this.service.find(this.selectedValue).subscribe((result: any) => {
          this.loading = false;
          this.lists.push(result);
          this.onModalChange();
        });
      }
    });
    if (this.loading) {
      return;
    }
    if (this.showAllOption) this.selectedValue = 0;
    if (this.storageKey) {
      let recentFilters: any = [];
      recentFilters = this.sessionStorageService.getValue(this.parentStorageKey) ?? [];
      const recentFilter = recentFilters.filter((item: any) => item.key === this.storageKey)[0];

      this.selectedValue = recentFilter?.value.valueId ?? 0;
      if (this.selectedValue !== 0) this.lists.push(recentFilter?.value);
      this.valueChanged.emit(this.selectedValue);
      this.onChangeCallback(this.selectedValue);
      this.onTouchedCallback(this.selectedValue);
    }
  }

  search() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.param.filters = JSON.stringify([
        { field: "Name", operator: "contains", value: this.searchText },
        { field: "lookupTypeId", operator: "eq", value: this.lookupType },
      ]);
      if (this.searchText && this.param.pageIndex === 1) {
        this.lists = [];
      }
      this.service.search(this.param).subscribe({
        next: (result: { results: LookupItem[] }) => {
          this.loading = false;
          if (this.statuses.length > 0) {
            this.lists = result.results.filter((x: LookupItem) => !this.statuses.includes(x?.valueId!));
          } else {
            this.lists = result.results;
          }
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }

  onModalChange() {
    this.valueChanged.emit(this.selectedValue);
    this.onChangeCallback(this.selectedValue);
    this.onTouchedCallback(this.selectedValue);
    this.setStorageKey(this.selectedValue);
  }

  writeValue(value: any) {
    this.selectedValue = value;
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
      let item = this.lists.filter((item) => item.valueId === filter)[0];

      if (filter === 0) item = { id: 0, name: "all_lookup_items" };
      value = this.sessionStorageService.getValue(this.parentStorageKey) || [];
      const index = value.findIndex((e: any) => e.key === this.storageKey);
      index !== -1 ? (value[index].value = item) : value.push({ key: this.storageKey, value: item });
      this.sessionStorageService.setValue({
        key: this.parentStorageKey,
        value,
      });
    }
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
