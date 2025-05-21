import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { CommonValidators } from "../../utils/services/common-validators";
import {
  SETTING_KEY,
  SystemSettingService,
} from "../system-setting/system-setting.service";
import { AuthService } from "../../helpers/auth.service";
import {
  Account,
  AccountService,
  Transaction,
} from "../account/account.service";
import { AccountUiService } from "../account/account-ui.service";

@Component({
  selector: "app-transaction-view",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id">{{
        model?.transNo || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()" />
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24">
            {{ "TransNo" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
            <input
              nz-input
              formControlName="transNo"
              placeholder="{{ editableCode ? ('TransNo' | translate) : '' }}"
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "Type" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="type" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "Date" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <nz-date-picker formControlName="transDate"></nz-date-picker>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "Note" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <textarea nz-input formControlName="note" rows="3"></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="modal?.isView">
        <a
          nz-typography
          nzType="danger"
          *ngIf="!isLoading() && isTransactionRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isTransactionRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class TransactionViewComponent extends BaseOperationComponent<Transaction> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<TransactionViewComponent>,
    override service: AccountService,
    override uiService: AccountUiService,
    private systemSettingService: SystemSettingService,
    private authService: AuthService
  ) {
    super(fb, ref, service, uiService);
  }

  isTransactionRemove = computed(() => true);
  editableCode: boolean = false;

  override ngOnInit(): void {
    if (this.isLoading()) return;
    this.initControl();

    this.frm.disable();
    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.ref.triggerCancel().then();
    });

    if (this.modal?.id) {
      this.isLoading.set(true);
      this.service
        .findTransaction(this.modal?.id)
        .subscribe((result: Transaction) => {
          this.model = result;
          this.setFormValue();
          this.isLoading.set(false);
        });
    }
  }

  override initControl(): void {
    this.frm = this.fb.group({
      transNo: [{ value: null, disabled: true }],
      transDate: [{ value: null, disabled: true }],
      accountId: [{ value: null, disabled: true }],
      amount: [{ value: null, disabled: true }],
      type: [{ value: null, disabled: true }],
      note: [{ value: null, disabled: true }],
      refNo: [{ value: null, disabled: true }],
    });
  }

  override setFormValue(): void {
    this.frm.setValue({
      transNo: this.model.transNo,
      transDate: this.model.transDate,
      accountId: this.model.accountId,
      amount: this.model.amount,
      type: this.model.type,
      note: this.model.note,
      refNo: this.model.refNo,
    });
  }
}
