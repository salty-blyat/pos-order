import {Component, forwardRef, signal, ViewEncapsulation} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import { Currency, CurrencyService } from "./currency.service";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import {CurrencyUiService} from "./currency-ui.service";

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CurrencySelectComponent),
            multi: true
        }
    ],
    selector: 'app-currency-select',
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
            <nz-option *ngIf="showAllOption()" [nzValue]="0" [nzLabel]="'-' | translate"></nz-option>
            <nz-option *ngFor="let item of lists()" nzCustomContent [nzValue]="item.id" [nzLabel]="item?.code + ''">
                <span>{{ item.code }}</span>
            </nz-option>
            <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
                <i nz-icon nzType="loading" class="loading-icon"></i>
                {{ 'Loading' | translate }}
            </nz-option>
            <ng-template #actionItem>
                <!--        <a *ngIf="addOption && isBranchAdd" (click)=" uiService.showAdd(componentId)" class="item-action">-->
                <!--          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}-->
                <!--        </a>-->
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


export class CurrencySelectComponent extends BaseSelectComponent<Currency>{
  constructor(
      service: CurrencyService,
      uiService: CurrencyUiService,
      sessionStorageService: SessionStorageService,
      ) {
    super(service, uiService, sessionStorageService, "currency-filter", "all-currency");
  }

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

