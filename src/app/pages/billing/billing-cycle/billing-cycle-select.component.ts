import {Component} from "@angular/core";
import {BaseSelectComponent} from "../../../utils/components/base-select.component";
import {BillingCycle, BillingCycleService} from "./billing-cycle.service";
import {BillingCycleUiService} from "./billing-cycle-ui.service";
import {SessionStorageService} from "../../../utils/services/sessionStorage.service";

@Component({
  selector: 'app-billing-cycle-select',
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
                  [nzLabel]="'AllBillingCycle' | translate"
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
                      *ngIf="addOption()"
                      (click)="uiService.showAdd(componentId)"
                      class="item-action"
              >
                  <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
              </a>
          </ng-template>
      </nz-select>
  `,
  standalone: false,
})

export class BillingCycleSelectComponent extends BaseSelectComponent<BillingCycle>{
  constructor(
    service: BillingCycleService,
    uiService: BillingCycleUiService,
    sessionStorageService:  SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService, "billing-cycle-filter", "all-billing-cycle");
  }
}