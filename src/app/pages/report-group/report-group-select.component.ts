import {Component, computed, forwardRef, ViewEncapsulation} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { ReportGroup, ReportGroupService } from './report-group.service';
import { ReportGroupUiService } from './report-group-ui.service';
import { AuthService } from '../../helpers/auth.service';
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { AuthKeys } from '../../const';

  
  @Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ReportGroupSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-report-group-select',
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
          [nzLabel]="'All Report Groups' | translate"
        ></nz-option>
        <nz-option
          *ngFor="let item of lists()"
          [nzValue]="item.id"
          [nzLabel]="item?.name + ''"
        >
        </nz-option>
        <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
          <i nz-icon nzType="loading" class="loading-icon"></i>
          {{ 'Loading' | translate }}
        </nz-option>
        <ng-template #actionItem>
          <a
            *ngIf="addOption() && isReportGroupAdd()"
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
  export class ReportGroupSelectComponent extends BaseSelectComponent<ReportGroup>{
    constructor(
       service: ReportGroupService,
       sessionStorageService: SessionStorageService,
       uiService: ReportGroupUiService,
      private authService: AuthService
    ) {
      super(service, uiService, sessionStorageService, 'report-group-filter', 'all-report-groups')
    }
 
    isReportGroupAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT_GROUP__ADD));

  }
  