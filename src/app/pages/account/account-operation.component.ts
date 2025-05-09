import { Component, computed, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import { Account, AccountService } from "./account.service";
import { AccountUiService } from "./account-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";

@Component({
  selector: "app-account-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.memberId || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.memberId || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired
            >{{ "MemberId" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="memberId" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired
            >{{ "AccountType" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <app-lookup-item-select
              formControlName="accountType"
              [lookupType]="LOOKUP_TYPE.AccountType"
            >
            </app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item *ngIf="frm.get('accountType')?.value !== wallet">
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired
            >{{ "mainAccountId " | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <!-- <app-account-select
              formControlName="mainAccountId" 
            >
            </app-account-select> -->
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
          *ngIf="!isLoading() && isAccountEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isAccountEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isAccountRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isAccountRemove()"
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
export class AccountOperationComponent extends BaseOperationComponent<Account> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<AccountOperationComponent>,
    service: AccountService,
    private authService: AuthService,
    uiService: AccountUiService
  ) {
    super(fb, ref, service, uiService);
  }
  wallet = 1;
  isAccountEdit = computed(() => true);
  isAccountRemove = computed(() => true);
  override ngOnInit(): void {
    super.ngOnInit(); 
  }
  override initControl(): void {
    const { codeMaxLengthValidator, codeExistValidator, required } =
      CommonValidators;
    this.frm = this.fb.group({
      memberId: [null, [codeMaxLengthValidator(), required]],
      accountType: [null, [required]],
      mainAccountId: [null, [required]],
    });
  }
  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  override setFormValue() {
    this.frm.setValue({
      memberId: this.model.memberId,
      accountType: this.model.accountType,
      mainAccountId: this.model.mainAccountId,
    });
  }
}
