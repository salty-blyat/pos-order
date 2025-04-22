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
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { QueryParam } from '../../utils/services/base-api.service';
import { UUID } from 'uuid-generator-ts';

interface SharedDomain {
  id?: number;
  code?: string;
}

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StaticDropdownMultipleSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-static-dropdown-multiple-select',
    template: `
    <nz-select
      #selectComponent
      nzShowSearch
      [nzMaxTagCount]="nzMaxCount"
      nzMode="multiple"
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      [nzDisabled]="disabled"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      [nzDropdownRender]="actionItem"
      (nzOpenChange)="openChange($event)"
      [nzRemoveIcon]="removeIcon"
      style="width: 100%"
    >
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.value"
        [nzLabel]="'' + item.label | translate"
      >
        <span class="b-name">{{ item.label | translate }}</span>
      </nz-option>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ 'Loading' | translate }}
      </nz-option>
    </nz-select>
    <ng-template #actionItem>
      <div style="padding: 5px 12px; border-top: 1px solid #f0f0f0">
        <a nz-button nzType="primary" (click)="ok()" style="margin-right: 5px">
          {{ 'Ok' | translate }}
        </a>
        <a nz-button (click)="cancel()">
          {{ 'Cancel' | translate }}
        </a>
      </div>
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
        font-size: 14px;
        // padding-left: 5px;
      }
      ::ng-deep cdk-virtual-scroll-viewport {
        min-height: 34px;
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
export class StaticDropdownMultipleSelectComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(public translate: TranslateService) {}
  @ViewChild('selectComponent') selectComponent!: NzSelectComponent;
  @Input() addOption!: boolean;
  @Output() valueChanged = new EventEmitter<any>();
  isAuthListAllBranch: boolean = false;
  componentId = UUID.createUUID();
  disabled = false;
  loading = false;
  branchId!: number;
  searchText = '';
  selectedValue: any[] = [0];
  oldSelectedValue: any[] = [...this.selectedValue];
  refreshSub$: any;
  lists: { value: any; label: any }[] = [];
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

  ngOnInit(): void {}

  applyInitParam(list: { value: number; label: string }[]) {
    this.lists = list;
    this.onModalChange();
  }

  applyDefaultValue(values: any[]) {
    this.selectedValue = values;
    this.oldSelectedValue = [...this.selectedValue];
    this.onModalChange();
  }

  onModalChange() {
    let defaultValue = this.lists[0].value; // chose first value as default value (select all)
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
        .filter((x) => this.selectedValue.includes(x.value))
        .map((x) => x.label)
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
