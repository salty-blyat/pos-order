import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';
import { HttpClient } from '@angular/common/http';


export interface MemberUnit {
    id?: number,
    name?: string,
    note?: string,
    ordering?: number
}

@Injectable({providedIn: 'root'})
export class MemberUnitService extends BaseApiService<MemberUnit> {
    constructor(http: HttpClient, settingService: SettingService) {
        super('memberunit', http, settingService);
    }
}