import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import { Observable } from 'rxjs';
import {
  BaseApiService,
  QueryParam,
  SearchResult,
} from '../../utils/services/base-api.service';

export interface Branch {
  userNames?: User[];
  id?: number;
  code?: string;
  name?: string;
  note?: string;
  phone?: string;
  address?: string;
}
export interface User {
  name?: string;
  fullName?: string;
  profile?: string;
}
@Injectable({
  providedIn: 'root',
})
export class BranchService extends BaseApiService<Branch> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super('branch', http, settingService);
  }
  pull(): Observable<Branch> {
    return this.http.post<Branch>(`${this.getUrl()}/pull`, '');
  }
  public getallBranchList(query: QueryParam): Observable<SearchResult<Branch>> {
    return this.httpClient.get<SearchResult<Branch>>(
      `${this.getUrl()}/available`,
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
