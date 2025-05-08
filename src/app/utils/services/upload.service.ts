import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../app-setting';
export interface UploadBase64 {
  fileName?: string;
  mimeType?: string;
  base64?: string;
}
export interface UploadFile {
  uid?: string;
  url?: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(
    private http: HttpClient,
    private settingService: SettingService
  ) {}

  public uploadBase64(model: UploadBase64): Observable<UploadFile> {
    return this.http.post<UploadFile>(
      `${this.settingService.setting.AUTH_API_URL}/upload/base64`,
      model
    );
  }
}
