import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import { Observable } from 'rxjs';

export interface Request {
    id?: number,
    requestNo?: string,
    requestTime?: string,
    guestId?: number,
    roomId?: number,
    stayId?: number,
    serviceItemId?: number,
    quantity?: number,
    status?: number,
    note?: string,
    attachments?: Attachment[]
}
export interface Attachment {
    uid?: string,
    url?: string,
    name?: string,
    type?: string,
    createdDate?: string,
    createdBy?: string
}

@Injectable({ providedIn: 'root' })
export class RequestService extends BaseApiService<Request> {
    constructor(
        httpClient: HttpClient,
        settingService: SettingService
    ) {
        super("request/public", httpClient, settingService);
    }
} 