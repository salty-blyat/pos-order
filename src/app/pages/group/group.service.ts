import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';
import { HttpClient } from '@angular/common/http';


export interface Group {
    id?: number,
    name?: string,
    note?: string,
    ordering?: number
}

@Injectable({providedIn: 'root'})
export class GroupService extends BaseApiService<Group> {
    constructor(http: HttpClient, settingService: SettingService) {
        super('group', http, settingService);
    }
}