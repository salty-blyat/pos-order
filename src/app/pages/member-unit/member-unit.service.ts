import { Injectable } from "@angular/core";
import { BaseApiService, PullResult } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface MemberUnit {
  id?: number;
  code?: string;
  name?: string;
  note?: string;
  ordering?: number;
}

@Injectable({ providedIn: "root" })
export class MemberUnitService extends BaseApiService<MemberUnit> {
  constructor(public http: HttpClient, settingService: SettingService) {
    super("memberunit", http, settingService);
  } 
}
