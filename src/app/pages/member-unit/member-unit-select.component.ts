import { Component, computed, forwardRef, ViewEncapsulation} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { AuthService } from '../../helpers/auth.service'; 
import { BaseSelectComponent} from "../../utils/components/base-select.component";
import { MemberUnit, MemberUnitService } from './member-unit.service';
import { MemberUnitUiService } from './member-unit-ui.service';
import { AuthKeys } from '../../const';

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MemberUnitSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-member-unit-select',
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
          [nzLabel]="'AllMemberUnit' | translate"
        ></nz-option>
        <nz-option
          *ngFor="let item of lists()"
          [nzValue]="item.id"
          [nzLabel]="item?.name + ''">
        </nz-option>
        <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
          <i nz-icon nzType="loading" class="loading-icon"></i>
          {{ 'Loading' | translate }}
        </nz-option>
        <ng-template #actionItem>
          <a
            *ngIf="addOption() && isMemberUnitAdd()"
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
    encapsulation: ViewEncapsulation.None,
})
export class MemberUnitSelectComponent extends BaseSelectComponent<MemberUnit>
{
    constructor(
        service: MemberUnitService,
        sessionStorageService: SessionStorageService,
        uiService: MemberUnitUiService,
        private authService: AuthService
    ) {
        super(service, uiService, sessionStorageService, 'member-unit-filter', 'all-member-unit')
    }
    isMemberUnitAdd = computed(() =>this.authService.isAuthorized(AuthKeys.APP__MEMBER__ADD));
 
}
