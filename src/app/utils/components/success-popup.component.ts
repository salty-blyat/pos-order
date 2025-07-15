import { Component, ViewEncapsulation } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-success-popup",
  template: `
    <nz-result
      nzStatus="success"
      nzTitle="{{ 'Your Request has been sent successfully!' | translate }}"
      nzSubTitle="{{ 'Our staff will fullfil your request as soon as possible. Are there anything else we could help you?' | translate }}"
    >
      <div nz-result-extra>
        <button nz-button   (click)="goBack()">{{ 'Back' | translate }}</button>
        <button nz-button nzType="primary" (click)="goToHistory()">{{ 'View Requests' | translate }}</button>
      </div>
    </nz-result>
  `,
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .ant-result-title {
        line-height: 1.1 !important;
      }
      .ant-result-subtitle{
        margin-top:8px;

      }
      .ant-modal-body{
        padding: 0px !important;
      }
      .ant-result{
       padding:38px 32px 24px 38px !important;
      }
    `,
  ],
})
export class SuccessPopupComponent {
  constructor(public ref: NzModalRef<any>, private location: Location, private router: Router, private translateService: TranslateService) {
  }
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
