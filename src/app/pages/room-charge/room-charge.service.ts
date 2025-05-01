import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";

export interface RoomCharge {
  roomId?: number;
  chargeId?: number;
  serial?: string;
  startDate?: string;
  endDate?: string;
  statusId?: number;
  totalLimit?: number;
  id?: number;
  roomNumber?: string;
  chargeName?: string;
  statusName?: string;
  statusNameEn?: string;
}

@Injectable({
  providedIn: "root",
})
export class RoomChargeService extends BaseApiService<RoomCharge> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("roomcharge", http, settingService);
  }
}
