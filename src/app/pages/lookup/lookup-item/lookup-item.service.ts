import { Inject, Injectable } from "@angular/core";
import { BaseApiService } from "../../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../../app-setting";

export interface LookupItem {
  id?: number;
  valueId?: number;
  lookupTypeId?: number;
  name?: string;
  nameEn?: string;
  image?: string;
  color?: string;
  ordering?: number;
  note?: string;
  canRemove?: boolean;
}

export interface Image {
  uid?: string;
  url?: string;
  name?: string;
  type?: string;
}

@Injectable({ providedIn: "root" })
export class LookupItemService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("lookupitem", http, settingService);
  }
}
