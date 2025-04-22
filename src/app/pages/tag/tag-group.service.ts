import { Injectable } from '@angular/core';
import {BaseApiService, QueryParam} from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs";

export interface TagGroup {
  id?: number;
  name?: string;
  note?: string;
  tags?: Tag[];
}

export interface Tag {
  id?: number;
  name?: string;
  note?: string,
  groupId?: 0,
  ordering?: 0
  groupName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagGroupService extends BaseApiService<TagGroup> {
  constructor(http: HttpClient, settingService: SettingService) { 
    super('taggroup', http, settingService);
  }
  searchTags(params: QueryParam): Observable<any> {
    const httpParams = new HttpParams()
        .set('pageIndex', params.pageIndex!.toString())
        .set('pageSize', params.pageSize!.toString())
        .set('sorts', `${params.sorts === undefined ? '' : params.sorts}`)
        .set('filters', `${params.filters === undefined ? '' : params.filters}`);
    return this.httpClient.get<any>(`${this.getUrl()}/tag`, { params: httpParams });
  }
}
