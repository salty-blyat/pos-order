import {
  Component,
  forwardRef,
  input,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { LookupItem } from "../lookup/lookup-item/lookup-item.service";
import { AccountService } from "../account/account.service";
import { AccountUiService } from "../account/account-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TransactionTypeSelectComponent),
      multi: true,
    },
  ],
  selector: "app-transaction-type-select",
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
        [nzLabel]="'AllTransactionType' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item.valueId"
        [nzLabel]="
          (this.translate.currentLang === 'km'
            ? item.name || item.nameEn
            : item.nameEn || item.name) || ''
        "
      >
        <div nz-flex nzAlign="center" nzGap="small">
          <span class="b-name">
            {{
              (this.translate.currentLang === "km"
                ? item.name || item.nameEn
                : item.nameEn || item.name) || ""
            }}</span
          >
        </div>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isTransactionTypeAdd()"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
        </a>
      </ng-template>
    </nz-select>
  `,
  standalone: false,
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
      .b-code {
        font-weight: bolder;
      }
      ::ng-deep cdk-virtual-scroll-viewport {
        min-height: 34px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionTypeSelectComponent extends BaseSelectComponent<LookupItem> {
  constructor(
    override service: AccountService,
    uiService: AccountUiService,
    sessionStorageService: SessionStorageService,
    public translate: TranslateService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "transaction-type-filter",
      "all-transaction-type"
    );
  }

  accountType = input<LOOKUP_TYPE>(LOOKUP_TYPE.AccountType);

  override search(delay: number = 50) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.param().filters = this.buildFilters();
      if (this.searchText() && this.param().pageIndex === 1) {
        this.lists.set([]);
      }
      this.param().filters = JSON.stringify([
        { field: "Name", operator: "contains", value: this.searchText() },
        { field: "accountType", operator: "eq", value: this.accountType() },
      ]);
      this.service.getTransType(this.param()).subscribe({
        next: (result: { results: LookupItem[] }) => {
          this.isLoading.set(false);
          this.lists.set(result.results);

          if (
            this.isDefault() &&
            this.selected() == 0 &&
            this.lists().length > 0
          ) {
            this.selected.set(this.lists()[0]?.id!);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, delay);
  }
  isTransactionTypeAdd = signal<boolean>(true);
}
