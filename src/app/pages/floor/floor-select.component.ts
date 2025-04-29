import {Component, forwardRef, signal, ViewEncapsulation} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { FloorUiService } from './floor-ui.service';
import { Floor, FloorService } from './floor.service';
import {BaseSelectComponent} from "../../utils/components/base-select.component";

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FloorSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-floor-select',
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
        *ngIf="showAllOption"
        [nzValue]="0"
        [nzLabel]="'AllFloor' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item?.name + ''"
      >
        <span >{{ item.name }}</span>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ 'Loading' | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isFloorAdd()"
          (click)="uiService.showAdd(0 ,componentId)"
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
      cdk-virtual-scroll-viewport {
        min-height: 34px;
      }
    `,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class FloorSelectComponent extends BaseSelectComponent<Floor> {
  constructor(
       service: FloorService,
       override uiService: FloorUiService,
       sessionStorageService: SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService, 'floor-filter', 'all-floor')
  }
  isFloorAdd = signal(true);
}


