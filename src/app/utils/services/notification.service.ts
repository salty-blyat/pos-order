import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private notification: NzNotificationService,
    private translateService: TranslateService
  ) {}

  errorNotification(error: HttpErrorResponse): void {
    // this.notification.create('error',`${this.translateService.instant("Unsuccess")}`,this.translateService.instant(error.error.message));
    this.notification.create(
      'error',
      `${error.status} ${error.statusText}`,
      this.translateService.instant(error.error?.message)
    );
  }
  successNotification(content: string, title: string = 'Success'): void {
    this.notification.create(
      'success',
      this.translateService.instant(title),
      this.translateService.instant(content)
    );
  }
  updateNotification(content: string, title: string = 'Success'): void {
    this.notification.create(
      'success',
      this.translateService.instant(title),
      this.translateService.instant(content)
    );
  }
  customErrorNotification(content: string, title: string = 'Error') {
    this.notification.create(
      'error',
      `${this.translateService.instant(title)}`,
      this.translateService.instant(content)
    );
  }
  customContentErrorNotification(content: string) {
    this.notification.create(
      'error',
      `${this.translateService.instant('Unsuccess')}`,
      content
    );
  }
}
