import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Branch, BranchService } from './branch.service';
import { TranslateService } from '@ngx-translate/core';
import { BRANCH_STORAGE_KEY } from '../../const';
import { AuthService } from '../../helpers/auth.service';
import { BaseMultipleSelectComponent } from '../../utils/components/base-multiple-select.component';
import { LocalStorageService } from '../../utils/services/localStorage.service';

@Component({
    selector: 'app-branch-multiple-select',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BaseMultipleSelectComponent),
            multi: true,
        },
    ],
    template: `
    <nz-select
      #selectComponent
      nzShowSearch
      [nzMaxTagCount]="nzMaxCount"
      nzMode="multiple"
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange($event)"
      (nzOnSearch)="searchText = $event; param.pageIndex = 1; search()"
      [nzDisabled]="disabled"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      [nzDropdownRender]="actionItem"
      (nzOpenChange)="openChange($event)"
      [nzRemoveIcon]="removeIcon"
      [ngClass]="{ 'hide-selected-values': hideSelectedValues }"
      style="width: 100%"
      (nzScrollToBottom)="searchMore()"
    >
      <nz-option
        [nzValue]="0"
        [nzLabel]="'AllBranch' | translate"
        *ngIf="canShowAllBranches"
      >
      </nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item.code + ' ' + item.name"
      >
        <span class="code">{{ item.code }}</span>
        <span class="name">{{ item.name }}</span>
      </nz-option>
    </nz-select>
    <ng-template #actionItem>
      <nz-spin *ngIf="loading" style="bottom: 8px;"></nz-spin>
      <div class="div-bottom">
        <a
          nz-button
          nzType="primary"
          (click)="ok()"
          style="margin-right: 5px"
          [disabled]="!canShowAllBranches && selectedValue[0] === 0"
        >
          {{ 'Ok' | translate }}
        </a>
        <a nz-button (click)="cancel()">
          {{ 'Cancel' | translate }}
        </a>
      </div>
    </ng-template>
    <ng-template #tagPlaceHolder let-selectedList>
      {{ selectedList.length }}
      {{
        (selectedList.length > 1 ? 'items' : 'item') + ' selected' | translate
      }}
    </ng-template>
    <ng-template #removeIcon>
      <span
        *ngIf="canShowAllBranches && !selectedValue.includes(0)"
        nz-icon
        nzType="close"
        nzTheme="outline"
      ></span>
    </ng-template>
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
        font-size: 12px;
      }
      .name {
        padding-left: 5px;
      }
      ::ng-deep cdk-virtual-scroll-viewport {
        min-height: 34px;
      }
      :host ::ng-deep .ant-select-multiple .ant-select-selection-item {
        border: 0 !important;
      }
      :host ::ng-deep .ant-select-multiple .ant-select-selection-item {
        max-width: 120px !important;
      }
      .div-bottom {
        padding: 5px 12px;
        border-top: 1px solid #f0f0f0;
        position: relative;
        z-index: 50;
        background-color: white;
      }
      .hide-selected-values ::ng-deep .ant-select-selection-item {
        display: none;
      }
    `,
    ],
    standalone: false
})
export class BranchMultipleSelectComponent
  extends BaseMultipleSelectComponent<Branch>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(
    translate: TranslateService,
    override service: BranchService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    super(translate, service);
  }
  branch!: Branch;
  canShowAllBranches = true;
  override ngOnInit(): void {
    this.branch = this.localStorageService.getValue(BRANCH_STORAGE_KEY);

    if (!this.canShowAllBranches && this.selectedValue[0] === 0) {
      this.selectedValue = [this.branch.id];
      this.oldSelectedValue = this.selectedValue;
    }

    super.ngOnInit();
  }
  override search(callBack: Function = () => {}) {
    this.loading = true;
    const filters: any[] = [
      { field: 'search', operator: 'contains', value: this.searchText },
    ];
    this.param.filters = JSON.stringify(filters);
    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service.getallBranchList(this.param).subscribe((result: any) => {
      this.param = result.param;
      this.lists = [
        ...this.lists,
        ...result.results.filter(
          (x: any) => !this.lists.map((x) => x.id).includes(x.id)
        ),
      ];
      let ids = this.lists.map((item) => {
        return item.id;
      });
      if (
        this.selectedValue.filter((x) => !ids.includes(x)).length > 0 &&
        !this.searchText
      ) {
        let idsFilter =
          this.selectedValue.filter((x) => !ids.includes(x)) ?? [];
        const filters: any[] = [];
        if (idsFilter[0] != 0) {
          filters.push({
            field: 'ids',
            operator: 'contains',
            value: JSON.stringify(idsFilter),
          });
        }
        this.param.filters = JSON.stringify(filters);
        this.service.getallBranchList(this.param).subscribe({
          next: (result: any) => {
            this.loading = false;
            return this.lists.push(
              ...result.results.filter(
                (x: any) => !this.lists.map((x) => x.id).includes(x.id)
              )
            );
          },
          error: (error: any) => console.log(error),
        });
      } else {
        this.loading = false;
      }
      callBack();
    });
  }
}
