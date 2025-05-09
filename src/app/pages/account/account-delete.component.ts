import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseDeleteComponent } from "../../utils/components/base-delete.component";
import { Account, AccountService } from "./account.service";
import { AccountUiService } from "./account-ui.service";

@Component({
  selector: "app-account-delete",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id"
        >{{ "Remove" | translate }}
        {{ model?.memberName || ("loading" | translate) }}</span
      >
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <div
        *ngIf="errMessage() && !isLoading()"
        nz-row
        nzJustify="center"
        style="margin:2px 0"
      >
        <span nz-typography nzType="danger" style="position: absolute">{{
          errMessage() | translate
        }}</span>
      </div>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            "MemberName" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
            <input nz-input formControlName="memberName" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            "Note" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
            <textarea
              nz-input
              type="text"
              formControlName="note"
              rows="3"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button
        *ngIf="!errMessage() && model?.memberName"
        nz-button
        nzDanger
        nzType="primary"
        [disabled]="!frm.valid"
        (click)="onSubmit($event)"
      >
        <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
        {{ "Delete" | translate }}
      </button>
      <button nz-button nzType="default" (click)="cancel()">
        {{ "Cancel" | translate }}
      </button>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class AccountDeleteComponent extends BaseDeleteComponent<Account> {
  constructor(
    service: AccountService,
    uiService: AccountUiService,
    ref: NzModalRef<AccountDeleteComponent>,
    fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }

  override initControl() {
    const { required, noteMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      memberName: [{ value: null, disabled: true }, [required]],
      note: [null, noteMaxLengthValidator],
    });
  }
  override setFormValue() {
    this.frm.setValue({
      memberName: this.model.memberName,
      note: "",
    });
  }
}
