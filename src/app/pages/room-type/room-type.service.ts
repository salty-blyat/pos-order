import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";


export interface RoomType {
  id?: number;
  name?: string
  occupancy?: number
  maxOccupancy?: number
  netArea?: number
  grossArea?: number
  note?: string
}

@Injectable({
  providedIn: "root",
})
export class RoomTypeService extends BaseApiService<RoomType> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("roomtype", http, settingService);
  }
}
