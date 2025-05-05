import {Component, computed, forwardRef, signal, ViewEncapsulation} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { MemberLevel, MemberLevelService } from './member-level.service';
import { MemberLevelUiService } from './member-level-ui.service';
import {BaseSelectComponent} from "../../utils/components/base-select.component";
import { AuthService } from '../../helpers/auth.service';
import { AuthKeys } from '../../const';
  
  @Component({
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MemberLevelSelectComponent),
        multi: true,
      },
    ],
    selector: 'app-member-level-select',
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
            [nzLabel]="'AllMemberLevel' | translate"
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
              *ngIf="addOption() && isMemberLevelAdd()"
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
  export class MemberLevelSelectComponent extends BaseSelectComponent<MemberLevel>{
    constructor(
      service: MemberLevelService,
      uiService: MemberLevelUiService,
      sessionStorageService: SessionStorageService,
      private authService: AuthService
    ) {
      super(service, uiService, sessionStorageService, "member-level-filter", "all-member-level")
    }

    isMemberLevelAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__MEMBER_LEVEL__ADD));
  }
  
  