import { BaseApiService } from "../../utils/services/base-api.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export interface MemberClass {
  id?: number;
  code?: string;
  name?: string;
  note?: string;
}

@Injectable({
  providedIn: "root",
})
export class MemberClassService extends BaseApiService<MemberClass> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("memberclass", http, settingService);
  }
}
