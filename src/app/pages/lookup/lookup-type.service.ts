import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";

export enum LOOKUP_TYPE {
  Gender = 1,
  Nationality = 2,
  AccountType = 38001,
  TransactionType = 38002,
  CardStatus = 38003,
  OfferType = 38004,
  RedeemStatus = 38005,
}
export enum AccountTypes {
  Wallet = 1,
  Point = 2,
  Cashback = 3,
}
export enum TransactionTypes {
  Adjust = 1,
  Topup = 101,
  Order = 102,
  Earn = 201,
  Redeem = 202,
}

export enum CardStatuses {
  Pending = 1,
  Active = 2,
  Suspended = 3,
  Expired = 5,
  Removed = 4,
}

export enum OfferType {
  Gift = 1,
  Coupon = 2,
  Voucher = 3,
}

export enum RedeemStatuses {
  Processing = 1,
  Used = 2,
  Removed = 4,
}
export interface LookupType {
  id?: number;
  name?: string;
  nameEn?: string;
}
@Injectable({
  providedIn: "root",
})
export class LookupTypeService extends BaseApiService<any> {
  constructor(http: HttpClient, settingService: SettingService) {
    super("lookuptype", http, settingService);
  }
}
