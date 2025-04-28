import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import {BaseApiService,} from '../../utils/services/base-api.service';
import {Observable} from "rxjs";

export interface Floor {
    id?: number;
    name?: string;
    blockId?: number;
    blockName?: string;
    ordering?: number;
    note?: string
}

@Injectable({
    providedIn: 'root',
})
export class FloorService extends BaseApiService<Floor> {
    constructor(http: HttpClient, settingService: SettingService) {
        super('floor', http, settingService);
    }
}
