import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { SettingService } from "../../app-setting";
import { FormGroup } from "@angular/forms";
import { Data } from "@angular/router";
import { Floor } from "../../pages/floor/floor.service";

export interface QueryParam {
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  rowCount?: number;
  sorts?: string;
  filters?: string;
}
export interface SearchResult<T> {
  results: T[];
  param: QueryParam;
}

export interface Filter {
  field: string;
  operator: string;
  value: any;
}
export class SharedDomain {
  id?: number;
}
export class SharedDeleteDomain extends SharedDomain {
  note?: string;
}

export interface OperationPage<T> {
  model: T;
  frm: FormGroup;
  loading: boolean;
  breadcrumbData: Observable<Data>;
  submit(): void;
  cancel(): void;
  initControl(model: T): void;
}

export interface PullResult<T> {
  results: T[];
  summary: Summary;
}
export interface Summary {
  totalInserted?: number;
  totalUpdated?: number;
}

export class BaseApiService<T extends SharedDomain> {
  constructor(
    protected endpoint: string,
    protected httpClient: HttpClient,
    public settingService: SettingService
  ) {}
  public getUrl = (): string =>
    `${this.settingService.setting.BASE_API_URL}/${this.endpoint}`;

  public getStaticUrl = (): string => `assets/data/${this.endpoint}`;

  public search(query: QueryParam): Observable<SearchResult<T>> {
    return this.httpClient.get<SearchResult<T>>(`${this.getUrl()}`, {
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
    });
  }

  public find(id: number): Observable<T> {
    return this.httpClient.get<T>(
      `${this.getUrl()}/${id}`,
      this._get_httpHeader(id)
    );
  }

  public add(model: T): Observable<T> {
    return this.httpClient.post<T>(this.getUrl(), model);
  }

  public clone(id: number): Observable<T> {
    return this.httpClient.get<T>(
      `${this.getUrl()}/${id}/clone`,
      this._get_httpHeader(id)
    );
  }

  public edit(model: T): Observable<T> {
    return this.httpClient.put<T>(this.getUrl() + "/" + model.id, model);
  }

  public delete(model: T): Observable<T> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: model,
    };

    return this.httpClient.delete<T>(`${this.getUrl()}/${model.id}`, options);
  }

  public inused(id: number): Observable<any> {
    return this.httpClient.get<any>(
      `${this.getUrl()}/${id}/can-remove`,
      this._get_httpHeader(id)
    );
  }

  public exists(
    name: string = "",
    id: number = 0,
    params: { key: string; val: any }[] = []
  ): Observable<boolean> {
    if (!params) {
      params = [];
    }
    let httpParams = new HttpParams();
    params.forEach((pair) => {
      httpParams = httpParams.append(pair.key, pair.val);
    });
    if (name) {
      httpParams = httpParams.append("name", name);
    }
    httpParams = httpParams.append("id", `${id}`);
    return this.httpClient.get<boolean>(`${this.getUrl()}/exists`, {
      params: httpParams,
      headers: { disabledLoading: "yes" },
    });
  }

  public _get_httpHeader(param: any): object {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: param,
    };
  }

  public getHttpParam(query: QueryParam): HttpParams {
    return new HttpParams()
      .append("pageIndex", `${query.pageIndex}`)
      .append("pageSize", `${query.pageSize}`)
      .append("sorts", `${query.sorts === undefined ? "" : query.sorts}`)
      .append("filters", `${query.filters === undefined ? "" : query.filters}`);
  }

  public updateOrdering(lists: Floor[]): Observable<Floor[]> {
    return this.httpClient.put<Floor[]>(
      `${this.getUrl()}/update-ordering`,
      lists
    );
  }

  public checkUrlValidity(url: any) {
    let headers = new HttpHeaders();
    headers = headers
      .set("Accept", "text/html")
      .set("disableErrorNotification", "yes");
    return this.httpClient.get(url, { headers: headers, responseType: "text" });
  }
  
  public pull(): Observable<PullResult<T>> {
    return this.httpClient.post<PullResult<T>>(`${this.getUrl()}/pull`, null);
  }
}
