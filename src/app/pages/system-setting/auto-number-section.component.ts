import { Component, computed, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { SETTING_KEY, SystemSettingService } from "./system-setting.service";
import { BaseSettingSectionComponent } from "../../utils/components/base-setting-section.component";
import { NotificationService } from "../../utils/services/notification.service";
import { SettingService } from "../../app-setting";
import { AuthService } from "../../helpers/auth.service";

@Component({
  selector: "app-auto-number-section",
  template: `
    <app-indeterminate-bar
      class="loading-bar"
      *ngIf="loading"
    ></app-indeterminate-bar>
    <form
      nz-form
      class="system-setting-form"
      [formGroup]="frm"
      (ngSubmit)="submit()"
      [nzAutoTips]="autoTips"
    >
      <div class="sub-section">
        <h5>{{ "AutoNumber" | translate }}</h5>
      </div>

      <nz-form-item>
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "MemberAutoNo" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <app-auto-number-select
            formControlName="{{ SettingKey.MemberAutoId }}"
            [addOption]="canAddAutoNo"
            [showAllOption]="true"
            showAllLabel="-"
          ></app-auto-number-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "RedemptionAutoNo" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <app-auto-number-select
            formControlName="{{ SettingKey.RedemptionAutoId }}"
            [addOption]="canAddAutoNo"
            [showAllOption]="true"
            showAllLabel="-"
          ></app-auto-number-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "AgentAutoNo" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <app-auto-number-select
            formControlName="{{ SettingKey.AgentAutoId }}"
            [addOption]="canAddAutoNo"
            [showAllOption]="true"
            showAllLabel="-"
          ></app-auto-number-select>
        </nz-form-control>
      </nz-form-item> 
      
      <nz-form-item>
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "OfferAutoNo" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <app-auto-number-select
            formControlName="{{ SettingKey.OfferAutoId }}"
            [addOption]="canAddAutoNo"
            [showAllOption]="true"
            showAllLabel="-"
          ></app-auto-number-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
          {{ "TransNoAutoNo" | translate }}
        </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24">
          <app-auto-number-select
            formControlName="{{ SettingKey.TransNoAutoId }}"
            [addOption]="canAddAutoNo"
            [showAllOption]="true"
            showAllLabel="-"
          ></app-auto-number-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item *ngIf="isAutoNumberEdit()">
        <nz-form-label [nzSm]="7" [nzXs]="24" nzNoColon> </nz-form-label>
        <nz-form-control [nzSm]="8" [nzXs]="24" style="text-align: right">
          <button
            nz-button
            nzType="primary"
            [disabled]="!frm.valid || loading"
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
export class AutoNumberSectionComponent extends BaseSettingSectionComponent {
  constructor(
    fb: UntypedFormBuilder,
    settingService: SystemSettingService,
    notificationService: NotificationService,
    appSettingService: SettingService,
    private authService: AuthService
  ) {
    super(fb, settingService, notificationService, appSettingService);
  }
  canAddAutoNo = false;
  override keys = [
    SETTING_KEY.MemberAutoId,
    SETTING_KEY.RedemptionAutoId,
    SETTING_KEY.AgentAutoId,
    SETTING_KEY.OfferAutoId,
    SETTING_KEY.TransNoAutoId,
  ];

  isAutoNumberEdit = computed(() => true);

  override ngOnInit() {
    super.ngOnInit();
    this.isAutoNumberEdit() ? this.frm.enable() : this.frm.disable();
  }
}
