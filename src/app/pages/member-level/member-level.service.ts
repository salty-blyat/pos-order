import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";
import { BaseApiService } from "../../utils/services/base-api.service";
export interface MemberLevel {
  id?: number;
  levelStay?: number;
  name?: string;
  note?: string;
  ordering?: number;
}

@Injectable({ providedIn: "root" })
export class MemberLevelService extends BaseApiService<MemberLevel> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("memberlevel", http, settingService);
  }
}
