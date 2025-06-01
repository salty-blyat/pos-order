import {
  Component,
  forwardRef,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { OfferGroup, OfferGroupService } from "./offer-group.service";
import { OfferGroupUiService } from "./offer-group-ui.service";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OfferGroupSelectComponent),
      multi: true,
    },
  ],
  selector: "app-offer-group-select",
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
        [nzLabel]="'AllOfferGroup' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item?.name + ''"
      >
        <div class="b-name  option-container " nz-flex nzGap="small">
          <div class="image-container">
            <img *ngIf="item.image" [src]="item.image" alt="" />
            <img
              *ngIf="!item.image"
              src="./assets/image/img-not-found.jpg"
              alt=""
            />
          </div>
          <span>{{ item.name }}</span>
        </div>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isOfferGroupAdd()"
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

      .option-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .image-container {
        height: 18px;  
      }

      .image-container img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        overflow: hidden;
      }

      .option-text {
        font-size: 14px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OfferGroupSelectComponent extends BaseSelectComponent<OfferGroup> {
  constructor(
    service: OfferGroupService,
    uiService: OfferGroupUiService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "offer-group-filter",
      "all-offer-group"
    );
  }

  isOfferGroupAdd = signal<boolean>(true);
}
