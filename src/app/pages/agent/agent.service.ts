import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";

export interface Agent {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  parentId?: number;
  pathName?: string;
  note?: string;
  id?: number;
}

@Injectable({
  providedIn: "root",
})
export class AgentService extends BaseApiService<Agent> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("agent", http, settingService);
  }
}
