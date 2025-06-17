import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { SettingService } from "../../app-setting";
import { AccountTypes } from "../lookup/lookup-type.service";

export interface Member {
  id?: number;
  code?: string;
  name?: string;
  latinName?: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  agentId?: string;
  memberClassId?: string;
  note?: string;
  memberClassName?: string;
  agentName?: string;
  photo?: string;
  accounts?: MemberAccount[];
  defaultAccountId?: number;
  joinDate?: string;
  memberClassPhoto?: string;
  genderId?: string;
  nationalityId?: string;
}

export interface MemberAccount {
  accountType: any;
  accountTypeImage?: string;
  accountId?: number;
  balance?: number;
  accountTypeNameKh?: string;
  accountTypeNameEn?: string;
}

export interface Attachment {
  uid?: string;
  url?: string;
  name?: string;
  type?: string;
  date?: Date;
  by?: string;
}

export enum AccountTabs {
  Wallet = 0,
  Point = 1,
  Card = 2,
}

@Injectable({ providedIn: "root" })
export class MemberService extends BaseApiService<Member> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("member", http, settingService);
  }
}
