import {Component, forwardRef, ViewEncapsulation} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {SessionStorageService} from '../../utils/services/sessionStorage.service';
import {RoomTypeUiService} from './room-type-ui.service';
import {RoomType, RoomTypeService} from './room-type.service';
import {BaseSelectComponent} from "../../utils/components/base-select.component";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RoomTypeSelectComponent),
      multi: true,
    },
  ],
  selector: 'app-room-type-select',
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
                  [nzLabel]="'AllRoomType' | translate"
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
              {{ 'Loading' | translate }}
          </nz-option>
          <ng-template #actionItem>
              <a
                      *ngIf="addOption() && isBlockAdd"
                      (click)="uiService.showAdd(componentId)"
                      class="item-action"
              >
                  <i nz-icon nzType="plus"></i> {{ 'Add' | translate }}
              </a>
          </ng-template>
      </nz-select>
  `,
  styles: [`
    nz-select {
      width: 100%;
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class RoomTypeSelectComponent extends BaseSelectComponent<RoomType> {
  constructor(
    service: RoomTypeService,
    sessionStorageService: SessionStorageService,
    uiService: RoomTypeUiService,
  ) {
    super(service, uiService, sessionStorageService, 'room-type-filter', 'all-room-type')
  }

  isBlockAdd: boolean = true;

}
