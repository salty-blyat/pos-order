import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../helpers/auth.service';
import { Branch, BranchService } from './branch.service';
import { BranchUiService } from './branch-ui.service';
import { BaseSelectComponent } from '../../utils/components/base-select.component';
import { BRANCH_STORAGE_KEY } from '../../const';
import { LocalStorageService } from '../../utils/services/localStorage.service';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BranchSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-branch-select',
    template: `
    <nz-select
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText = $event; param.pageIndex = 1; search()"
      [nzDisabled]="disabled"
      style="width: 100%"
    >
      <nz-option
        *ngIf="showAllOption && canShowAllBranches"
        [nzValue]="0"
        [nzLabel]="'AllBranch' | translate"
      >
        <span>{{ 'AllBranch' | translate }}</span>
      </nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item?.name + ''"
      >
        <span class="name">{{ item.name }}</span>
      </nz-option>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ 'Loading' | translate }}
      </nz-option>
      <ng-template #actionItem>
        <!-- <a
          *ngIf="addOption && canAdd"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ 'Add' | translate }}
        </a> -->
      </ng-template>
    </nz-select>
  `,
    styles: [
        `
      nz-select {
        width: 100%;
      }
      .item-action {
        flex: 0 0 auto;
        padding: 6px 8px;
        display: block;
      }
      .code {
        font-weight: bolder;
      }
    `,
    ],
    standalone: false
})
export class BranchSelectComponent
  extends BaseSelectComponent<Branch>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(
    override service: BranchService,
    private sessionStorageServices: SessionStorageService,
    private localStorageService: LocalStorageService,
    public uiService: BranchUiService
  ) {
    super(service, sessionStorageServices, 'branch-filter', 'AllBranch');
  }

  canAdd = false;
  canShowAllBranches = false;
  override ngOnInit() {
    let branchSession: any[] =
      this.sessionStorageServices.getValue('branch-filter');
    let branchSessionStorage;
    if (branchSession) {
      branchSessionStorage = branchSession.find(
        (x) => x.key === this.storageKey
      );
    }
    if (!branchSessionStorage || !branchSessionStorage.value) {
      let branch: Branch =
        this.localStorageService.getValue(BRANCH_STORAGE_KEY);
      this.selectedValue = branch.id ?? 0;
      this.search();
      this.onModalChange();
    }
    super.ngOnInit();
  }
  override search() {
    this.loading = true;
    this.param.filters = JSON.stringify([
      { field: 'search', operator: 'contains', value: this.searchText },
    ]);
    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service
      .getallBranchList(this.param)
      .subscribe((result: { results: Branch[] }) => {
        this.loading = false;
        this.lists = result.results;
      });
  }
}
