import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export interface Item {
  id?: number;
  code?: string;
  name?: string;
  image?: string;
  itemTypeId?: number;
  itemTypeName?: string;
  isTrackSerial?: boolean;
  note?: string;
}

@Injectable({ providedIn: "root" })
export class ItemService extends BaseApiService<Item> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("item", http, settingService);
  }
}
