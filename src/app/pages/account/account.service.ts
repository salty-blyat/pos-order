import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";

export interface Account {
  memberId?: number;
  accountType?: number;
  balance?: number;
  mainAccountId?: number;
  id?: number;
  memberName?: string;
  accountTypeNameKh?: string;
  accountTypeNameEn?: string;
  note?: string;
}
@Injectable({
  providedIn: "root",
})
export class AccountService extends BaseApiService<Account> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("account", http, settingService);
  }
}
