import {
  BaseApiService,
  QueryParam,
  SearchResult,
} from "../../utils/services/base-api.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";
import { Observable } from "rxjs";
import { Attachment } from "../member/member.service";

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

export interface Transaction {
  transNo?: string;
  transDate?: string;
  accountId?: number;
  amount?: number;
  type?: number;
  note?: string;
  refNo?: string;
  attachments?: Attachment[];
  id?: number;
  memberId?: number;
  offerGroupId?: number;
  offerType?: number;
  memberCode?: string;
  typeNameKh?: string;
  typeNameEn?: string;
  redeemNo?: string;
  offerName?: string;
  locationId?: number;
  accountType?: number;
  redeemWith?: number;
  locationName?: string;
  redeemWithNameKh?: string;
  redeemWithNameEn?: string;
}

export interface TransactionAdjust {
  transNo?: string;
  transDate?: string;
  accountId?: number;
  amount?: number;
  type?: number;
  note?: string;
  locationId?: number;
  refNo?: string;
  id?: number;
  extData?: string;
  attachments?: Attachment[];
}

@Injectable({
  providedIn: "root",
})
export class AccountService extends BaseApiService<Account> {
  constructor(http: HttpClient, settingService: SettingService) {
    super("account", http, settingService);
  }

  // all transactions PER ACCOUNT
  getTransactions(
    id: number,
    query: QueryParam
  ): Observable<SearchResult<Transaction>> {
    return this.httpClient.get<SearchResult<Transaction>>(
      `${this.settingService.setting.BASE_API_URL}/account/${id}/transactions`,
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

  override add(model: TransactionAdjust): Observable<TransactionAdjust> {
    return this.httpClient.post<TransactionAdjust>(
      `${this.settingService.setting.BASE_API_URL}/account/transaction`,
      model
    );
  }

  override find(id: number): Observable<TransactionAdjust> {
    return this.httpClient.get<TransactionAdjust>(
      `${this.settingService.setting.BASE_API_URL}/account/transaction/${id}`,
      this._get_httpHeader(id)
    );
  }

  findAccount(id: number): Observable<TransactionAdjust> {
    return this.httpClient.get<TransactionAdjust>(
      `${this.getUrl()}/${id}`,
      this._get_httpHeader(id)
    );
  }
}
