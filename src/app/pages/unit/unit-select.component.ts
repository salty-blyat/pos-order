import { Component, forwardRef, ViewEncapsulation} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { AuthService } from '../../helpers/auth.service';
import { Unit, UnitService} from "./unit.service";
import { UnitUiService} from "./unit-ui.service";
import { BaseSelectComponent} from "../../utils/components/base-select.component";


@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UnitSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-unit-select',
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
          [nzLabel]="'AllUnit' | translate"
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
            *ngIf="addOption() && isUnitAdd"
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
export class UnitSelectComponent extends BaseSelectComponent<Unit>
{
    constructor(
        service: UnitService,
        sessionStorageService: SessionStorageService,
        uiService: UnitUiService,
        private authService: AuthService
    ) {
        super(service, uiService, sessionStorageService, 'unit-filter', 'all-unit')
    }

    isUnitAdd: boolean = true;
}
