import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import {
  AccountTypes,
  LOOKUP_TYPE,
  RedeemStatuses,
} from "../lookup/lookup-type.service";
import { Redemption, RedemptionService } from "./redemption.service";
import { RedemptionUiService } from "./redemption-ui.service";
import { Member, MemberAccount, MemberService } from "../member/member.service";
import { TranslateService } from "@ngx-translate/core";
import {
  SETTING_KEY,
  SystemSettingService,
} from "../system-setting/system-setting.service";
import { Offer } from "../offer/offer.service";
import { SettingService } from "../../app-setting";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { Observable } from "rxjs";
import { getAccountBalance } from "../../utils/components/get-account-balance";
import { Account } from "../account/account.service";

@Component({
  selector: "app-redemption-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.redeemNo || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.redeemNo || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <div nz-row [nzGutter]="16">
        <!-- Column 1: Form -->
        <div nz-col [nzSm]="24" [nzLg]="14">
          <form nz-form [formGroup]="frm">
            <!-- Redeem No & Location -->
            <h3 style="line-height: 0.1">
              <nz-icon nzType="credit-card" nzTheme="outline" /> Transaction
              Details
            </h3>
            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-label nzRequired nzNoColon>Redeem No</nz-form-label>
                <nz-form-item>
                  <nz-form-control>
                    <input nz-input formControlName="redeemNo" />
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col [nzSpan]="12">
                <nz-form-label nzRequired nzNoColon>Location</nz-form-label>
                <nz-form-item>
                  <nz-form-control>
                    <app-location-select formControlName="locationId" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <!-- Member & Account -->
            <h3 style="margin-top:12px">
              <nz-icon nzType="user" nzTheme="outline" /> Member Information
            </h3>
            <div nz-row>
              <div nz-col [nzSpan]="12">
                <nz-form-label nzRequired nzNoColon
                  >Select Member</nz-form-label
                >
                <nz-form-item>
                  <nz-form-control>
                    <app-member-select formControlName="memberId" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
            <div nz-row>
              <div nz-col [nzSpan]="12">
                <nz-form-label nzRequired nzNoColon>Account Type</nz-form-label>
                <nz-form-item>
                  <nz-form-control>
                    <!-- <app-account-select formControlName="accountId" /> -->
                    <div nz-flex nzGap="small">
                      <!-- Show real account cards -->
                      <ng-container
                        *ngIf="sortedAccounts.length > 0; else emptyCards"
                      >
                        <div
                          *ngFor="let a of sortedAccounts"
                          class="account-card"
                          [ngClass]="{
                            'selected-card':
                              selectedAccount?.accountId == a.accountId
                          }"
                          (click)="selectAccountType(a)"
                        >
                          <div class="card-title">
                            <i
                              nz-icon
                              [nzType]="
                                a.accountType == AccountTypes.Wallet
                                  ? 'wallet'
                                  : 'star'
                              "
                              nzTheme="outline"
                            ></i>
                            {{
                              translateService.currentLang == "km"
                                ? a.accountTypeNameKh ?? ""
                                : a.accountTypeNameEn ?? ""
                            }}
                          </div>
                          <div class="card-value">
                            {{ getAccountBalance(a.accountType, a.balance) }}
                          </div>
                        </div>
                      </ng-container>

                      <!-- Empty placeholder cards -->
                      <ng-template #emptyCards>
                        <div class="account-card empty-card">
                          <div class="card-title">
                            <i nz-icon nzType="wallet" nzTheme="outline"></i>
                            <span class="placeholder-text">Wallet</span>
                          </div>
                          <div class="card-value">0.00 Available</div>
                        </div>

                        <div class="account-card empty-card">
                          <div class="card-title">
                            <i nz-icon nzType="star" nzTheme="outline"></i>
                            <span class="placeholder-text">Point</span>
                          </div>
                          <div class="card-value">0.00 Available</div>
                        </div>
                      </ng-template>
                    </div>
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <h3 style="margin-top:12px">
              <nz-icon nzType="file" nzTheme="outline" /> Additional Details
            </h3>

            <!-- Quantity & Ref No -->
            <nz-form-label nzRequired nzNoColon
              >{{ "Offer" | translate }}
            </nz-form-label>
            <nz-form-item>
              <nz-form-control>
                <app-offer-select
                  [memberId]="frm.get('memberId')?.value"
                  [accountId]="frm.get('accountId')?.value"
                  formControlName="offerId"
                  (selectedObject)="selectedOffer = $event"
                />
              </nz-form-control>
            </nz-form-item>

            <div class="account-card" *ngIf="selectedOffer; else emptyOffer">
              <div nz-flex nzGap="small">
                <nz-avatar
                  [nzSrc]="selectedOffer?.photo"
                  nzShape="square"
                  [nzSize]="64"
                  nzIcon="gift"
                ></nz-avatar>
                <div style="width:100%">
                  <strong> {{ selectedOffer?.name || "-" }} </strong><br />
                  <span>
                    {{
                      translateService.currentLang == "km"
                        ? selectedOffer?.offerTypeNameKh || "-"
                        : selectedOffer?.offerTypeNameEn || "-"
                    }} </span
                  ><br />
                  <div
                    nz-row
                    nzJustify="space-between"
                    nzAlign="middle"
                    style="width: 100%"
                  >
                    <strong>
                      {{
                        getAccountBalance(
                          selectedOffer?.redeemWith!,
                          selectedOffer?.redeemCost
                        )
                      }}
                    </strong>

                    <nz-input-number
                      style="width: 60px; margin-left:auto"
                      formControlName="qty"
                      [nzMin]="1"
                      [nzStep]="1"
                    ></nz-input-number>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #emptyOffer>
              <div class="account-card empty-card">
                <div nz-flex nzGap="small">
                  <nz-avatar
                    nzShape="square"
                    [nzSize]="64"
                    nzIcon="gift"
                  ></nz-avatar>
                  <div style="width:100%">
                    <strong> - </strong><br />
                    <span> - </span><br />
                    <div
                      nz-row
                      nzJustify="space-between"
                      nzAlign="middle"
                      style="width: 100%"
                    >
                      <strong>0.00</strong>
                      <nz-input-number
                        style="width: 60px; margin-left:auto"
                        formControlName="qty"
                        [nzMin]="1"
                        [nzStep]="1"
                      ></nz-input-number>
                    </div>
                  </div>
                </div>
              </div>
            </ng-template>

            <!-- <nz-form-label nzRequired nzNoColon>Quantity</nz-form-label>
                <nz-form-item>
                  <nz-form-control>
                    <input nz-input formControlName="qty" />
                  </nz-form-control>
                </nz-form-item> -->

            <nz-form-label nzNoColon>Reference No</nz-form-label>
            <nz-form-item>
              <nz-form-control>
                <input nz-input formControlName="refNo" />
              </nz-form-control>
            </nz-form-item>
            <!-- Notes -->
            <nz-form-label nzNoColon>Notes</nz-form-label>
            <nz-form-item>
              <nz-form-control>
                <textarea nz-input rows="3" formControlName="note"></textarea>
              </nz-form-control>
            </nz-form-item>

            <!-- Upload -->
            <nz-form-item>
              <nz-form-label>Attachment</nz-form-label>
              <nz-form-control>
                <nz-upload
                  [nzAction]="uploadUrl"
                  [(nzFileList)]="fileList"
                  (nzChange)="handleUpload($event)"
                >
                  <button nz-button>
                    <i nz-icon nzType="upload"></i> Upload
                  </button>
                </nz-upload>
              </nz-form-control>
            </nz-form-item>

            <!-- Buttons -->
            <div class="button-group">
              <button nz-button nzType="default">Cancel</button>
              <button nz-button nzType="primary">Save</button>
            </div>
          </form>
        </div>
        <!-- Column 2: Summary -->
        <div style="padding:12px" nz-row nz-col [nzSm]="24" [nzLg]="10">
          <div class="account-card">
            <div nz-flex nzGap="small">
              <nz-avatar
                [nzText]="selectedMember?.name?.substring(0, 2)"
                nzSize="large"
                [nzSrc]="selectedMember?.photo"
                style="background-color: #ccc"
              ></nz-avatar>
              <div>
                <strong> {{ selectedMember?.name || "-" }} </strong><br />
                <span> {{ selectedMember?.email || "-" }}</span
                ><br />
                <nz-tag>{{ selectedMember?.memberClassName || "-" }}</nz-tag>
              </div>
            </div>
          </div>

          <div
            class="account-card"
            nzFlex
            nzVertical="true"
            style="margin-top: 16px"
          >
            <h3 style="text-weight: 600">
              <nz-icon nzType="credit-card" nzTheme="outline" /> Transaction
              Summary
            </h3>
            <div nz-flex nzJustify="space-between">
              <span>{{ "CurrentBalance" | translate }}</span>

              <span>
                {{
                  selectedAccount
                    ? getAccountBalance(
                        selectedAccount.accountType,
                        selectedAccount.balance
                      )
                    : "0.00"
                }}
              </span>
            </div>
            <div nz-flex nzJustify="space-between">
              <span>{{ "RedeemCost" | translate }}</span>
              <span>
                {{  this.frm.get('accountId')?.value || "0.00"  }}
              </span>
            </div>

            <nz-divider style="margin: 8px 0"></nz-divider>

            <div><span>New balance</span></div>
          </div>
        </div>
      </div>
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
  styles: `
  .container {
  padding: 24px;
}
.selected-card {
  border: 1px solid #1890ff !important;
  color:  #1890ff; 
}
.empty-card {
  opacity: 0.6;
  background-color: #fafafa;
  pointer-events: none;
}

.placeholder-text {
  margin-left: 5px;
  font-weight: 500;
  color: #888;
}
 
.card-title {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-value { 
  margin-top: 4px;
}
  
nz-form-label{
  padding: 0px !important; 
}
.balance-card{
  min-width:190px;
}



.wallet-points {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.account-card{
  border:1px solid #d3d3d3;
  min-width: 170px ;
  border-radius: 8px;
  padding:12px;
}

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}
`,
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
    private systemSettingService: SystemSettingService,
    override uiService: RedemptionUiService
  ) {
    super(fb, ref, service, uiService);
  }
  nzShowIconList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
    showDownloadIcon: false,
  };

  selectedMember: Member | null = null;
  selectedAccount: MemberAccount | null = null;
  selectedOffer: Offer | null = null;
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

  onMemberChange() {
    this.memberService.find(this.frm.get("memberId")?.value).subscribe({
      next: (m: any) => {
        this.selectedMember = m;
      },
      error: (err) => {
        console.error("Failed to fetch member detail:", err);
      },
    });
  }

  selectAccountType(account: MemberAccount) {
    this.frm.get("accountId")?.patchValue(account.accountId);

    this.selectedAccount = account;
    console.log("this.selectedAccount", this.selectedAccount);
    console.log("account", account);
  }

  fileList: NzUploadFile[] = [];
  readonly LOOKUP_TYPE = LOOKUP_TYPE;

  isRedemptionRemove = computed(() => true);
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  disabled = false;

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
    const { noteMaxLengthValidator, required, integerValidator } =
      CommonValidators;

    this.frm = this.fb.group({
      redeemNo: [null, [required]],
      refNo: [null],
      accountId: [
        { value: this.model?.accountId ?? null, disabled: true },
        required,
      ],
      redeemedDate: [new Date().toISOString(), required],
      offerId: [
        { value: this.model?.offerId ?? null, disabled: true },
        [required],
      ],
      qty: [{ value: 1, disabled: false }, [integerValidator, required]],
      amount: [null, [required, integerValidator]],
      note: [null, [noteMaxLengthValidator]],
      status: [RedeemStatuses.Used, [required, integerValidator]],
      locationId: [null, [required, integerValidator]],
      memberId: [null, [required]],
    });

    this.frm.controls["memberId"]?.valueChanges.subscribe({
      next: () => {
        this.onMemberChange();
      },
    });
    this.frm.controls["qty"]?.valueChanges.subscribe({
      next: (qty) => {
        let amount = this.selectedOffer?.redeemCost! * Number(qty);
        this.frm.get("amount")?.setValue(amount);
      },
    });

    this.frm.controls["offerId"]?.valueChanges.subscribe({
      next: () => {
        let qty = this.frm.controls["qty"].value;
        let amount = this.selectedOffer?.redeemCost! * qty;

        this.frm.get("amount")?.setValue(amount);
      },
    });

    this.frm.get("memberId")?.valueChanges.subscribe((val) => {
      if (!this.modal?.isView) {
        this.frm.get("accountId")?.setValue(null);
        this.frm.get("offerId")?.setValue(null);
        this.frm.get("offerId")?.disable();
      } else {
        // add/edit state
        setTimeout(() => {
          this.frm.get("accountId")?.setValue(this.model?.accountId);
          this.frm.get("offerId")?.setValue(this.model?.offerId);
        }, 50);
      }

      if (val && !this.modal?.isView) {
        this.frm.get("accountId")?.enable();
      }
    });

    this.frm.get("accountId")?.valueChanges.subscribe((val) => {
      if (!this.modal?.isView) this.frm.get("offerId")?.setValue(null);
      if (val && !this.modal?.isView) {
        this.frm.get("offerId")?.enable();
      }
    });
  }

  override onSubmit(e?: any) {
    let attachments = this.fileList.map((f) => ({
      uid: f.uid,
      url: f.url,
      name: f.name,
      type: f.type,
    }));

    if (this.frm.valid && !this.isLoading()) {
      let operation$: Observable<Redemption> = this.service.add({
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
          next: (result: Redemption) => {
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

  get sortedAccounts() {
    return (this.selectedMember?.accounts ?? []).slice().sort((a, b) => {
      if (a.accountId === AccountTypes.Wallet) return -1;
      if (b.accountId === AccountTypes.Wallet) return 1;
      return 0;
    });
  }

  override setFormValue() {
    this.frm.patchValue({
      redeemNo: this.model.redeemNo,
      refNo: this.model.refNo,
      offerId: this.model.offerId,
      qty: this.model.qty,
      amount: this.model.amount,
      note: this.model.note,
      status: this.model.status,
      locationId: this.model.locationId,
      memberId: this.model.memberId,
      accountId: this.model.accountId,
      redeemedDate: this.model.redeemedDate,
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

  readonly getAccountBalance = getAccountBalance;
  readonly AccountTypes = AccountTypes;
}
