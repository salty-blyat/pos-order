import {
  Component,
  forwardRef,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Offer, OfferService } from "./offer.service";
import { OfferUiService } from "./offer-ui.service";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OfferSelectComponent),
      multi: true,
    },
  ],
  selector: "app-offer-select",
  template: `
    <nz-select
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [(ngModel)]="selected"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
      [nzDisabled]="disabled()"
    >
      <nz-option
        *ngIf="showAllOption()"
        [nzValue]="0"
        [nzLabel]="'AllOffer' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item"
        [nzLabel]="item?.name + ''"
      >
        <div nz-flex nzAlign="center" nzGap="small">
          <!-- <nz-avatar [nzSrc]="item.image"></nz-avatar>  -->
          <span class="b-name"> {{ item.name }} </span>
        </div>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isOfferAdd()"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
        </a>
      </ng-template>
    </nz-select>
  `,
  standalone: false,
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
      ::ng-deep cdk-virtual-scroll-viewport {
        min-height: 34px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OfferSelectComponent extends BaseSelectComponent<Offer> {
  constructor(
    service: OfferService,
    uiService: OfferUiService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "offer-filter",
      "all-offer"
    );
  }

  isOfferAdd = signal<boolean>(true);
}
