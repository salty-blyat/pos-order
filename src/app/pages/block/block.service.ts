import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import {
    BaseApiService,
} from '../../utils/services/base-api.service';
import {Observable} from "rxjs";

export interface Block {
    id?: number;
    code?: string;
    name?: string;
    address?: string;
    note?: string;
    ordering?:number
}

@Injectable({
    providedIn: 'root',
})
export class BlockService extends BaseApiService<Block> {
    constructor(http: HttpClient, settingService: SettingService) {
        super('block', http, settingService);
    }
}
