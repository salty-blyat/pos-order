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
  TransactionAdjust,
} from "./account.service";
import { AccountUiService } from "./account-ui.service";
import {
  AccountTypes,
  LOOKUP_TYPE,
  TransactionTypes,
} from "../lookup/lookup-type.service";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { SettingService } from "../../app-setting";
import { Observable } from "rxjs";
import { getAccountBalance } from "../../utils/components/get-account-balance";

@Component({
  selector: "app-account-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.transNo || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.transNo || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>

      <form
        nz-form
        [formGroup]="frm"
        [style.height.%]="100"
        [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24">
            {{ "TransNo" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input
              nz-input
              formControlName="transNo"
              [placeholder]="
                frm.controls['transNo'].disabled ? ('TransNo' | translate) : ''
              "
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>{{
            "Location" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <app-location-select formControlName="locationId" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>
            {{ "Amount" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-input-group>
              <nz-input-number
                [nzMin]="0"
                [nzControls]="false"
                [nzPrecision]="2"
                formControlName="amount"
              >
                <span nzInputSuffix>{{
                  modal?.accountType == AccountTypes.Wallet ? "$" : " pts"
                }}</span>
              </nz-input-number>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item *ngIf="modal?.isView">
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "Type" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <app-lookup-item-select
              [lookupType]="LOOKUP_TYPE.TransactionType"
              formControlName="type"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item *ngIf="modal?.isView">
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "Date" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-date-picker formControlName="transDate"></nz-date-picker>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "Note" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea nz-input formControlName="note" rows="3"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "Attachment" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-upload
              [nzAction]="uploadUrl"
              [nzDisabled]="modal?.isView"
              [(nzFileList)]="fileList"
              [nzShowUploadList]="nzShowIconList"
              (nzChange)="handleUpload($event)"
              list
            >
              <button nz-button [disabled]="modal?.isView">
                <i nz-icon nzType="upload"></i>
                Upload
              </button>
            </nz-upload>
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
export class AccountOperationComponent extends BaseOperationComponent<TransactionAdjust> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<AccountOperationComponent>,
    override service: AccountService,
    override uiService: AccountUiService,
    private systemSettingService: SystemSettingService,
    private settingService: SettingService,
    private authService: AuthService
  ) {
    super(fb, ref, service, uiService);
  }
  fileList: NzUploadFile[] = [];
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  disabled = false;
  nzShowIconList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
    showDownloadIcon: false,
  };
  isTransactionRemove = computed(() => true);

  override ngOnInit(): void {
    super.ngOnInit();
    console.log(this.modal);
    if (!this.modal?.isView) {
      this.systemSettingService.find(SETTING_KEY.TransNoAutoId).subscribe({
        next: (value?: string) => {
          if (Number(value) !== 0) {
            this.frm.get("transNo")?.disable();
          }
        },
      });
    }
  }

  override onSubmit(e?: any) {
    let attachments = this.fileList.map((f) => ({
      uid: f.uid,
      url: f.url,
      name: f.name,
      type: f.type,
    }));
    console.log(e);

    if (this.frm.valid && !this.isLoading()) {
      let operation$: Observable<TransactionAdjust> = this.service.add({
        ...this.frm.getRawValue(),
        attachments: attachments,
      });
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
          attachments: attachments,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        this.isLoading.set(true);
        operation$.subscribe({
          next: (result: TransactionAdjust) => {
            this.model = result;
            this.isLoading.set(false);
            this.ref.triggerOk().then();
          },
          error: (error: any) => {
            console.log(error);
            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
      }
    }
  }

  handleUpload(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];

    // 1. Limit 5 number of uploaded files
    fileList = fileList.slice(-10);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    this.fileList = fileList;
  }

  override initControl(): void {
    const { noteMaxLengthValidator, required } = CommonValidators;
    this.frm = this.fb.group({
      transNo: [null, required],
      transDate: [new Date().toISOString()],
      accountId: [this.modal.accountId, required],
      amount: [{ value: 1, disabled: false }, [required]],
      type: [this.modal.type, required],
      note: [null, noteMaxLengthValidator],
      locationId: [null, required],
      refNo: [null],
    });
  }

  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  readonly TransactionTypes = TransactionTypes;
  AccountTypes = AccountTypes;
  getAccountBalance = getAccountBalance;

  override setFormValue(): void {
    this.frm.patchValue({
      transNo: this.model.transNo,
      transDate: this.model.transDate,
      accountId: this.model.accountId,
      amount: this.model.amount,
      type: this.model.type,
      note: this.model.note,
      locationId: this.model.locationId,
      refNo: this.model.refNo,
    });
    this.fileList =
      this.model.attachments?.map(
        (file) =>
          <NzUploadFile>{
            name: file.name,
            url: file.url,
            uid: file.uid,
          }
      ) ?? [];
  }
  override ngOnDestroy(): void {
    this.refreshSub$.unsubscribe();
  }
}
