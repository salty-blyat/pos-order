import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import { Observable } from 'rxjs';
 
export interface Service {
    id?: number;
    trackQty?: boolean;
    departmentName?: string | null;
    serviceTypeName?: string | null;
    name?: string | null;
    serviceTypeId?: number | null;
    departmentId?: number | null;
    maxQty?: number | null;
    image?: string | null;
    description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ServiceService extends BaseApiService<Service> {
    constructor(
        httpClient: HttpClient,
        settingService: SettingService
    ) {
        super("serviceitem/public", httpClient, settingService);
    } 
} 