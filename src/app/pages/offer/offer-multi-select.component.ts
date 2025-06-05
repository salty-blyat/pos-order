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
import { Offer, OfferService } from "./offer.service";
@Component({
  selector: "app-offer-multi-select",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OfferMultiSelectComponent),
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
      <nz-option [nzValue]="0" [nzLabel]="'AllOffer' | translate"> </nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item.name + ' '"
      >
        <div class="b-name option-container" nz-flex nzGap="small">
          <div class="image-container">
            <img *ngIf="item.photo" [src]="item.photo" alt="" />
            <img
              *ngIf="!item.photo"
              src="./assets/image/img-not-found.jpg"
              alt=""
            />
          </div>

          <div class="option">
            <span>
              {{ item?.name }}
            </span>
            <span>
              {{
                item?.redeemCost
                  | accountBalance : item?.redeemWith!
                  | translate
              }}
            </span>
          </div>
        </div>
      </nz-option>
    </nz-select>
    <ng-template #actionItem>
      <nz-spin *ngIf="loading" style="bottom: 8px;"></nz-spin>
      <div class="div-bottom">
        <a nz-button nzType="primary" (click)="ok()" style="margin-right: 5px">
          {{ "Ok" | translate }}
        </a>
        <a nz-button (click)="cancel()">
          {{ "Cancel" | translate }}
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
      .option {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .option-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .image-container {
        display: flex;
        height: 18px;
      }
      .image-container img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        overflow: hidden;
      }
      .div-bottom {
        margin: 4px 4px 0 4px;
      }
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
export class OfferMultiSelectComponent
  extends BaseMultipleSelectComponent<Offer>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(service: OfferService, translate: TranslateService) {
    super(translate, service);
  }
}
