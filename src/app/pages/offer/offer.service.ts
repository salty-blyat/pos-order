import {
  BaseApiService,
  QueryParam,
  SearchResult,
} from "../../utils/services/base-api.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingService } from "../../app-setting";
import { Observable } from "rxjs";

export interface Offer {
  code?: string;
  name?: string;
  offerGroupId?: number;
  offerType?: number;
  note?: string;
  maxQty?: number;
  redeemedQty?: number;
  redeemWith?: number;
  redeemCost?: number;
  redeemMinBalance?: number;
  offerStartAt?: string;
  offerEndAt?: string;
  photo?: string;
  id?: number;
  offerGroupName?: string;
  offerTypeNameKh?: string;
  offerTypeNameEn?: string;
  redeemWithNameKh?: string;
  redeemWithNameEn?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
}

@Injectable({
  providedIn: "root",
})
export class OfferService extends BaseApiService<Offer> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("offer", http, settingService);
  }

  getAvailable(query: QueryParam): Observable<SearchResult<Offer>> {
    return this.httpClient.get<SearchResult<Offer>>(
      `${this.settingService.setting.BASE_API_URL}/offer/available`,
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
