import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SettingService } from "../../app-setting";
import { map } from "rxjs/operators";
import { LocalStorageService } from "../../utils/services/localStorage.service";
import { CurrencyService } from "../currency/currency.service";
import { SharedVar } from "../../utils/services/logic-helper.service";
export interface CurrentProfile {
  name?: string;
  url?: string;
  contact?: string;
  address?: string;
}

export interface SystemSetting {
  id?: number;
  key?: string;
  note?: string;
  value?: string;
}

export interface CompanyInfo {
  name?: string;
  nameKh?: string;
  logo?: string;
  phone?: string;
  address?: string;
  addressKh?: string;
  website?: string;
  email?: string;
}

export interface SystemSettingInfo {
  itemAutoId?: number;
  customerAutoId?: number;
  invoiceAutoId?: number;
  receiptAutoId?: number;
  invoiceTemplateId?: number;
  receiptTemplateId?: number;
  ftpUrl?: number;
  ftpUsername?: number;
  ftpPassword?: number;
}

export const SETTING_KEY = {
  CompanyName: "CompanyName",
  CompanyNameEn: "CompanyNameEn",
  CompanyAddress: "CompanyAddress",
  CompanyAddressEn: "CompanyAddressEn",
  CompanyPhone: "CompanyPhone",
  CompanyLogo: "CompanyLogo",
  CompanyEmail: "CompanyEmail",
  CompanyWebsite: "CompanyWebsite",
  RequiredPhone: "required_phone",
  RequiredAddress: "required_address",
  MainCurrency: "MainCurrencyId",
  SecondCurrency: "SecondaryCurrencyId",
  ExchangeRate: "SecondaryCurrencyExchangeRate",
  ExchangeRateDisplay: "ExchangeRateDisplay",
  CustomerDefaultId: "DefaultCustomerId",
  BlockAutoId: "BlockAutoId",
  StaffAutoId: "StaffAutoId",
  PavrEnable: "PavrEnable",
  PavrUrl: "PavrUrl",
  MemberUnitAutoId: "MemberUnitAutoId",
  MemberLevelAutoId: "MemberLevelAutoId",
  ChargesAutoId: "ChargesAutoId",
  ItemAutoId: "ItemAutoId",
  MemberAutoId: "MemberAutoId",
  MeterReadingAutoId: "MeterReadingAutoId", 
};

export interface Setting {
  key?: string;
  value?: string;
  section?: string;
}

export class SettingList {
  constructor(public items: Setting[]) {}

  get<T>(key: string, defaultValue: T) {
    let tmp = this.items.find((x) => x.key == key)?.value ?? defaultValue;
    if (typeof defaultValue === "number") {
      return +tmp;
    }
    return tmp;
  }

  set(key: string, newValue: any) {
    let existingSetting = this.items.find((x) => x.key === key);

    if (existingSetting) {
      existingSetting.value = newValue;
    } else {
      const newSetting: Setting = { key, value: newValue };
      this.items.push(newSetting);
    }
  }

  toObject() {
    let obj: any = {};
    this.items.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }
}

@Injectable({
  providedIn: "root",
})
export class SystemSettingService {
  constructor(
    private http: HttpClient,
    private settingService: SettingService,
    private localStorageService: LocalStorageService,
    private currencyService: CurrencyService
  ) {}
  private currentSetting!: SettingList;

  public getUrl = (): string =>
    `${this.settingService.setting.BASE_API_URL}/setting`;

  public getByItems(keys: string[]): Observable<SettingList> {
    return this.http
      .get<Setting[]>(`${this.settingService.setting.BASE_API_URL}/setting`)
      .pipe(
        map((result: Setting[]) => {
          let tmp = result;
          if (keys.length) {
            tmp = result.filter((x: any) => keys.includes(x.key));
            tmp = tmp.map((x: any) => {
              try {
                if (!isNaN(x.value)) {
                  x.value = String(+x.value);
                }
              } catch {}
              return x;
            });
          }
          return new SettingList(tmp);
        })
      );
  }

  find(key: string): Observable<string> {
    return this.http.get<string>(
      `${this.settingService.setting.BASE_API_URL}/setting/${key}`
    );
  }

  getAll(): Observable<Setting[]> {
    return this.http.get<Setting[]>(
      `${this.settingService.setting.BASE_API_URL}/setting`
    );
  }

  updateByItems(model: Setting[]): Observable<any> {
    return this.http.put(
      `${this.settingService.setting.BASE_API_URL}/setting`,
      model
    );
  }

  get current(): SettingList {
    // console.log(this.currentSetting);
    if (!this.currentSetting) {
      // throw new Error('currentSetting is not yet initialized!');
      return new SettingList([]);
    }
    return this.currentSetting;
  }

  initCurrentSetting(): Observable<SettingList> {
    return this.getByItems([]).pipe(
      map((result) => {
        this.currentSetting = result;
        return result;
      })
    );
  }

  pavrTestUrl(url: string): Observable<any> {
    return this.http.post(
      `${this.settingService.setting.BASE_API_URL}/pavrapi/test`,
      {
        url,
      }
    );
  }
}
