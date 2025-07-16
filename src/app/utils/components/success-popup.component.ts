import { Component, ViewEncapsulation } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-success-popup',
  template: `
    <div class="custom-success-popup">
      <div class="success-icon">
        <i nz-icon nzType="check" nzTheme="outline"></i>
      </div>
      <h2>{{ 'Your Request has been sent successfully!' | translate }}</h2>
      <p class="subtitle">
        {{ 'Our staff will fulfill your request as soon as possible. Are there anything else we could help you?' | translate }}
      </p>
      <div class="button-group">
        <button nz-button (click)="goBack()">
          {{ 'Back' | translate }}
        </button>
        <button nz-button nzType="primary" (click)="goToHistory()">
          {{ 'Your Requests' | translate }}
        </button>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .custom-success-popup {
        text-align: center; 
      }

      .success-icon {
        background-color: #52c41a;
        color: #fff;
        font-size: 28px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        margin: 0 auto 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      h2 {
        font-size: 24px;
        margin: 0;
        line-height: 1.3;
      }

      .subtitle {
        color: #888;
        margin-top: 10px;
        font-size: 14px;
      }

      .button-group {
        margin-top: 24px;
        display: flex;
        justify-content: center;
        gap: 12px;
      }
    `,
  ], standalone: false
})
export class SuccessPopupComponent {
  constructor(
    public ref: NzModalRef<any>,
    private location: Location,
    private router: Router,
    private translateService: TranslateService
  ) { }

  goBack() {
    this.ref.triggerOk().then();
    setTimeout(() => {
      this.location.back();
    }, 100);
  }

  goToHistory() {
    this.ref.triggerOk().then();
    setTimeout(() => {
      this.router.navigate(['history']);
    }, 100);
  }
}
