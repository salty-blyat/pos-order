import {Component, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import {BaseSelectComponent} from "../../utils/components/base-select.component";
import { ItemUnit, ItemUnitService } from './item-unit.service';
import { ItemUnitUiService } from './item-unit-ui.service';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemUnitSelectComponent),
      multi: true,
    },
  ],
  selector: 'app-item-unit-select',
  template: `
    <nz-select
        nzShowSearch
        [nzDropdownRender]="actionItem"
        [nzServerSearch]="true"
        [(ngModel)]="selected"
        (ngModelChange)="onModalChange()"
        (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
        [nzDisabled]="disabled()"
        style="width: 100%"
      >
        <nz-option
          *ngIf="showAllOption()"
          [nzValue]="0"
          [nzLabel]="'AllItemUnit' | translate"
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
          {{ 'Loading' | translate }}
        </nz-option>
        <ng-template #actionItem>
          <a
            *ngIf="addOption()"
            (click)="uiService.showAdd(componentId)"
            class="item-action"
          >
            <i nz-icon nzType="plus"></i> {{ 'Add' | translate }}
          </a>
        </ng-template>
      </nz-select>
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
      font-size: 12px;
      padding-left: 5px;
    }
    ::ng-deep cdk-virtual-scroll-viewport {
      min-height: 34px;
    }
  `,
  ],
  standalone: false
})
export class ItemUnitSelectComponent extends BaseSelectComponent<ItemUnit>{
  constructor(
    service: ItemUnitService,
    uiService: ItemUnitUiService,
    sessionStorageService: SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService,'item-unit-filter','all-item-unit' )
  }
}

