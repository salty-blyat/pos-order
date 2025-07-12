import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../../app-setting';
import { Observable } from 'rxjs';

export interface Verify {
    id?: number;
    guestId?: number;
    roomId?: number;
    stayId?: number;
}

@Injectable({ providedIn: 'root' })
export class VerifyService extends BaseApiService<Verify> {
    constructor(
        httpClient: HttpClient,
        settingService: SettingService
    ) {
        super("verifyuser/public", httpClient, settingService);
    }

    public verify(uuid: string): Observable<Verify> {
        return this.httpClient.get<Verify>(`${this.getUrl()}/${uuid}`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            }),
        });
    }

} 