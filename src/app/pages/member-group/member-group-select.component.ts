import {Component, computed, forwardRef, signal, ViewEncapsulation} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms"; 
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service"; 
import {   MemberGroup, MemberGroupService } from "./member-group.service";
import {  MemberGroupUiService } from "./member-group-ui.service";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys } from "../../const";

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MemberGroupSelectComponent),
            multi: true
        }
    ],
    selector: 'app-member-group-select',
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
            <nz-option *ngIf="showAllOption()" [nzValue]="0" [nzLabel]="'AllMemberGroup' | translate"></nz-option>
            <nz-option *ngFor="let item of lists()" nzCustomContent [nzValue]="item.id" [nzLabel]="item?.name + ''">
                <span>{{ item.name }}</span>
            </nz-option>
            <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
                <i nz-icon nzType="loading" class="loading-icon"></i>
                {{ 'Loading' | translate }}
            </nz-option>
            <ng-template #actionItem>
               <a *ngIf="addOption() && isMemberGroupAdd()" (click)=" uiService.showAdd(componentId)" class="item-action"> 
                 <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
               </a>  
            </ng-template>
        </nz-select>
    `,
    styles: [`
    nz-select {
      width: 100%;
    }
    .item-action {
      flex: 0 0 auto;
      padding: 6px 8px;
      display: block;
    }
  `],
    standalone: false,
    encapsulation: ViewEncapsulation.None
})


export class MemberGroupSelectComponent extends BaseSelectComponent<MemberGroup>{
  constructor(
      service: MemberGroupService,
      uiService: MemberGroupUiService,
      sessionStorageService: SessionStorageService,
      private authService: AuthService
      ) {
    super(service, uiService, sessionStorageService, "member-group-filter", "all-member-group");
  }

  isMemberGroupAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__MEMBER__ADD));
  
  id = signal<number>(0);

  override ngOnInit() {
    if (this.id()){
      this.selected.set(this.id());
      this.search();
      this.onModalChange();
    }
    super.ngOnInit();
  }
}

