import {Component, forwardRef, Input, OnDestroy, OnInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { Currency, CurrencyService } from "./currency.service";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";



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
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText = $event; param.pageIndex = 1; search()"
      [nzDisabled] = "disabled"
      style="width: 100%"
    >
      <nz-option *ngIf="showAllOption" [nzValue]="0" [nzLabel]="'-' | translate"></nz-option>
      <nz-option *ngFor="let item of lists" nzCustomContent [nzValue]="item.id" [nzLabel]="item?.code + ''">
        <span class="b-name">{{item.code}}</span>
      </nz-option>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{'Loading' | translate}}
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
    .b-code{
      font-weight: bolder;
    }
    .b-name{
      font-size: 12px;
    }
  `],
    standalone: false
})


export class CurrencySelectComponent extends BaseSelectComponent<Currency> implements OnInit , ControlValueAccessor, OnDestroy{

  constructor(
      service: CurrencyService,
      sessionStorageService: SessionStorageService,
      ) {
    super(service, sessionStorageService, "seller-filter", "-");
  }

  @Input() id:number = 0;

  override ngOnInit() {
    if (this.id){
      this.selectedValue = this.id;
      this.search();
      this.onModalChange();
    }
  }
}

