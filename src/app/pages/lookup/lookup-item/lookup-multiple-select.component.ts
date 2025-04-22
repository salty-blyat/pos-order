import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { QueryParam } from '../../../utils/services/base-api.service';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { LOOKUP_TYPE } from '../lookup-type.service';
import { LookupItem, LookupItemService } from './lookup-item.service';
import { UUID } from 'uuid-generator-ts';

interface SharedDomain {
  id?: number;
  code?: string;
}

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LookupMultipleSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-lookup-multiple-select',
    template: `
    <nz-select
      #selectComponent
      nzShowSearch
      [nzMaxTagCount]="nzMaxCount"
      nzMode="multiple"
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText = $event; param.pageIndex = 1; search()"
      [nzDisabled]="disabled"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      [nzDropdownRender]="actionItem"
      (nzOpenChange)="openChange($event)"
      [nzRemoveIcon]="removeIcon"
      [nzCustomTemplate]="customTemplate"
      style="width: 100%"
    >
      <nz-option [nzValue]="0" [nzLabel]="'AllStatus' | translate"> </nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="'' + item.name"
      >
        <!--        <i nz-icon [nzType]="icon[item.id!]"-->
        <!--           [ngStyle]="{'color': color[item.id!],'padding-right': '4px'}"></i>-->
        <span class="b-name">{{ item.name }}</span>
      </nz-option>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ 'Loading' | translate }}
      </nz-option>
    </nz-select>
    <ng-template #actionItem>
      <div style="padding: 5px 12px; border-top: 1px solid #f0f0f0">
        <a nz-button nzType="primary" (click)="ok()" style="margin-right: 5px">
          {{ 'ok' | translate }}
        </a>
        <a nz-button (click)="cancel()">
          {{ 'cancel' | translate }}
        </a>
      </div>
    </ng-template>
    <ng-template #customTemplate let-selected>
      <!--      <i nz-icon style="padding: 4px 6px 0 0;" [nzType]="icon[selected.nzValue!]" [ngStyle]="{'color': color[selected.nzValue!]}"></i>-->
      {{ selected.nzLabel }}
    </ng-template>
    <ng-template #tagPlaceHolder let-selectedList>
      {{ selectedList.length }}
      {{
        (selectedList.length > 1 ? 'items' : 'item') + ' selected' | translate
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
        width: 220px;
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
        font-size: 14px;
      }
      :host ::ng-deep .ant-select-multiple .ant-select-selection-item {
        border: 0 !important;
      }
      :host ::ng-deep .ant-select-multiple .ant-select-selection-item {
        max-width: 120px !important;
      }
    `,
    ],
    standalone: false
})
export class LookupMultipleSelectComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(
    public translate: TranslateService,
    private service: LookupItemService
  ) {}
  @ViewChild('selectComponent') selectComponent!: NzSelectComponent;
  @Input() addOption!: boolean;
  @Output() valueChanged = new EventEmitter<any>();
  // @Input() lookupType: LOOKUP_TYPE = LOOKUP_TYPE.MEETING_STATUS;
  allLabelName: string = 'AllStatus';
  isAuthListAllBranch: boolean = false;
  componentId = UUID.createUUID();
  disabled = false;
  loading = false;
  branchId!: number;
  searchText = '';
  selectedValue: any[] = [0];
  oldSelectedValue: any[] = [...this.selectedValue];
  refreshSub$: any;
  lists: LookupItem[] = [];
  param: QueryParam = {
    pageSize: 9999999,
    pageIndex: 1,
    sorts: '',
    filters: '',
  };
  isAuthAdd: boolean = false;
  nzMaxCount: number = 1;
  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  ngOnInit(): void {
    this.search(this.onModalChange.bind(this));
  }

  applyInitParam(model: { value: number; label: string }) {
    // this.lookupType = model.value;
    this.allLabelName = model.label;
  }

  applyDefaultValue(values: any[]) {
    this.selectedValue = values;
    this.oldSelectedValue = [...this.selectedValue];
    this.onModalChange();
  }

  search(callBack: Function = () => {}) {
    this.loading = true;
    const filters: any[] = [
      { field: 'Name', operator: 'contains', value: this.searchText },
    ];
    filters.push({
      field: 'lookupTypeId',
      operator: 'eq',
      // value: LOOKUP_TYPE.MEETING_STATUS,
    });
    this.param.filters = JSON.stringify(filters);
    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service.search(this.param).subscribe((result: any) => {
      this.loading = false;
      this.lists = result.results;
      callBack();
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
        .map((x) => x.name)
        .join(),
    };
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
