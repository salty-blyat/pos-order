import {Component, forwardRef, ViewEncapsulation} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { AuthService } from '../../helpers/auth.service';
import {Block, BlockService} from "./block.service";
import {BlockUiService} from "./block-ui.service";
import {BaseSelectComponent} from "../../utils/components/base-select.component";

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BlockSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-block-select',
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
          [nzLabel]="'AllBlock' | translate"
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
            *ngIf="addOption() && isBlockAdd"
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
      `,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BlockSelectComponent extends BaseSelectComponent<Block>{
    constructor(
         service: BlockService,
         uiService: BlockUiService,
         sessionStorageService: SessionStorageService,
         private authService: AuthService
    ) {
        super(service, uiService, sessionStorageService, 'block-filter', 'all-block')
    }
    isBlockAdd: boolean = true;
}
