import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Account, AccountService } from "./account.service";
import { AccountUiService } from "./account-ui.service";
import { TranslateService } from "@ngx-translate/core";
import { Filter } from "../../utils/services/base-api.service";
import { AccountTypes } from "../lookup/lookup-type.service";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountSelectComponent),
      multi: true,
    },
  ],
  selector: "app-account-select",
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
        [nzLabel]="'AllAccount' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="
          (this.translate.currentLang === 'km'
            ? item.accountTypeNameKh || item.accountTypeNameEn
            : item.accountTypeNameEn || item.accountTypeNameKh) || ''
        "
      >
        <div nz-flex nzJustify="space-between">
          <span>
            {{
              (this.translate.currentLang === "km"
                ? item.accountTypeNameKh || item.accountTypeNameEn
                : item.accountTypeNameEn || item.accountTypeNameKh) || ""
            }}
          </span>
          <span>
            @if (item.accountType == AccountTypes.Point){
            <span> {{ item.balance + " pts" }}</span>
            } @else if (item.accountType == AccountTypes.Wallet){
            <span> {{ item.balance + " $" }}</span>
            }
          </span>
        </div>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isAccountAdd()"
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
      .b-name {
        font-size: 12px;
        padding-left: 5px;
      }
      ::ng-deep cdk-virtual-scroll-viewport {
        min-height: 34px;
      }
    `,
  ],

  encapsulation: ViewEncapsulation.None,
})
export class AccountSelectComponent
  extends BaseSelectComponent<Account>
  implements OnChanges
{
  constructor(
    service: AccountService,
    uiService: AccountUiService,
    public translate: TranslateService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "account-filter",
      "all-account"
    );
  }
  @Input() parentId = 0;
  isAccountAdd = signal<boolean>(true);

  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [];
    if (this.parentId) {
      filters.push({
        field: "memberId",
        operator: "eq",
        value: this.parentId,
      });
    }
    return filters;
  }

  override search(delay: number = 50) {
    if (this.isLoading()) return;
    if (!this.parentId) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.param().filters = this.buildFilters();
      if (this.searchText() && this.param().pageIndex === 1) {
        this.lists.set([]);
      }
      this.service.search(this.param()).subscribe({
        next: (result: { results: any[] }) => {
          this.isLoading.set(false);
          this.lists.set(result.results);
          if (
            this.isDefault() &&
            this.selected() == 0 &&
            this.lists().length > 0
          ) {
            this.selected.set(this.lists()[0]?.id!);
            this.onModalChange();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, delay);
  }

  readonly AccountTypes = AccountTypes;
  ngOnChanges(changes: SimpleChanges): void {
    this.selected.set(0);
    this.search();
  }
}
