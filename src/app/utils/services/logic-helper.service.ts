import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SharedDomain } from './base-api.service';
import { SessionStorageService } from './sessionStorage.service';

export const SettingKey = {
  ITEM_AUTOID: 'ItemAutoId',
  INVOICE_AUTOID: 'invoice-autoid',
  CUSTOMER_AUTOID: 'customer-autoid',
  QUOTATION_AUTOID: 'quotation-autoid',
  RECEIPT_AUTOID: 'receipt-autoid',

  BILL_NO: 'bill-autoid',
  BILL_RECEIPT_NO: 'bill-receipt-autoid',
  STOCK_RECEIVE_NO: 'stock-receive-autoid',
  STOCK_DELIVERY_NO: 'stock-delivery-autoid',
  STOCK_TRANSFER_NO: 'stock-transfer-autoid',
  STOCK_ADJUSTMENT_NO: 'stock-adjustment-autoid',
  STOCK_COUNT_NO: 'stock-count-autoid',

  TENANT_URL: 'tenant-logo',
  TENANT_NAME: 'tenant-name',
  TENANT_ADDRESS: 'tenant-address',
  TENANT_PHONE: 'tenant-phone',

  INVOICE_TEMPLATE: 'invoice-templateid',
  RECEIPT_TEMPLATE: 'receipt-templateid',
  QUOTATION_TEMPLATE: 'quotation-templateid',

  INV_IMAGE_VISIBLE: 'inv-img-visible',
  INV_DESC_VISIBLE: 'inv-desc-visible',

  BILL_IMAGE_VISIBLE: 'rpt-img-visible',
  BILL_DESC_VISIBLE: 'rpt-desc-visible',

  QUOTE_IMAGE_VISIBLE: 'quote-img-visible',
  QUOTE_DESC_VISIBLE: 'quote-desc-visible',
  CUSTOMER_REQUIRE_PHONE: 'customer-require-phone',
  CUSTOMER_REQUIRE_ADDRESS: 'customer-require-address',
};

export const SharedVar = {
  LANGUAGE: 'lang',
  RECENT_FILTER: 'recent-filter',
  SETTINGS: 'settings',
  CURRENCIES: 'currencies',
};

export interface Setting {
  key?: string;
  value?: string;
  section?: string;
}

export interface IRecentFilter {
  key?: string;
  val?: any;
}

// export interface Setting {
//   key?: string;
//   value?: string;
//   section?: string;
// }

export interface CurrencyView extends SharedDomain {
  code?: string;
  symbol?: string;
  rounding?: number;
  exchangeRate?: number;
  format?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogicHelperService {
  tenantURL: BehaviorSubject<string>;
  tenantName: BehaviorSubject<string>;
  recentFilter: BehaviorSubject<IRecentFilter[]>;
  // currencies
  currencies: BehaviorSubject<CurrencyView[]>;
  // system settings
  settings: BehaviorSubject<Setting[]>;

  constructor(
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {
    this.recentFilter = new BehaviorSubject<IRecentFilter[]>(
      // @ts-ignore
      JSON.parse(localStorage.getItem(SharedVar.RECENT_FILTER)) ?? []
    );

    this.currencies = new BehaviorSubject<CurrencyView[]>(
      this.sessionStorageService.getValue(SharedVar.RECENT_FILTER) ?? []
    );

    this.settings = new BehaviorSubject<Setting[]>(
      this.sessionStorageService.getValue(SharedVar.SETTINGS)
    );

    this.tenantURL = new BehaviorSubject<string>(
      this.settingByKey(SettingKey.TENANT_URL)?.value ?? ''
    );

    this.tenantName = new BehaviorSubject<string>(
      this.settingByKey(SettingKey.TENANT_NAME)?.value ?? ''
    );
  }

  redirectURL(option: {
    url: string;
    param?: string | number;
    query?: {};
  }): void {
    if (option.param === null || option.param === undefined) {
      this.router.navigateByUrl(option.url).then();
    } else if (option.query === null || option.query === undefined) {
      this.router.navigate([option.url, option.param]).then();
    } else {
      this.router.navigate([option.url, { queryParams: option.query }]).then();
    }
  }

  emmitNextTenantURL(nextValue: string): void {
    this.tenantURL.next(nextValue);
  }

  recentFilterValue(key: string): any {
    return this.recentFilter.value.find((item) => item.key === key)?.val ?? 0;
  }

  emitRecentFilter(recent: IRecentFilter): void {
    // @ts-ignore
    const recentFilters: IRecentFilter[] =
      JSON.parse(localStorage.getItem(SharedVar.RECENT_FILTER)!) ?? [];

    const exist = recentFilters.find((item) => item.key === recent.key);
    if (exist) {
      recentFilters.forEach((item) => {
        if (item.key === exist.key) {
          item.val = recent.val;
        }
      });
    } else {
      recentFilters.push(recent);
    }

    this.recentFilter.next(recentFilters);
    localStorage.setItem(
      SharedVar.RECENT_FILTER,
      JSON.stringify(recentFilters)
    );
  }

  settingByKey(key: string): Setting {
    // console.log(this.settings);

    if (this.settings.value) {
      // @ts-ignore
      return this.settings.value.find((item) => item.key === key);
    } else {
      return {};
    }
  }
}
