import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {lastValueFrom} from "rxjs";

export class Setting {
  LANG_URL: string = '';
  BASE_API_URL: string = '';
  AUTH_API_URL: string = '';
  AUTH_UI_URL: string = '';
  APP_NAME: string = '';
  APP_ICON: string = 'https://core.sgx.bz/files/22/12/logo_text-black-02_.png';
  TENANT: any;
  PDF_URL: string = '';
}

@Injectable({ providedIn: 'root' })
export class SettingService {
  public setting: Setting;
  constructor() {
    this.setting = new Setting();
  }
}

@Injectable({ providedIn: 'root' })
export class SettingHttpService {
  public setting!: Setting;

  constructor(
    private http: HttpClient,
    private settingsService: SettingService
  ) {}

  async initializeApp(): Promise<any> {
    const response = await lastValueFrom(this.http.get('assets/setting.json'));
    this.settingsService.setting = <Setting>response;
    return null;
  }
}
