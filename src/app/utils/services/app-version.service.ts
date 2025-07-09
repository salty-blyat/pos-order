import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom} from "rxjs";

export interface AppVersion {
  version?: string;
  build?: string;
  release_date?: string
}

@Injectable({
  providedIn: 'root'
})
export class AppVersionService {
  private appVersion?: AppVersion;

  constructor(private http: HttpClient) {}

  async initializeVersion() {
    return new Promise(
      (resolve)  => {
        lastValueFrom(this.http.get('assets/version.json')).then((response) => {
          this.appVersion = response;
          resolve(null);
        })
      }
    );
  }

  getVersion(): AppVersion {
    return <AppVersion>this.appVersion;
  }
}
