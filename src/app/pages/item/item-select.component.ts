import {Component, computed, forwardRef, ViewEncapsulation} from "@angular/core";
import {BaseSelectComponent} from "../../utils/components/base-select.component";
import {Item, ItemService} from "./item.service";
import {ItemUiService} from "./item-ui.service";
import {SessionStorageService} from "../../utils/services/sessionStorage.service";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys } from "../../const";

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
                  *ngIf="showAllOption() && isItemAdd()"
                  [nzValue]="0"
                  [nzLabel]="'AllItemTypes' | translate"
          ></nz-option>
          <nz-option
                  *ngFor="let item of lists()"
                  nzCustomContent
                  [nzValue]="item.id"
                  [nzLabel]="item?.code + ' ' + item?.name"
          >
              <div nz-flex nzAlign="center" nzGap="small">
                  <nz-avatar class="custom-avatar" [nzSrc]="item.image"></nz-avatar>
                  <div>
                      <b class="code">{{ item.code }} </b>
                      <span class="name">
                          {{ item.name }}
                      </span>
                  </div>
              </div>
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
  styles: [`
    nz-select {
      width: 100%;
    }

    nz-avatar.custom-avatar{
      width: 28px !important;
      height: 28px !important;
    }
    

    .code {
      font-size: 14px;
    }
    .name {
      font-size: 14px;
    }
    cdk-virtual-scroll-viewport {
      min-height: 116px;
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class ItemSelectComponent extends BaseSelectComponent<Item>{
  constructor(
    service: ItemService,
    uiService: ItemUiService,
    sessionStorageService: SessionStorageService,
    private authService: AuthService
  ) {
    super(service, uiService, sessionStorageService, 'item-filter', 'all-item');
  }
  isItemAdd = computed(()=> this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM__ADD));
}