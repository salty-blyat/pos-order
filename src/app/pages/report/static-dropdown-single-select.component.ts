import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {  forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {QueryParam} from "../../utils/services/base-api.service";
import {TranslateService} from "@ngx-translate/core";
import {UUID} from "uuid-generator-ts";

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StaticDropdownSingleSelectComponent),
            multi: true
        }
    ],
    selector: 'app-static-dropdown-single-select',
    template: `
    <nz-select
      nzShowSearch
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      [nzDisabled] = "disabled"
      style="width: 100%"
    >
      <nz-option *ngFor="let item of lists" nzCustomContent [nzValue]="item.value" [nzLabel]="item.label | translate">
        <span class="b-name">{{item.label | translate}}</span>
      </nz-option>
    </nz-select>
  `,
    styles: [`
    nz-select {
      width: 100%;
    }
    .item-action {
      flex: 0 0 auto;
      padding: 6px 8px;
      display: block;
    }
    .b-code{
      font-weight: bolder;
    }
    .b-name{
      font-size: 12px;
      padding-left: 5px;
    }
    ::ng-deep cdk-virtual-scroll-viewport{
      min-height: 34px;
    }
  `],
    standalone: false
})

export class StaticDropdownSingleSelectComponent implements OnInit, ControlValueAccessor, OnDestroy{
  constructor(
    public translate : TranslateService,
  ) {
  }
  @Input() storageKey!: string;
  @Input() showAllOption!: boolean;
  @Input() addOption!: boolean;
  @Output() valueChanged = new EventEmitter<any>();
  isAuthListAllBranch: boolean = false;
  parentStorageKey = "static-dropdown-single-select-filter";
  componentId = UUID.createUUID();
  disabled = false;
  loading = false;
  value: any = "";
  branchId!: number;
  searchText = '';
  selectedValue = 0;
  refreshSub$: any;
  lists: {value:any,label: any}[] = [];
  param: QueryParam = {
    pageSize: 9999999,
    pageIndex: 1,
    sorts: '',
    filters: ''
  };
  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  ngOnInit(): void {

  }

  applyInitParam(list: {value: any, label: string}[]){
    this.lists = list;
    this.onModalChange();
  }

  applyDefaultValue(values: any[]){
    this.selectedValue = values[0];
    this.onModalChange();
  }

  onModalChange(){
    let model = this.formatOutputValue();
    this.valueChanged.emit(model);
    this.onChangeCallback(model);
    this.onTouchedCallback(model);
  }

  formatOutputValue(){
    return {
      id: `${this.selectedValue}`,
      label: this.lists.filter(x => x.value == this.selectedValue)[0]?.label
    }
  }

  writeValue(value: any){
    this.selectedValue = value;
  }
  registerOnChange(fn: any){
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any){
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
