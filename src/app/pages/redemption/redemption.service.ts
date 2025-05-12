import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";
import { BaseApiService } from "../../utils/services/base-api.service";

export interface Redemption {
  accountId?: number;
  redeemNo?: string;
  redeemedDate?: string;
  refNo?: string;
  offerId?: number;
  qty?: number;
  amount?: number;
  note?: string;
  status?: 1;
  locationId?: number;
  id?: number;
  locationName?: string;
  offerName?: string;
  statusNameKh?: string;
  statusNameEn?: string;
}
@Injectable({
  providedIn: "root",
})
export class RedemptionService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("redemption", http, settingService);
  }
}
