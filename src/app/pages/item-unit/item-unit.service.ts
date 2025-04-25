import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';
import { HttpClient } from '@angular/common/http';


export interface ItemUnit {
    id?: number,
    name?: string,
    note?: string,
    ordering?: number
}

@Injectable({providedIn: 'root'})
export class ItemUnitService extends BaseApiService<ItemUnit> {
    constructor(http: HttpClient, settingService: SettingService) {
        super('itemunit', http, settingService);
    }
}