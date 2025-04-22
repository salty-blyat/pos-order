import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SETTING_KEY,
  SettingList,
  SystemSettingService,
} from '../../pages/system-setting/system-setting.service';
import { NotificationService } from '../../utils/services/notification.service';
import { CommonValidators } from '../../utils/services/common-validators';
import { SettingService } from '../../app-setting';
import { LocalStorageService } from '../../utils/services/localStorage.service';

@Component({
    template: ``,
    standalone: false
})
export class BaseSettingSectionComponent implements OnInit {
  constructor(
    protected fb: UntypedFormBuilder,
    protected settingService: SystemSettingService,
    protected notificationService: NotificationService,
    protected appSettingService: SettingService
  ) {}
  autoTips = CommonValidators.autoTips;
  SettingKey: {} | any = SETTING_KEY;
  frm!: FormGroup;
  keys: any[] = [];
  setting!: SettingList;
  loading: boolean = false;
  submit(): void {
    let localStorageService = new LocalStorageService();
    if (this.loading) {
      return;
    }
    if (!this.frm.valid) {
      return;
    }
    this.loading = true;

    this.keys.forEach((key) => {
      if (key === SETTING_KEY.MainCurrency) {
        localStorageService.setValue({
          key: SETTING_KEY.MainCurrency,
          value: parseInt(this.frm.value[SETTING_KEY.MainCurrency]),
        });
      }
      this.setting.set(key, this.frm.controls[key].value);
    });

    this.settingService.updateByItems(this.setting.items).subscribe({
      next: () => {
        this.settingService.initCurrentSetting().subscribe({
          next: () => {
            this.loading = false;
            this.notificationService.successNotification(
              'Successfully Updated'
            );
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  initControl() {
    const { required } = CommonValidators;
    this.frm = this.fb.group({});
    this.keys.forEach((x) => {
      this.frm.addControl(x, new FormControl(null, required));
      if (x == SETTING_KEY.CustomerDefaultId) {
        !this.frm.value[SETTING_KEY.CustomerDefaultId]
          ? this.frm.get(SETTING_KEY.CustomerDefaultId)?.patchValue(0)
          : this.frm.value[SETTING_KEY.CustomerDefaultId];
      }
    });
  }

  ngOnInit(): void {
    this.initControl();
    this.loading = true;
    this.settingService.getByItems(this.keys).subscribe({
      next: (result) => {
        this.setting = result;
        this.setting.items.forEach((item: any) => {
          if (item.key.includes('Company')) {
            this.frm.get(item.key)?.patchValue(item.value);
          } else {
            this.frm.get(item.key)?.patchValue(parseInt(item.value));
          }
        });

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }
}
