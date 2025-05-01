import {Component, forwardRef, ViewEncapsulation} from "@angular/core";
import {BaseSelectComponent} from "../../utils/components/base-select.component";
import {Item, ItemService} from "./item.service";
import {ItemUiService} from "./item-ui.service";
import {SessionStorageService} from "../../utils/services/sessionStorage.service";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-item-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemSelectComponent),
      multi: true,
    },
  ],
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
                      *ngIf="addOption()"
                      (click)="uiService.showAdd(componentId)"
                      class="item-action"
              >
                  <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
              </a>
          </ng-template>
      </nz-select>
  `,
  styles: [``],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class ItemSelectComponent extends BaseSelectComponent<Item>{
  constructor(
    service: ItemService,
    uiService: ItemUiService,
    sessionStorageService: SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService, 'item-filter', 'all-item');
  }
}