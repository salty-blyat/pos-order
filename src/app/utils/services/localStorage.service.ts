import { Injectable } from '@angular/core';
import { APP_STORAGE_KEY } from '../../const';
import { App, Tenant } from '../../helpers/auth.service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private localStorage: any = localStorage;

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
        this.localStorage.getItem(
          `${this.appCode}-${this.tenantCode}-${key?.toLowerCase()}`
        )
      )
    );
  }

  setValue(option: { key: string; value: any }): void {
    if (
      this.localStorage.getItem(
        `${this.appCode}-${this.tenantCode}-${option.key?.toLowerCase()}`
      )
    ) {
      this.localStorage.removeItem(
        `${this.appCode}-${this.tenantCode}-${option.key?.toLowerCase()}`
      );
    }
    this.localStorage.setItem(
      `${this.appCode}-${this.tenantCode}-${option.key?.toLowerCase()}`,
      JSON.stringify(option.value)
    );
  }

  removeValue(key: any): void {
    this.localStorage.removeItem(
      `${this.appCode}-${this.tenantCode}-${key?.toLowerCase()}`
    );
  }
}
