import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_STORAGE_KEY } from '../const';
import { map, tap } from 'rxjs/operators';
import { SettingService } from '../app-setting';
import { LanguageService } from '../utils/services/language.service';
import { Title } from '@angular/platform-browser';
import { Guest, RequestService } from '../pages/request/request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionStorageService } from '../utils/services/sessionStorage.service';

export interface ClientInfo {
  id?: number;
  name?: string;
  fullName?: string;
  email?: string;
  token?: string;
  branchId?: string;
  changePasswordRequired?: boolean;
  permissions?: number[];
  isEnabled?: boolean;
  profile?: string;
  refreshToken?: string;
  mfaRequired?: boolean;
  mfaToken?: string;
  message?: string;
  app?: App;
  tenant?: Tenant;
}

export interface App {
  appName?: string;
  appCode?: string;
  language?: string;
  iconUrl?: string;
}

export interface Tenant {
  name?: string;
  note?: string;
  code?: string;
  logo?: string;
  tenantData?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  authPermission: any;

  constructor(
    private httpClient: HttpClient,
    private requestService: RequestService,
    private settingService: SettingService,
    private languageService: LanguageService, private titleService: Title,
    private sessionService: SessionStorageService
  ) { }

  clientInfo: ClientInfo = this.getStorageValue(APP_STORAGE_KEY.Authorized);
  private companyInfoSubject = new BehaviorSubject<any>(null);
  private guestInfoSubject = new BehaviorSubject<any>(null);
  companyInfo$ = this.companyInfoSubject.asObservable();
  guestInfo$ = this.guestInfoSubject.asObservable();

  setCompanyInfo(data: any) {
    this.companyInfoSubject.next(data);
  }
  setGuestInfo(data: any) {
    this.guestInfoSubject.next(data);
  }
  get url() {
    return this.settingService.setting.AUTH_API_URL;
  }
  get tenant(): Tenant {
    return this.getStorageValue(APP_STORAGE_KEY.Tenant);
  }

  get app(): App {
    return this.getStorageValue(APP_STORAGE_KEY.App);
  }

  updateClientInfo(tenantCode: string): Observable<any> {

    return this.getCompanyInfo(tenantCode).pipe(
      tap((res) => {
        const CompanyName = res.find((item: any) => item.key === "CompanyName")?.value || '';
        const CompanyLogo = res.find((item: any) => item.key === "CompanyLogo")?.value || '';
        const CompanyNameEn = res.find((item: any) => item.key === "CompanyNameEn")?.value || '';

        const companyInfo = { CompanyName, CompanyLogo, CompanyNameEn };        
        
        this.setAppInfo(tenantCode, CompanyLogo, CompanyName);
        this.setCompanyInfo(companyInfo);
        this.updateTitleTab();
        this.sessionService.setValue({ key: "companyName", value: CompanyName });
        this.sessionService.setValue({ key: "companyLogo", value: CompanyLogo });
        this.sessionService.setValue({ key: "companyNameEn", value: CompanyNameEn });
      })
    )
  }
  updateGuestInfo(uuid: string): Observable<any> {
    return this.requestService.getGuest(uuid).pipe(
      tap((res: Guest) => {
        this.setGuestInfo(res);
      })
    )
  }
  setAppInfo(tenantCode: string, iconUrl: string, CompanyName: string) {
    const tenant: Tenant = {
      name: tenantCode,
      note: "",
      code: tenantCode,
      logo: "",
      tenantData: "",
    }
    console.log(tenant);

    const app: App = {
      appCode: "Hotel Portal",
      iconUrl: iconUrl || this.sessionService.getValue("companyLogo") || "",
      appName: CompanyName || this.sessionService.getValue("companyName") || "",
    }
    this.setStorageValue({
      key: APP_STORAGE_KEY.App,
      value: app,
    });

    this.setStorageValue({
      key: APP_STORAGE_KEY.Tenant,
      value: tenant,
    });
  }


  getStorageValue<T>(key: string): T {
    return JSON.parse(<string>localStorage.getItem(key?.toLowerCase()));
  }

  setStorageValue(option: { key: string; value: any }): void {
    if (localStorage.getItem(option.key?.toLowerCase())) {
      localStorage.removeItem(option.key?.toLowerCase());
    }
    localStorage.setItem(
      option.key?.toLowerCase(),
      JSON.stringify(option.value)
    );
  }

  removeStorageValue(key: any): void {
    localStorage.removeItem(key?.toLowerCase());
  }
  getCompanyInfo(tenantCode: string): Observable<any> {
    const url = `${this.settingService.setting.BASE_API_URL}/maintenance/public/${tenantCode}/company/info`;
    return this.httpClient.get<any>(url,{headers: { disableErrorNotification: 'yes', "Tenant-Code": tenantCode }});
  }
  redirectLogin(model: any) {
    return this.httpClient
      .post(`${this.url}/auth/redirect-login`, model, {
        withCredentials: true,
        headers: { disableErrorNotification: 'yes' },
      })
      .pipe(
        map((result) => {
          this.setStorageValue({
            key: APP_STORAGE_KEY.Authorized,
            value: result,
          });
          this.clientInfo = result;
          return result;
        })
      );
  }
  redirectRequest(appId: string) {
    return this.httpClient
      .post(`${this.url}/auth/redirect-request`, {
        app: appId,
        withCredentials: true,
        headers: { disableErrorNotification: 'yes' },
      })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  login(model: any) {
    return this.httpClient
      .post(`${this.url}/auth/login`, model, {
        withCredentials: true,
        headers: { disableErrorNotification: 'yes' },
      })
      .pipe(
        map((result) => {
          this.setStorageValue({
            key: APP_STORAGE_KEY.Authorized,
            value: result,
          });
          this.clientInfo = result;
          return result;
        })
      );
  }
  logout() {
    return this.httpClient
      .get(`${this.url}/auth/logout`, { withCredentials: true })
      .pipe(
        map((result) => {
          this.removeStorageValue(APP_STORAGE_KEY.Authorized);
          this.clientInfo = {};
          return result;
        })
      );
  }

  getUserInfo() {
    return this.httpClient.get(`${this.url}/auth/info`).pipe(
      map((result) => {
        return result;
      })
    );
  }
  refreshToken(accessToken: string) {
    return this.httpClient.post(
      `${this.url}/auth/refresh`,
      { accessToken },
      {
        headers: { disableErrorNotification: 'yes' },
        withCredentials: true,
      }
    );
  }

  sendResetPasswordLinkAsync(model: any) {
    return this.httpClient.post(
      `${this.url}/auth/send-reset-password-link`,
      model,
      { headers: { disableErrorNotification: 'yes' } }
    );
  }

  verifyOtp(model: any) {
    return this.httpClient.post(`${this.url}/auth/verify-otp`, model, {
      headers: { disableErrorNotification: 'yes' },
    });
  }

  resetPassword(model: any) {
    return this.httpClient.post(`${this.url}/auth/reset-password`, model);
  }
  changePassword(model: any) {
    return this.httpClient.post(`${this.url}/auth/change-password`, model);
  }
  editProfile(model: any) {
    return this.httpClient.post(`${this.url}/auth/edit-profile`, model);
  }

  // updateClientInfo() {
  //   // @ts-ignore
  //   this.getUserInfo().subscribe((result) => {
  //     const authorized: ClientInfo = this.getStorageValue(
  //       APP_STORAGE_KEY.Authorized
  //     );
  //     this.clientInfo = result;
  //     // @ts-ignore
  //     this.clientInfo.token = authorized.token;
  //     this.clientInfo.permissions = authorized.permissions;
  //     this.setStorageValue({
  //       key: APP_STORAGE_KEY.Authorized,
  //       value: this.clientInfo,
  //     });
  //   });
  // }
  getAuthorizedPermissions(): number[] {
    return this.clientInfo.permissions || [];
  }
  get isVerified() {
    const guestId = this.sessionService.getValue("guestId");
    const reservationId = this.sessionService.getValue("reservationId");
    const roomId = this.sessionService.getValue("roomId");
    const isVerified = this.sessionService.getValue(
      `isVerified-${guestId}-${reservationId}-${roomId}`
    );
    return isVerified || false;
  }
  checkout() {
    const guestId = this.sessionService.getValue("guestId");
    const reservationId = this.sessionService.getValue("reservationId");
    const roomId = this.sessionService.getValue("roomId");
    this.sessionService.removeValue(`isVerified-${guestId}-${reservationId}-${roomId}`);
    this.sessionService.removeValue("guestId");
    this.sessionService.removeValue("reservationId");
    this.sessionService.removeValue("roomId");
    this.sessionService.removeValue("roomNo");
    this.sessionService.removeValue("checkInDate");
    this.sessionService.removeValue("checkOutDate");
    this.sessionService.removeValue("totalNight");
    this.sessionService.removeValue("guestName");
    this.sessionService.removeValue("guestPhone"); 
  }

  isAuthorized(key: number): boolean {
    if (!key) {
      return true;
    }
    return this.getAuthorizedPermissions().includes(key);
  }
  updateTitleTab() {
    // this.languageService.initialLanguage();
    this.titleService.setTitle(`${this.app?.appName} | ${this.tenant.name}`);
    let favIcon: HTMLLinkElement | any = document.querySelector('#favIcon');
    favIcon.href = this.app?.iconUrl;
  }
}
