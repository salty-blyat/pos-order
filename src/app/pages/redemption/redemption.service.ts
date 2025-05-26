import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";
import {
  BaseApiService,
  QueryParam,
  SearchResult,
} from "../../utils/services/base-api.service";
import { Observable } from "rxjs";
import { Transaction } from "../account/account.service";
import { Attachment } from "../member/member.service";

export interface Redemption {
  accountId?: number;
  redeemNo?: string;
  redeemedDate?: string;
  refNo?: string;
  offerId?: number;
  qty?: number;
  amount?: number;
  note?: string;
  status?: 1;
  locationId?: number;
  id?: number;
  locationName?: string;
  offerName?: string;
  statusNameKh?: string;
  statusNameEn?: string;
  redeemWith?: number;
  accounntType?: number;
  memberId?: number;
  attachments?: Attachment[];
}
 
@Injectable({
  providedIn: "root",
})
export class RedemptionService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("redemption", http, settingService);
  }

  // all transactions history PER ACCOUNT
  memberHistory(query: QueryParam): Observable<SearchResult<Transaction>> {
    return this.httpClient.get<SearchResult<Transaction>>(
      `${this.settingService.setting.BASE_API_URL}/redemption/history`,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        params: new HttpParams()
          .append("pageIndex", `${query.pageIndex}`)
          .append("pageSize", `${query.pageSize}`)
          .append("sorts", `${query.sorts === undefined ? "" : query.sorts}`)
          .append(
            "filters",
            `${query.filters === undefined ? "" : query.filters}`
          ),
      }
    );
  }
}
