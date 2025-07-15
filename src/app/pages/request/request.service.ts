import { Injectable } from '@angular/core';
import { BaseApiService, QueryParam, SearchResult } from '../../utils/services/base-api.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import { Observable } from 'rxjs';
export enum RequestStatus {
    Pending = 1,
    InProgress = 2,
    Done = 3,
    Cancel = 4
}
export interface Guest {
    roomNo?: string;
    totalNight?: number;
    checkInDate?: string;
    checkOutDate?: string;
    guestName?: string;
    guestPhone?: string;
}
export interface RequestDetail {
    requestNo?: string;
    requestTime?: string;
    guestId?: number;
    statusNameEn?: string;
    statusNameKh?: string;
    roomId?: number;
    stayId?: number;
    serviceItemId?: number;
    quantity?: number;
    status?: number;
    note?: string;
    id?: number;
    attachments?: Attachment[];
    requestLogs?: RequestLog[];

    serviceItemName?: string;
    serviceItemImage?: string;
}

export interface RequestLog {
    id?: number;
    requestId?: number;
    staffId?: number;
    staffName?: string;
    status?: number;
    statusNameKh?: string;
    statusNameEn?: string;
    note?: string;
    createdBy?: string;
    createdDate?: string;
}

export interface Request {
    requestNo?: string;
    requestTime?: string;
    guestId?: number;
    roomId?: number;
    stayId?: number;
    serviceItemId?: number;
    quantity?: number;
    status?: number;
    note?: string;
    id?: number;
    guestName?: string;
    roomNo?: string;
    serviceItemName?: string;
    attachments?: Attachment[];
    lastModifiedDate?: string;
    lastModifiedBy?: string;
    createdDate?: string;
    createdBy?: string;
    statusNameEn?: string;
    statusNameKh?: string;
    serviceName?: string;
    serviceItemImage?: string;
}

export interface RequestPOST {
    id?: number;
    requestNo?: string;
    requestTime?: string;
    guestId?: number;
    roomId?: number;
    stayId?: number;
    serviceItemId?: number;
    quantity?: number;
    status?: number;
    note?: string;
    attachments?: Attachment[];
}
export interface Attachment {
    uid?: string;
    url?: string;
    name?: string;
    type?: string;
    createdDate?: string;
    createdBy?: string;
}

@Injectable({ providedIn: 'root' })
export class RequestService extends BaseApiService<Request> {
    constructor(
        httpClient: HttpClient,
        settingService: SettingService
    ) {
        super("request", httpClient, settingService);
    }
    override search(query: QueryParam): Observable<SearchResult<Request>> {
        return this.httpClient.get<SearchResult<Request>>(`${this.getUrl()}/public`, {
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

    addData(model: RequestPOST): Observable<RequestPOST> {
        return this.httpClient.post<RequestPOST>(`${this.getUrl()}/public`, model);
    }
    getGuest(uuid: string): Observable<Guest> {
        return this.httpClient.get<Guest>(`${this.getUrl()}/room/${uuid}/guest`);
    }

    verifyPhone(model: any): Observable<any> {
        return this.httpClient.post<any>(`${this.getUrl()}/guest/confirm`, model);
    }
    override find(id: number): Observable<RequestDetail> {
        return this.httpClient.get<RequestDetail>(
            `${this.getUrl()}/public/${id}`
        );
    }

} 