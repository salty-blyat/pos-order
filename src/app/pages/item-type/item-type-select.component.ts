import { Component, computed, forwardRef, ViewEncapsulation} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { ItemType, ItemTypeService } from "./item-type.service";
import { ItemTypeUiService } from "./item-type-ui.service.component";
import {BaseSelectComponent} from "../../utils/components/base-select.component";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys } from "../../const";
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemTypeSelectComponent),
      multi: true,
    },
  ],
  selector: "app-item-type-select",
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
        [nzLabel]="'AllItemTypes' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item?.name + ''"
      >
        <span class="b-name">{{ item.name }}</span>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isItemTypeAdd()"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
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
      .cdk-virtual-scroll-viewport {
        min-height: 34px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class ItemTypeSelectComponent extends BaseSelectComponent<ItemType>{
  constructor(
    service: ItemTypeService,
    uiService: ItemTypeUiService,
    sessionStorageService: SessionStorageService,
    private authService: AuthService
  ) {
    super(service, uiService, sessionStorageService, 'item-type-filter', 'all-item-type')
  }

  isItemTypeAdd  = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM_TYPE__ADD))
}
