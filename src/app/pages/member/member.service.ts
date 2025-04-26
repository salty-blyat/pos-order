import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export interface Member {
  id?: number;
  code?: string;
  name?: string;
  sexId?: number;
  unitId?: number;
  groupId?: number;
  nationality?: number;
  phone?: string;
  memberLevelId?: number;
  note?: string;
}

@Injectable({ providedIn: "root" })
export class MemberService extends BaseApiService<any> {
  constructor(http: HttpClient, settingService: SettingService) {
    super("member", http, settingService);
  }
}
