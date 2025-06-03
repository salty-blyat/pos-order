import {
  Component,
  computed,
  forwardRef,
  ViewEncapsulation,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { AutoNumber, AutoNumberService } from "./auto-number.service";
import { AutoNumberUiService } from "./auto-number-ui.service";
import { AuthService } from "../../helpers/auth.service";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { AuthKeys } from "../../const";
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoNumberSelectComponent),
      multi: true,
    },
  ],
  selector: "app-auto-number-select",
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
        [nzLabel]="showAllLabel() | translate"
      ></nz-option>
      <nz-option *ngIf="!showAllOption" [nzValue]="0" nzLabel="-">-</nz-option>
      <nz-option
        *ngFor="let item of lists()"
        [nzValue]="item.id"
        [nzLabel]="item?.name + ''"
      >
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isAutoNumberAdd()"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
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
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class AutoNumberSelectComponent extends BaseSelectComponent<AutoNumber> {
  constructor(
    service: AutoNumberService,
    sessionStorageService: SessionStorageService,
    uiService: AutoNumberUiService,
    private authService: AuthService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "auto-number-filter",
      "all-auto-numbers"
    );
  }

  isAutoNumberAdd = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__AUTO_NUMBER__ADD));
}
