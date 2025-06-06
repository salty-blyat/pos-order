import { Component, computed, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { SETTING_KEY, SystemSettingService } from "./system-setting.service";
import { BaseSettingSectionComponent } from "../../utils/components/base-setting-section.component";

import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { Observable, Observer } from "rxjs";

import { NotificationService } from "../../utils/services/notification.service";
import { SettingService } from "../../app-setting";
import { AuthKeys } from "../../const";
import { AuthService } from "../../helpers/auth.service";

@Component({
  selector: "app-company-section",
  template: `
    <app-indeterminate-bar
      class="loading-bar"
      *ngIf="loading"
    ></app-indeterminate-bar>
    <form
      nz-form
      class="system-setting-form"
      [formGroup]="frm"
      [nzAutoTips]="autoTips"
    >
      <div class="sub-section">
        <h5>{{ "Company" | translate }}</h5>
      </div>

      <nz-form-item style="margin-bottom: 15px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "Logo" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24" nzErrorTip="">
          <div class="photo">
            <nz-form-control [nzSm]="8" [nzXs]="24" nzErrorTip="">
              <nz-upload
                [nzAction]="uploadUrl"
                [(nzFileList)]="fileCompany"
                [nzBeforeUpload]="beforeUpload"
                (nzChange)="handleUploadCompany($event)"
                nzListType="picture-card"
                [nzShowButton]="fileCompany.length < 1"
                style="width: 100px; height: 100px"
              >
                <div>
                  <img
                    [src]="companyLogoUrl"
                    alt=""
                    style="width: 100px; height: 100px"
                  />
                </div>
              </nz-upload>
            </nz-form-control>
          </div>
          <input
            hidden
            [(ngModel)]="companyLogoUrl"
            nz-input
            formControlName="{{ SettingKey.CompanyLogo }}"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item style="margin-bottom: 10px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "Name" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <input nz-input formControlName="{{ SettingKey.CompanyNameEn }}" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item style="margin-bottom: 10px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "NameKh" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <input nz-input formControlName="{{ SettingKey.CompanyName }}" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item style="margin-bottom: 10px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "Phone" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <input nz-input formControlName="{{ SettingKey.CompanyPhone }}" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item style="margin-bottom: 10px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "Email" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <input nz-input formControlName="{{ SettingKey.CompanyEmail }}" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item style="margin-bottom: 10px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "Website" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <input nz-input formControlName="{{ SettingKey.CompanyWebsite }}" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item style="margin-bottom: 10px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "Address" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24" nzErrorTip="">
          <textarea
            nz-input
            type="text"
            formControlName="{{ SettingKey.CompanyAddressEn }}"
            rows="2"
          ></textarea>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item style="margin-bottom: 10px !important;">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "AddressKh" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24" nzErrorTip="">
          <textarea
            nz-input
            type="text"
            formControlName="{{ SettingKey.CompanyAddress }}"
            rows="2"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <ng-container *ngIf="isAdvanceSetting()">
        <div class="sub-section">
          <h5>{{ "Currency" | translate }}</h5>
        </div>

        <nz-form-item style="margin-bottom: 10px !important;">
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
            {{ "MainCurrency" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="8" [nzXs]="24">
            <app-currency-select
              formControlName="{{ SettingKey.MainCurrency }}"
            ></app-currency-select>
          </nz-form-control>
        </nz-form-item>

        <!-- <nz-form-item style="margin-bottom: 10px !important;">
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
            {{ "SecondCurrency" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="8" [nzXs]="24">
            <app-currency-select
              formControlName="{{ SettingKey.SecondCurrency }}"
            ></app-currency-select>
          </nz-form-control>
        </nz-form-item> -->
      </ng-container>

      <nz-form-item *ngIf="isBasicSetting()">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzNoColon></nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24" style="text-align: right">
          <button
            nz-button
            nzType="primary"
            [disabled]="!frm.valid"
            (click)="submit()"
            style="margin: 0"
          >
            <i *ngIf="loading" nz-icon nzType="loading"></i>
            {{ "Save" | translate }}
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [
    `
      .system-setting-form {
        padding: 0;
        height: calc(100vh - 200px);
        overflow: auto;
      }
      .sub-section {
        padding: 0 30px;
      }
      .sub-section h5 {
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 20px;
        font-size: 14px;
      }
      .loading-bar {
        position: relative;
        top: -15px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class CompanySectionComponent extends BaseSettingSectionComponent {
  constructor(
    fb: UntypedFormBuilder,
    settingService: SystemSettingService,
    notificationService: NotificationService,
    appSettingService: SettingService,
    private authService: AuthService
  ) {
    super(fb, settingService, notificationService, appSettingService);
  }

  override keys = [
    SETTING_KEY.CompanyName,
    SETTING_KEY.CompanyNameEn,
    SETTING_KEY.CompanyLogo,
    SETTING_KEY.CompanyAddress,
    SETTING_KEY.CompanyAddressEn,
    SETTING_KEY.CompanyPhone,
    SETTING_KEY.CompanyEmail,
    SETTING_KEY.CompanyWebsite,
    SETTING_KEY.MainCurrency,
    // SETTING_KEY.SecondCurrency,
  ];

  isAdvanceSetting = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__ADVANCED_SETTING));
  isBasicSetting = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__BASIC_SETTING));

  override ngOnInit(): void {
    super.ngOnInit();
    this.isAdvanceSetting() || this.isBasicSetting() ? this.frm.enable()  : this.frm.disable();
  }

  uploadUrl = `${this.appSettingService.setting.AUTH_API_URL}/upload/file`;

  fileCompany: NzUploadFile[] = [];
  // image: Image = {};
  companyLogoUrl: string = "";

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        console.log("You can only upload JPG file!");
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 5;
      if (!isLt2M) {
        console.log("Image must smaller than 2MB!");
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  handleUploadCompany(info: NzUploadChangeParam): void {
    let fileCompanies = [...info.fileList];

    // 1. Limit 5 number of uploaded files
    fileCompanies = fileCompanies.slice(-5);

    // 2. Read from response and show file link
    fileCompanies = fileCompanies.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    this.fileCompany = fileCompanies;
    this.companyLogoUrl = this.fileCompany[0]?.url!;
  }
}
