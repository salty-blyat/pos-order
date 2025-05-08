import { BaseApiService } from "../../utils/services/base-api.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export interface Location {
  id?: number;
  code?: string;
  name?: string;
  branchId?: number;
  branchName?: string;
  note?: string;
}

@Injectable({
  providedIn: "root",
})
export class LocationService extends BaseApiService<Location> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("location", http, settingService);
  }
}
