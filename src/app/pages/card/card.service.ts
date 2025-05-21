import { BaseApiService } from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";

export interface Card {
  accountId?: number;
  cardNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  status?: number;
  id?: number;
  statusNameKh?: string;
  statusNameEn?: string;
}
@Injectable({
  providedIn: "root",
})
export class CardService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("card", http, settingService);
  }
}
