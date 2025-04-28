import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";

export interface Member {
  id?: number;
  code?: string;
  name?: string;
  sexId?: number;
  unit?: string;
  level?: string;
  phone?: string;
  sex?: string;
  nameEn?: string
  photo?: string
  email?: string
  birthDate?: string
  idNo?: string
  nssfId?: string
  address?: string
  unitId?: number
  groupId?: number
  nationalityId?: number
  memberLevelId?: number
  note?: string
  attachments?: Attachment[]
  sexName?: string
  sexNameEn?: string
  nationalityName?: string
  nationalityNameEn?: string
  unitName?: string
  groupName?: string
  memberLevelName?: string
}

export interface Attachment {
  uid?: string
  url?: string
  name?: string
  type?: string
  date?: Date
  by?: string
}

@Injectable({ providedIn: "root" })
export class MemberService extends BaseApiService<any> {
  constructor(http: HttpClient, settingService: SettingService) {
    super("member", http, settingService);
  }
}
