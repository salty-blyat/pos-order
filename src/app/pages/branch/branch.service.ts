import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { BaseApiService, QueryParam, SearchResult } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Branch {
  code?: string;
  name?: string;
  phone?: string;
  address?: string;
  note?: string;
  id?: number;
  userNames?: User[];
}
export interface User {
  name?: string;
  profile?: string;
  fullName?: string;
}

@Injectable({ providedIn: "root" })
export class BranchService extends BaseApiService<Branch> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("branch", http, settingService);
  }
  
  getAllUsers(query: QueryParam): Observable<SearchResult<User>> {
    return this.httpClient.get<SearchResult<User>>(
      `${this.getUrl().replace('branch', 'user')}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        params: new HttpParams()
          .append('pageIndex', `${query.pageIndex}`)
          .append('pageSize', `${query.pageSize}`)
          .append('sorts', `${query.sorts === undefined ? '' : query.sorts}`)
          .append(
            'filters',
            `${query.filters === undefined ? '' : query.filters}`
          ),
      }
    );
  }

}
