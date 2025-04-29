import { Component, effect, signal, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { SystemSettingService } from "./system-setting.service";
import { BaseSettingSectionComponent } from "../../utils/components/base-setting-section.component";

import { NotificationService } from "../../utils/services/notification.service";
import { SettingService } from "../../app-setting";
import { CommonValidators } from "../../utils/services/common-validators";
import { LocalStorageService } from "../../utils/services/localStorage.service";
import { HttpErrorResponse } from "@angular/common/module.d-CnjH8Dlt";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-pavr-section",
  template: `
    <app-indeterminate-bar
      class="loading-bar"
      *ngIf="loading"
    ></app-indeterminate-bar>

    <div class="sub-section">
      <h5>{{ "OtherApp" | translate }}</h5>
    </div>

    <form
      nz-form
      class="system-setting-form"
      [formGroup]="frm"
      [nzAutoTips]="autoTips"
    >
      <nz-form-item>
        <nz-form-control [nzSm]="7" nzAlign="right" style="text-align: right">
          <label
            [nzChecked]="isHrSystemChecked()"
            (nzCheckedChange)="isHrSystemChecked.set($event)"
            nz-checkbox
            >HR System</label
          >
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "Url" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <input formControlName="url" nz-input />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="7" [nzXs]="24" nzNoColon></nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <button nz-button (click)="testPavr()" style="margin-right:8px">
            <i *ngIf="loading" nz-icon nzType="loading"></i>
            {{ "Test" | translate }}
          </button>

          <button nz-button nzType="primary">
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
export class OtherAppSectionComponent extends BaseSettingSectionComponent {
  isHrSystemChecked = signal(false);

  constructor(
    fb: UntypedFormBuilder,
    settingService: SystemSettingService,
    notificationService: NotificationService,
    appSettingService: SettingService
  ) {
    super(fb, settingService, notificationService, appSettingService);

    effect(() => {
      const checked = this.isHrSystemChecked();
      const urlControl = this.frm?.get("url");
      if (urlControl) {
        if (checked) {
          urlControl.enable({ emitEvent: this.isHrSystemChecked() });
        } else {
          urlControl.reset(this.appSettingService.setting.BASE_API_URL, {
            emitEvent: false,
          });
          urlControl.disable({ emitEvent: this.isHrSystemChecked() });
        }
      }
    });
  }

  override ngOnInit(): void {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
      url: [this.appSettingService.setting.BASE_API_URL, required],
    });
  }

  testPavr() {
    if (this.loading) {
      return;
    }
    // if (!this.frm.valid) {
    //   return;
    // }
    this.loading = true;
    this.settingService
      .pavrTestUrl(this.frm.get("url")?.getRawValue())
      .subscribe({
        next: () => {
          this.settingService.initCurrentSetting().subscribe({
            next: () => {
              this.loading = false;
              this.notificationService.successNotification(
                "Successfully Updated"
              );
            },
          });
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
        },
      });
  }
}
