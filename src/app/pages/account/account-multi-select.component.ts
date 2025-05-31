import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseMultipleSelectComponent } from "../../utils/components/base-multiple-select.component";
import { TranslateService } from "@ngx-translate/core";
import {
  LookupItem,
  LookupItemService,
} from "../lookup/lookup-item/lookup-item.service";
import { QueryParam } from "../../utils/services/base-api.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
@Component({
  selector: "app-account-multi-select",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountMultiSelectComponent),
      multi: true,
    },
  ],
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
      style="width: 100%"
      (nzScrollToBottom)="searchMore()"
    >
      <nz-option [nzValue]="0" [nzLabel]="'AllAccountType' | translate">
      </nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.valueId"
        [nzLabel]="item.name + ' '"
      >
        <span class="b-name">{{ item.name }}</span>
      </nz-option>
    </nz-select>
    <ng-template #actionItem>
      <nz-spin *ngIf="loading" style="bottom: 8px;"></nz-spin>
      <div class="div-bottom">
        <a nz-button nzType="primary" (click)="ok()" style="margin-right: 5px">
          {{ "Ok" | translate }}
        </a>
        <a nz-button (click)="cancel()">
          {{ "cancel" | translate }}
        </a>
      </div>
    </ng-template>
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
export class AccountMultiSelectComponent
  extends BaseMultipleSelectComponent<LookupItem>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(service: LookupItemService, translate: TranslateService) {
    super(translate, service);
  }
  override param: QueryParam = {
    pageSize: 50,
    pageIndex: 1,
    sorts: "",
    filters: "",
  }; 
  override search(callBack: Function = () => {}) {
    this.loading = true;
    const filters: any[] = [
      { field: 'name', operator: 'contains', value: this.searchText },
      {
        field: 'lookupTypeId',
        operator: 'eq',
        value: LOOKUP_TYPE.AccountType,
      },
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
      this.loading = false;
      callBack();
    });
  }
  override formatOutputValue() {
    return {
      id: this.selectedValue.join(),
      label: this.lists
        .filter((x) => this.selectedValue.includes(x.valueId))
        .map((x) => x.name)
        .join(),
    };
  }
  readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
