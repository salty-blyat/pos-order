import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";

export interface ItemType {
  id?: number;
  code?: string;
  name?: string;
  note?: string;
}

@Injectable({ providedIn: "root" })
export class ItemTypeService extends BaseApiService<ItemType> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("itemtype", http, settingService);
  }
}
