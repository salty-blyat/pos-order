import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import { Report } from '../report/report.service';
import { Observable } from 'rxjs';

export interface ReportGroup {
  id?: number;
  name?: string;
  note?: string;
  totalReport?: number;
  reports?: Report[];
  ordering?: number;
}

@Injectable({ providedIn: 'root' })
export class ReportGroupService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super('reportgroup', http, settingService);
  }
  // public updateOrdering(lists: ReportGroup[]): Observable<ReportGroup[]> {
  //   return this.http.put<ReportGroup[]>(
  //     `${this.getUrl()}/update-ordering`,
  //     lists
  //   );
  // }
}
