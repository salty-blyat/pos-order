import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../utils/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../app-setting';

export interface ServiceType {
    id?: number;
    name?: string;
    ordering?: number;
    trackQty?: boolean;
    note?: string;
    image?: string;
}

@Injectable({ providedIn: 'root' })
export class HomeService extends BaseApiService<ServiceType> {
    constructor(private http: HttpClient, settingService: SettingService) {
        super("servicetype", http, settingService);
    }

} 