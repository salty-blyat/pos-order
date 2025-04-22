import { Injectable } from '@angular/core';
import { APP_STORAGE_KEY } from '../../const';

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
export class SessionStorageService {
  private sessionStorage: any = sessionStorage;

  private get app(): App {
    return JSON.parse(
      localStorage.getItem(APP_STORAGE_KEY.App?.toLowerCase()) as string
    );
  }

  private get appCode(): string {
    return <string>this.app?.appCode?.toLowerCase();
  }

  private get tenant(): Tenant {
    return JSON.parse(
      localStorage.getItem(APP_STORAGE_KEY.Tenant?.toLowerCase()) as string
    );
  }

  private get tenantCode(): string {
    return <string>this.tenant?.code?.toLowerCase();
  }

  getValue<T>(key: string): T {
    return JSON.parse(
      <string>(
        this.sessionStorage.getItem(
          `${this.appCode}-${this.tenantCode}-${key?.toLowerCase()}`
        )
      )
    );
  }

  setValue(option: { key: string; value: any }): void {
    if (
      this.sessionStorage.getItem(
        `${this.appCode}-${this.tenantCode}-${option.key?.toLowerCase()}`
      )
    ) {
      this.sessionStorage.removeItem(
        `${this.appCode}-${this.tenantCode}-${option.key?.toLowerCase()}`
      );
    }
    this.sessionStorage.setItem(
      `${this.appCode}-${this.tenantCode}-${option.key?.toLowerCase()}`,
      JSON.stringify(option.value)
    );
  }

  removeValue(key: any): void {
    this.sessionStorage.removeItem(
      `${this.appCode}-${this.tenantCode}-${key?.toLowerCase()}`
    );
  }

  setPageSizeOptionKey(pageSize: any, key: any) {
    let value: any[] = [];
    value =
      this.getValue(`${this.appCode}-${this.tenantCode}-page-size-option`) ||
      [];
    const index = value.findIndex(
      (e: { key: any }) => e.key.toLowerCase() === key.toLowerCase()
    );
    index !== -1
      ? (value[index].value = pageSize)
      : value.push({ key: key, value: pageSize });
    this.setValue({
      key: `${this.appCode}-${this.tenantCode}-page-size-option`,
      value,
    });
  }
  getCurrentPageSizeOption(key: any): any {
    let pageSizeOptions: any[] = [];
    pageSizeOptions =
      this.getValue(`${this.appCode}-${this.tenantCode}-page-size-option`) ??
      [];
    return pageSizeOptions.filter(
      (item) => item.key.toLowerCase() === key.toLowerCase()
    )[0]?.value;
  }
}
