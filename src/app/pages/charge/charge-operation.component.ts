import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Charge, ChargeService } from "./charge.service";
import { ChargeUiService } from "./charge-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import {
  SETTING_KEY,
  SystemSetting,
  SystemSettingService,
} from "../system-setting/system-setting.service";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys } from "../../const";

@Component({
  selector: "app-charge-unit-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.name || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.name || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <nz-spin
        *ngIf="isLoading()"
        style="position: absolute; top: 50%; left: 50%"
      ></nz-spin>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "Code" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input
              nz-input
              formControlName="code"
              [placeholder]="
                chargesAutoIdEnable() ? ('NewCode' | translate) : ''
              "
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "Name" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "ChargeType" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <app-lookup-item-select
              formControlName="chargeTypeId"
              [lookupType]="this.lookupItemType.ChargeType"
            ></app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "Unit" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <app-unit-select formControlName="unitId" [addOption]="true" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "ChargeRate" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <input nz-input formControlName="chargeRate" nzHasFeedback />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            "Note" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <textarea nz-input formControlName="note" rows="3"></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!modal?.isView">
        <button
          nz-button
          nzType="primary"
          [disabled]="!frm.valid"
          (click)="onSubmit($event)"
        >
          <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a
          (click)="uiService.showEdit(model.id || 0)"
          *ngIf="!isLoading() && isChargeEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isChargeEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isChargeRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isChargeRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ChargeOperationComponent extends BaseOperationComponent<Charge> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<ChargeOperationComponent>,
    public systemSettingService: SystemSettingService,
    private authService: AuthService,
    public override service: ChargeService,
    uiService: ChargeUiService
  ) {
    super(fb, ref, service, uiService);
  }
  chargesAutoIdEnable = signal<boolean>(false);

  isChargeEdit = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__EDIT)
  );
  isChargeRemove = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__REMOVE)
  );

  override initControl(): void {
    const {
      required,
      nameMaxLengthValidator,
      codeExistValidator,
      integerValidator,
      noteMaxLengthValidator,
      nameExistValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      code: [
        null,
        [required, nameMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      chargeTypeId: [null, [required]],
      unitId: [null, [required]],
      chargeRate: [0, [required, integerValidator]],
      note: [null, [noteMaxLengthValidator]],
    });
    setTimeout(() => {
      this.isLoading.set(true);
      if (this.modal?.chargeTypeId && this.modal?.chargeTypeId !== 0) {
        this.frm.patchValue({ chargeTypeId: this.modal.chargeTypeId });
      }
  
      if (this.modal?.unitId && this.modal?.unitId !== 0) {
        this.frm.patchValue({ unitId: this.modal.unitId });
      }

      this.isLoading.set(false);
    }, 50);
  }

  lookupItemType = LOOKUP_TYPE;

  override setFormValue(): void {
    console.log("hit");

    this.frm.setValue({
      code: this.model.code,
      name: this.model.name,
      unitId: this.model.unitId,
      chargeRate: this.model.chargeRate,
      chargeTypeId: this.model.chargeTypeId,
      note: this.model.note,
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.systemSettingService.find(SETTING_KEY.ChargesAutoId).subscribe({
      next: (result: any) => {
        if (result === 0) {
          this.chargesAutoIdEnable.set(false);
          this.frm.controls["code"].enable();
        } else {
          this.chargesAutoIdEnable.set(true);
          this.frm.controls["code"].disable();
        }
      },
    });
  }
}
