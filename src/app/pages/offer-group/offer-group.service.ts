import { BaseApiService } from "../../utils/services/base-api.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export interface OfferGroup {
  name?: string;
  note?: string;
  image?: string;
  id?: number;
}

@Injectable({
  providedIn: "root",
})
export class OfferGroupService extends BaseApiService<OfferGroup> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("offergroup", http, settingService);
  }
}
