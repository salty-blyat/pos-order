import { BaseApiService } from "../../utils/services/base-api.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export interface Building {
  id?: number;
  code?: string;
  buildingName?: string;
  note?: string;
}
@Injectable({
  providedIn: "root",
})
export class BuildingService extends BaseApiService<Building> {
  constructor(private http: HttpClient, settingService: SettingService) {
    // replace the '' with building later
    super("/", http, settingService);
  }
}
