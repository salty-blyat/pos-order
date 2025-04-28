import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";

export interface RoomChargeType {
  id?: number;
  roomName?: string;
  chargeType?: string;
  limit?: number;
}

@Injectable({
  providedIn: "root",
})
export class RoomChargeTypeService extends BaseApiService<RoomChargeType> {
  constructor(private http: HttpClient, settingService: SettingService) {
    // super("roomchargetype", http, settingService);
    super("", http, settingService);
  }
}
