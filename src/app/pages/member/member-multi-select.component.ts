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
import { Member, MemberService } from "./member.service";
@Component({
  selector: "app-member-multi-select",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MemberMultiSelectComponent),
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
      <nz-option [nzValue]="0" [nzLabel]="'AllLocation' | translate">
      </nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.id"
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
export class MemberMultiSelectComponent
  extends BaseMultipleSelectComponent<Member>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(service: MemberService, translate: TranslateService) {
    super(translate, service);
  }
}
