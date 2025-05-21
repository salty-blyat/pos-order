import {
  Component,
  computed,
  effect,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { SettingService } from "../../app-setting";
import { Redemption, RedemptionService } from "./redemption.service";
import { RedemptionUiService } from "./redemption-ui.service";
import { Member, MemberService } from "../member/member.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-redemption-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.refNo || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.refNo || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <!-- Row: RedeemNo | RefNo -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>
            {{ "RedeemNo" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="5" nzErrorTip>
            <input nz-input formControlName="redeemNo" />
          </nz-form-control>

          <nz-form-label [nzSpan]="5" nzRequired>
            {{ "RefNo" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="5">
            <input nz-input formControlName="refNo" />
          </nz-form-control>
        </nz-form-item>

        <!-- Row: Redeemed Date | Account -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>
            {{ "RedeemedDate" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="5" nzErrorTip>
            <nz-date-picker formControlName="redeemedDate"></nz-date-picker>
          </nz-form-control>

          <nz-form-label [nzSpan]="5" nzRequired>
            {{ "Location" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="5" nzErrorTip>
            <app-location-select formControlName="locationId">
            </app-location-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>
            {{ "Account" | translate }}
          </nz-form-label>
          <!-- <nz-form-control [nzSpan]="15">
            <div style="display: flex; gap: 8px; width: 100%;">
              <app-member-select
                (valueChanged)="getMembers($event)"
                style="width: 50%;"
              ></app-member-select>
              <nz-select formControlName="accountId" style="width: 50%;">
                <nz-option
                  *ngFor="let account of member()?.accounts ?? []"
                  [nzValue]="account.accountId"
                  [nzLabel]="
                    translateService.currentLang === 'km'
                      ? account.accountTypeNameKh ?? ''
                      : account.accountTypeNameEn ?? ''
                  "
                ></nz-option>
              </nz-select>
            </div>
          </nz-form-control> -->
        </nz-form-item>

        <!-- Row: Offer ID | Amount -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>
            {{ "Offer" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="5" nzErrorTip>
            <app-offer-select formControlName="offerId"> </app-offer-select>
          </nz-form-control>

          <nz-form-label [nzSpan]="5" nzRequired>
            {{ "Amount" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="5">
            <input nz-input formControlName="amount" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>
            {{ "Status" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="5">
            <app-lookup-item-select
              formControlName="status"
              [lookupType]="LOOKUP_TYPE.RedeemStatus"
            >
            </app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>

        <!-- Row: Note (Full Width) -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">
            {{ "Note" | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="15">
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
          *ngIf="!isLoading() && isRedemptionEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRedemptionEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isRedemptionRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRedemptionRemove()"
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
export class RedemptionOperationComponent extends BaseOperationComponent<Redemption> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RedemptionOperationComponent>,
    service: RedemptionService,
    public translateService: TranslateService,
    public memberService: MemberService,
    private authService: AuthService,
    private settingService: SettingService,
    override uiService: RedemptionUiService
  ) {
    super(fb, ref, service, uiService);
    effect(() => {
      if (this.member() == null) {
        this.frm.controls["accountId"].disable();
      } else {
        this.frm.controls["accountId"].enable();
      }
    });
  }
  member = signal<Member | null>(null);
  getMembers(id: number) {
    this.memberService.find(id).subscribe({
      next: (result) => {
        this.member.set(result);
        this.frm.controls["accountId"].reset();
      },
    });
  }

  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  isRedemptionEdit = computed(() => true);
  isRedemptionRemove = computed(() => true);

  override initControl(): void {
    const { noteMaxLengthValidator, required, integerValidator } =
      CommonValidators;
    this.frm = this.fb.group({
      redeemNo: [null, [required]],
      refNo: [null],
      accountId: [null, required],
      redeemedDate: [null, required],
      offerId: [null, [required]],
      qty: [1, [required]],
      amount: [0, [required, integerValidator]],
      note: [null, [noteMaxLengthValidator]],
      status: [null, [required, integerValidator]],
      locationId: [null, [required, integerValidator]],
    });
    // setTimeout(() => {
    //   if (this.modal.offerTypeId !== 0 && this.modal.offerTypeId)
    //     this.frm.patchValue({ offerType: this.modal.offerTypeId });
    //   if (this.modal.offerGroupId !== 0 && this.modal.offerGroupId)
    //     this.frm.patchValue({ offerGroupId: this.modal.offerGroupId });
    //   if (this.modal.accountTypeId !== 0 && this.modal.accountTypeId)
    //     this.frm.patchValue({ redeemWith: this.modal.accountTypeId });
    // }, 50);
  }

  override setFormValue() {
    this.frm.setValue({
      redeemNo: this.model.redeemNo,
      refNo: this.model.refNo,
      offerId: this.model.offerId,
      qty: this.model.qty,
      amount: this.model.amount,
      note: this.model.note,
      status: this.model.status,
      locationId: this.model.locationId,
    });
  }
}
