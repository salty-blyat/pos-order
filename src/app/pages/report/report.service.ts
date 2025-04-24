import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';


export interface Report {
  id?: number;
  reportGroupId?: number;
  reportGroupName?: string;
  name?: string;
  label?: string;
  note?: string;
  params?: ReportParam[];
  template?: string;
  command?: string;
  printOption?: ReportPrintOption;
  isHidden?: boolean;
  permissionKey?: number;
  ordering?: number;
}

export interface ReportParam {
  key?: string;
  label?: string;
  type?: string;
  defaultValue?: any;
  display?: number;
  initParam?: string;
}

export interface ReportPrintOption {
  pageSize?: number;
  orientation?: number;
}

export interface ProcessReportModel {
  requestId?: string;
  renderType?: number;
  reportName?: string;
  param?: any;
}

export enum TAB_INDEX_REPORT {
  INFO = 0,
  PARAM = 1,
  TEMPLATE = 2,
  COMMAND = 3,
}

@Injectable({ providedIn: 'root' })
export class ReportService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super('report', http, settingService);
  }
  // public updateOrdering(lists: Report[]): Observable<Report[]> {
  //   return this.http.put<Report[]>(`${this.getUrl()}/update-ordering`, lists);
  // }
  convertDate(date: any): string {
    const dateCon = new Date(date);
    const year = dateCon.getFullYear();
    const month = dateCon.getMonth() + 1;
    const checkMonth = month < 10 ? '0' + month.toString() : month.toString();
    const day = dateCon.getDate();
    const checkDay = day < 10 ? '0' + day.toString() : day.toString();
    return `${year + '-' + checkMonth + '-' + checkDay}`;
  }
  public processReport(model: ProcessReportModel): Observable<any> {
    for (const key in model.param) {
      if (model.param[key] instanceof Date) {
        model.param[key] = model.param[key].toDateString();
      } else {
        model.param[key] = model.param[key];
      }
    }
    return this.http.post<any>(`${this.getUrl()}/process-report`, model);
  }
  // tslint:disable-next-line:typedef
  override checkUrlValidity(url: any) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Accept', 'text/html')
      .set('disableErrorNotification', 'yes');
    return this.http.get(url, { headers, responseType: 'text' });
  }

  downloadPdf(pageOption: any): Observable<any> {
    return this.http.post(this.settingService.setting.PDF_URL, pageOption, {
      responseType: 'blob',
    });
  }

  public run<T>(reportName: string, param: {}): Observable<T> {
    const url = `${this.getUrl().replace('invoice', '')}/${reportName}`;
    return this.http.post<T>(url, param);
  }
  findByName(reportName: string): Observable<any> {
    return this.http.get(`${this.getUrl()}/by-name/${reportName}`);
  }
  generateIframe(reportName: string, param: {}, uuid: string): Observable<any> {
    return this.http.post(`${this.getUrl()}/${reportName}/${uuid}`, param, {
      responseType: 'text',
    });
  }
  getIframe(reportName: string, uuid: string): Observable<any> {
    return this.http.get(`${this.getUrl()}/${reportName}/${uuid}`, {
      responseType: 'text',
    });
  }
  getIframeUrl(reportName: string, key: string): string {
    return `${this.getUrl()}/${reportName}/${key}?tenantId=${
      this.settingService.setting.TENANT
    }`;
  }
}
