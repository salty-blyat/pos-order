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
import {
  SETTING_KEY,
  SystemSettingService,
} from "../system-setting/system-setting.service";
import { LookupItem } from "../lookup/lookup-item/lookup-item.service";
import { Offer } from "../offer/offer.service";

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
      <form
        nz-form
        [formGroup]="frm"
        [style.height.%]="100"
        [nzAutoTips]="autoTips"
      >
        <div nz-row>
          <div nz-col [nzXs]="24">
            <div nz-row>
              <div nz-col [nzXs]="12">
                <nz-form-item>
                  <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                    >{{ "RedeemNo" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
                    <input
                      [autofocus]="true"
                      nz-input
                      formControlName="redeemNo"
                      [placeholder]="
                        frm.controls['redeemNo'].disabled
                          ? ('RedeemNo' | translate)
                          : ''
                      "
                    />
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col [nzXs]="12">
                <nz-form-item>
                  <nz-form-label [nzSm]="8" [nzXs]="24"
                    >{{ "RefNo" | translate }}
                  </nz-form-label>

                  <nz-form-control [nzSm]="14" [nzXs]="24">
                    <input nz-input formControlName="refNo" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
            <div nz-row>
              <div nz-col [nzXs]="12">
                <nz-form-item>
                  <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                    >{{ "Quantity" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip>
                    <input nz-input formControlName="qty" />
                  </nz-form-control>
                </nz-form-item>
              </div>

              <div nz-col [nzXs]="12">
                <nz-form-item>
                  <nz-form-label [nzSm]="8" [nzXs]="24"
                    >{{ "Status" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                    <app-lookup-item-select
                      [lookupType]="LOOKUP_TYPE.RedeemStatus"
                      formControlName="status"
                    />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <div nz-row>
              <div nz-col [nzXs]="12">
                <nz-form-item>
                  <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                    >{{ "Member" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                    <app-member-select
                      (valueChanged)="selectedMember.set($event)"
                      nzErrorTip
                    />
                  </nz-form-control>
                </nz-form-item>
              </div>

              <div nz-col [nzXs]="12">
                <nz-form-item>
                  <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                    >{{ "Offer" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                    <app-offer-select
                      (valueChanged)="selectedOffer.set($event)"
                      formControlName="offerId"
                      nzErrorTip
                    />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <div nz-row>
              <div nz-col [nzXs]="12">
                <nz-form-item>
                  <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                    >{{ "AccountType" | translate }}
                  </nz-form-label>
                  <!-- <nz-form-control [nzSm]="14" [nzXs]="24">
                    <nz-select
                      [ngModel]="selectedMember()?.accountId"
                      formControlName="accountId"
                      nzPlaceHolder="Select account"
                    >
                      <nz-option
                        *ngFor="let acc of selectedMember()?.accounts || []"
                        [nzValue]="acc.accountId"
                        [nzLabel]="
                          translateService.currentLang == 'km'
                            ? acc.accountTypeNameKh
                            : acc.accountTypeNameEn
                        "
                      ></nz-option>
                    </nz-select>
                  </nz-form-control> -->
                </nz-form-item>
              </div>
            </div>

            <div nz-row>
              <div nz-col [nzSpan]="24">
                <nz-form-item>
                  <nz-form-label [nzSpan]="4"
                    >{{ "Note" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzXs]="19">
                    <textarea
                      nz-input
                      type="text"
                      formControlName="note"
                      rows="3"
                    ></textarea>
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
          </div>
        </div>
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
    private systemSettingService: SystemSettingService,
    override uiService: RedemptionUiService
  ) {
    super(fb, ref, service, uiService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.systemSettingService.find(SETTING_KEY.RedemptionAutoId).subscribe({
      next: (value?: string) => {
        if (Number(value) !== 0) {
          this.frm.get("redeemNo")?.disable();
        }
      },
    });
  }
  member = signal<Member | null>(null);
  // getMembers(id: number) {
  //   this.memberService.find(id).subscribe({
  //     next: (result) => {
  //       this.member.set(result);
  //       this.frm.controls["accountId"].reset();
  //     },
  //   });
  // }
  selectedOffer = signal<Offer | null>(null);
  selectedMember = signal<Member | null>(null);
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
      redeemedDate: [new Date().toISOString(), required],
      offerId: [null, [required]],
      qty: [1, [required]],
      amount: [null, [required, integerValidator]],
      note: [null, [noteMaxLengthValidator]],
      status: [null, [required, integerValidator]],
      locationId: [null, [required, integerValidator]],
    });

    this.frm.controls["qty"]?.valueChanges.subscribe({
      next: (qty) => {
        console.log(qty);
        const amount = this.selectedOffer()?.redeemCost! * qty;
        this.frm.controls["amount"].setValue(amount);
      },
    });

    this.frm.controls["offerId"]?.valueChanges.subscribe({
      next: (offer: Offer) => {
        const qty = this.frm.controls["qty"].value;
        const amount = offer?.redeemCost! * qty;
        console.log(this.selectedOffer());
        console.log(amount);
        this.frm.controls["amount"].setValue(amount);
      },
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
