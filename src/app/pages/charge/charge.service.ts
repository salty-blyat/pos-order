import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";

export interface Charge {
  id?: number;
  code?: string;
  name?: string;
  unitId?: number;
  chargeRate?: number;
  chargeTypeId?: number;
  unitName?: string;
  chargeTypeName?: string;
  chargeTypeNameEn?: string;
  ordering?: number;
  note?: string;
}
@Injectable({
  providedIn: "root",
})
export class ChargeService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("charge", http, settingService);
  }
}
