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
    description?: string;
    ordering?:number
}

@Injectable({
    providedIn: 'root',
})
export class BlockService extends BaseApiService<Block> {
    constructor(private http: HttpClient, settingService: SettingService) {
        super('block', http, settingService);
    }
    public updateOrdering(lists: Block[]): Observable<Block[]> {
        return this.http.put<Block[]>(
            `${this.getUrl()}/update-ordering`,
            lists
        );
    }
}
