import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";

export interface Offer {
  code?: string;
  name?: string;
  offerGroupId?: number;
  offerType?: number;
  note?: string;
  maxQty?: number;
  redeemedQty?: number;
  redeemWith?: number;
  redeemCost?: number;
  redeemMinBalance?: number;
  offerStartAt?: string;
  offerEndAt?: string;
  photo?: string;
  id?: number;
  offerGroupName?: string;
  offerTypeNameKh?: string;
  offerTypeNameEn?: string;
  redeemWithNameKh?: string;
  redeemWithNameEn?: string;
}

@Injectable({
  providedIn: "root",
})
export class OfferService extends BaseApiService<Offer> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("offer", http, settingService);
  }
}
