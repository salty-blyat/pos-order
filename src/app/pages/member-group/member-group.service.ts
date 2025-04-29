import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';
import { HttpClient } from '@angular/common/http';


export interface MemberGroup {
    id?: number,
    name?: string,
    note?: string,
    ordering?: number
}

@Injectable({providedIn: 'root'})
export class MemberGroupService extends BaseApiService<MemberGroup> {
    constructor(http: HttpClient, settingService: SettingService) {
        super('membergroup', http, settingService);
    }
}