import { Component, computed, forwardRef, ViewEncapsulation, WritableSignal } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AuthService } from "../../helpers/auth.service";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { ChargeDeleteComponent } from "./charge-delete.component";
import { Charge, ChargeService } from "./charge.service";
import { ChargeUiService } from "./charge-ui.service";
import { AuthKeys } from "../../const";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChargeSelectComponent),
      multi: true,
    },
  ],
  selector: "app-charge-select",
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
        [nzLabel]="'AllCharge' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item?.name + ''"
        
      >
        <span>{{ item.name }}</span>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isChargeAdd()"
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
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ChargeSelectComponent extends BaseSelectComponent<Charge> {
  constructor(
    service: ChargeService,
    uiService: ChargeUiService,
    sessionStorageService: SessionStorageService,
    private authService: AuthService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "charge-filter",
      "all-charge"
    );
  }  
  isChargeAdd = computed<boolean>(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__ADD));

}
