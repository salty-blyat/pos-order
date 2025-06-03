import { BaseApiService } from "../../utils/services/base-api.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export enum DiscountType {
  Percentage = 1,
  Currency = 2,
}
export interface Currency {
  id?: number;
  symbol?: string;
  code?: string;
  name?: string;
  format?: string;
  rounding?: number;
  exchangeRate?: number;
}

@Injectable({
  providedIn: "root",
})
export class CurrencyService extends BaseApiService<Currency> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("currency", http, settingService);
  }
  roundedCurrency(number: number, rounding: number) {
    if (typeof number === "string") number = parseFloat(number);
    const toFloat: number = parseFloat(number.toFixed(4));
    const rounded = Math.floor(parseFloat((toFloat / rounding).toPrecision(6)));
    const result = rounded * rounding;
    return parseFloat(result.toFixed(4));
  }

  roundedDecimal(number: number) {
    if (typeof number === "string") number = parseFloat(number);
    const toFloat: number = parseFloat(number.toFixed(4));
    const rounded = Math.floor(parseFloat((toFloat / 0.01).toPrecision(6)));
    const result = rounded * 0.01;
    return parseFloat(result.toFixed(4));
  }
}
