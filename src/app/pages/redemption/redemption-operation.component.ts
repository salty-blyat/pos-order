import { Component, computed, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import {
  AccountTypes,
  LOOKUP_TYPE,
  OfferType,
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
import { Offer, OfferService } from "../offer/offer.service";
import { SettingService } from "../../app-setting";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { Observable, Subscriber, Subscription } from "rxjs";
import { Currency, CurrencyService } from "../currency/currency.service";
import { ReportService } from "../report/report.service";
import { AuthKeys } from "../../const";

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
      <form nz-form [formGroup]="frm">
        <div nz-row [nzGutter]="16">
          <!-- Column 1: Form -->
          <div nz-col [nzSm]="24" [nzLg]="14">
            <h3 class="header">
              <nz-icon nzType="credit-card" nzTheme="outline" />
              {{ "TransactionDetail" | translate }}
            </h3>
            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-label nzRequired nzNoColon>{{
                  "RedeemNo" | translate
                }}</nz-form-label>
                <nz-form-item>
                  <nz-form-control>
                    <input
                      nz-input
                      formControlName="redeemNo"
                      [placeholder]="
                        frm.controls['redeemNo'].disabled
                          ? ('NewCode' | translate)
                          : ''
                      "
                    />
                  </nz-form-control>
                </nz-form-item>
              </div>

              <div nz-col [nzSpan]="12">
                <nz-form-label nzRequired nzNoColon>{{
                  "Location" | translate
                }}</nz-form-label>
                <nz-form-item>
                  <nz-form-control>
                    <app-location-select formControlName="locationId" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
            <h3 class="header">
              <nz-icon nzType="user" nzTheme="outline" />
              {{ "MemberInformation" | translate }}
            </h3>
            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-label nzRequired nzNoColon>{{
                  "Member" | translate
                }}</nz-form-label>
                <nz-form-item>
                  <nz-form-control>
                    <app-member-select
                      formControlName="memberId"
                      [loadMoreOption]="true"
                    />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
            <!-- member card -->
            <div class="account-card member-card">
              <div nz-flex nzGap="small">
                <nz-avatar
                  [nzText]="selectedMember?.name?.substring(0, 2)"
                  nzSize="large"
                  [nzSrc]="selectedMember?.photo"
                  style="background-color: #ccc"
                ></nz-avatar>

                <div>
                  <strong>{{ selectedMember?.name || "-" }} </strong><br />
                  <span *ngIf="selectedMember?.phone">
                    <i nz-icon nzType="phone" nzTheme="outline"></i>
                    {{ selectedMember?.phone }}
                  </span>
                  <br *ngIf="selectedMember?.phone" />
                  <span *ngIf="selectedMember?.joinDate"
                    ><i nz-icon nzType="calendar" nzTheme="outline"></i>
                    {{ selectedMember?.joinDate | customDate }}
                  </span>
                  <br />
                </div>

                <div
                  class="account-container"
                  nz-flex
                  nzVertical
                  *ngIf="sortedAccounts.length > 0"
                >
                  <strong style="text-align:right">{{
                    selectedMember?.memberClassName || "-"
                  }}</strong>
                  <div
                    style="margin-top:auto; margin-left: auto;"
                    nz-flex
                    nzGap="small"
                  >
                    <div nz-flex nzVertical *ngFor="let a of sortedAccounts">
                      <div class="card-value">
                        <img [src]="a.accountTypeImage" [alt]="a.accountType" />
                        {{
                          a.balance
                            | accountBalance : a.accountType : true
                            | translate
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nz-form-label nzNoColon>{{ "RefNo" | translate }}</nz-form-label>
            <nz-form-item>
              <nz-form-control>
                <input nz-input formControlName="refNo" />
              </nz-form-control>
            </nz-form-item>

            <!-- Notes -->
            <nz-form-label nzNoColon>{{ "Note" | translate }}</nz-form-label>
            <nz-form-item>
              <nz-form-control>
                <textarea nz-input rows="3" formControlName="note"></textarea>
              </nz-form-control>
            </nz-form-item>

            <!-- Upload -->
            <nz-form-item>
              <nz-form-label>{{ "Attachment" | translate }}</nz-form-label>
              <nz-form-control>
                <nz-upload
                  [nzAction]="uploadUrl"
                  [(nzFileList)]="fileList"
                  [nzShowUploadList]="
                    modal?.isView ? nzShowButtonView : nzShowIconList
                  "
                  (nzChange)="handleUpload($event)"
                >
                  <button nz-button [disabled]="modal?.isView" type="button">
                    <i nz-icon nzType="upload"></i> Upload
                  </button>
                </nz-upload>
              </nz-form-control>
            </nz-form-item>
          </div>
          <!-- Column 2: Summary -->
          <div class="additional-detail" nz-row nz-col [nzSm]="24" [nzLg]="10">
            <h3 class="header">
              <nz-icon nzType="file" nzTheme="outline" />
              {{ "AdditionalDetail" | translate }}
            </h3>

            <!-- Quantity & Ref No -->
            <nz-form-label nzRequired nzNoColon
              >{{ "Offer" | translate }}
            </nz-form-label>
            <nz-form-item>
              <nz-form-control>
                <app-offer-select
                  [memberId]="frm.get('memberId')?.value"
                  formControlName="offerId"
                  (selectedObject)="selectedOffer = $event"
                  [isAvailable]="!modal?.isView"
                />
              </nz-form-control>
            </nz-form-item>
            <div
              class="offer-card"
              nz-flex
              nzGap="small"
              *ngIf="selectedOffer; else emptyOffer"
            >
              @if(selectedOffer?.photo){
              <img [src]="selectedOffer?.photo" alt="" />
              } @else {
              <img src="./assets/image/img-not-found.jpg" alt="" />
              }
              <div style="width:100%; padding:8px 8px 8px 0">
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
                      extData.redeemCost
                        | accountBalance : selectedOffer.redeemWith!
                        | translate
                    }}
                  </strong>

                  <nz-input-number
                    nzSize="small"
                    class="num-input"
                    formControlName="qty"
                    [nzMin]="1"
                    [nzStep]="1"
                  ></nz-input-number>
                </div>
              </div>
            </div>

            <ng-template #emptyOffer>
              <div class="offer-card empty-card" nz-flex nzGap="small">
                <img src="./assets/image/img-not-found.jpg" alt="" />
                <div style="width:100%; padding:8px 8px 8px 0">
                  <strong>-</strong><br />
                  <span>-</span><br />
                  <div
                    nz-row
                    nzJustify="space-between"
                    nzAlign="middle"
                    style="width: 100%"
                  >
                    <span>-</span>

                    <nz-input-number
                      nzSize="small"
                      style="width: 60px; margin-left:auto"
                      formControlName="qty"
                      [nzMin]="1"
                      [nzStep]="1"
                    ></nz-input-number>
                  </div>
                </div>
              </div>
            </ng-template>

            <div
              class="account-card"
              nzFlex
              nzVertical="true"
              style="margin-top: 16px;height:170px"
            >
              <h3 class="title">
                <nz-icon nzType="credit-card" nzTheme="outline" />
                {{ "TransactionSummary" | translate }}
              </h3>
              <div nz-flex nzJustify="space-between">
                <span>{{ "Balance" | translate }}</span>
                <span>{{
                  extData?.startBalance
                    | accountBalance
                      : selectedOffer?.redeemWith || AccountTypes.Wallet
                      : true
                }}</span>
              </div>

              <div nz-flex nzJustify="space-between">
                <div>
                  <span>{{ "RedeemCost" | translate }}</span>
                  <span *ngIf="selectedOffer">
                    (x{{ frm.get("qty")?.value }})</span
                  >
                </div>
                @if(selectedOffer){ @if(frm.get("amount")?.value == 0){
                <span>
                  {{ "Free" | translate }}
                </span>
                } @else {
                <span style="color: red"
                  >{{
                    frm.get("amount")?.value
                      | accountBalance : selectedOffer?.redeemWith!
                  }}
                </span>
                } } @else {
                <span>-</span>
                }
              </div>

              <div style="margin-top:30px">
                <nz-divider class="divider"></nz-divider>
                <div nz-flex nzJustify="space-between">
                  <span>{{ "RemainingBalance" | translate }}</span>
                  <span
                    [ngStyle]="{
                      'font-weight': 'bold',
                      color: extData?.endingBalance! < 0 ? 'red' : ''
                    }"
                  >
                    {{
                      extData?.endingBalance
                        | accountBalance
                          : selectedOffer?.redeemWith || AccountTypes.Wallet
                          : true
                    }}
                  </span>
                </div>
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
        <div nz-flex nzJustify="space-between">
          <a
            *ngIf="isRedemptionPrint()"
            nz-dropdown
            (click)="uiService.showPrint(model, RedeemPrint)"
          >
            <span nz-icon nzType="printer" nzTheme="outline"></span>
            {{ "Print" | translate }}
          </a>
          <div class="col-action action-container">
            <a
              *ngIf="!isLoading() && isRedemptionRemove()"
              class="delete"
              nz-typography
              [nzDisabled]="model?.status == RedeemStatuses.Removed"
              (click)="uiService.showDelete(model.id || 0)"
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
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  styles: ` 
  .account-container{
margin-left:auto;
  }
  .divider {
    margin: 8px 0;
  }
  .additional-detail{
    padding: 0 12px 12px 12px;
  }
  .action-container{
    margin-left:auto;
  }
  .header{
    line-height:0.1;
  }
  .title{
    text-weight: 600;
  }
  .qty-container {
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 8px;
  color: #fafafa;
}

  :host   .anticon-delete {
    color:red !important;
  }
  :host .delete{
  color: var(--ant-error-color) !important;
}
  :host .delete:hover{
  color: var(--ant-error-color);
} 
.empty-card {
  opacity: 0.6;
  background-color: #fafafa;
  pointer-events: none;
}
.offer-card{
  height: 87px;
  border:1px solid #d3d3d3;
  min-width: 170px ;
  border-radius: 8px; 
  img{ 
     border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  
     border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
    width: 100px;
    object-fit:cover;
  }
} 

.card-value { 
  margin-top: 4px;display: flex; align-items: center; 
  img{ margin-right: 4px; height:22px;
  }
}
.num-input{
  width: 60px !important; 
  margin-left:auto;
}
  
nz-form-label{
  padding: 0px !important; 
}   
.member-card{
  margin-bottom: 12px;
}
.account-card{
  border:1px solid #d3d3d3;
  min-width: 170px ;
  border-radius: 8px;
  padding:12px;
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
    private reportService: ReportService,
    public offerService: OfferService,
    public currency: CurrencyService,
    private authService: AuthService,
    private settingService: SettingService,
    private systemSettingService: SystemSettingService,
    override uiService: RedemptionUiService
  ) {
    super(fb, ref, service, uiService);
  }

  selectedMember: Member | null = null;
  selectedOffer: Offer | null = null;
  extData: {
    cardNumber: String;
    redeemCost: number;
    startBalance: number;
    endingBalance: number;
  } = { cardNumber: "", redeemCost: 0, startBalance: 0, endingBalance: 0 };
  RedeemPrint = 1;

  override ngOnInit(): void {
    super.ngOnInit();
    this.getReports();
    if (!this.modal?.isView) {
      this.systemSettingService.find(SETTING_KEY.RedemptionAutoId).subscribe({
        next: (value?: string) => {
          if (Number(value) !== 0) {
            this.frm.get("redeemNo")?.disable();
          }
        },
      });
    }
  }
  reports: Report[] = [];
  getReports() {
    this.reportService
      .search({
        pageIndex: 1,
        pageSize: 9999999,
        sorts: "",
        filters: "",
      })
      .subscribe({
        next: (result: any) => {
          this.reports = result.results;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  //view
  nzShowButtonView = {
    showPreviewIcon: true,
    showRemoveIcon: false,
    showDownloadIcon: false,
  };
  // add | edit
  nzShowIconList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };
  memberLoading = false;
  onMemberChange() {
    if (this.memberLoading) return;

    const memberId = this.frm.get("memberId")?.value;

    if (memberId != null) {
      this.memberLoading = true;
      setTimeout(() => {
        this.memberService.find(memberId).subscribe({
          next: (m: any) => {
            this.selectedMember = m;
            if (!this.modal?.isView) this.selectedOffer = null;
            this.memberLoading = false;
          },
          error: (err) => {
            console.error("Failed to fetch member detail:", err);
            this.memberLoading = false;
          },
        });
      }, 50);
    }
  }

  fileList: NzUploadFile[] = [];
  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  isRedemptionPrint = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__REDEMPTION__PRINT)
  );
  isRedemptionRemove = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__REDEMPTION__REMOVE)
  );

  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  selectedAccount: MemberAccount | null = null;

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
      accountId: [{ value: null, disabled: true }, required],
      redeemedDate: [new Date(), required],
      offerId: [{ value: null, disabled: true }, [required]],
      qty: [{ value: 1, disabled: false }, [integerValidator, required]],
      amount: [{ value: 0, disabled: false }, [required]],
      note: [null, [noteMaxLengthValidator]],
      status: [RedeemStatuses.Used, [required, integerValidator]],
      locationId: [null, [required, integerValidator]],
      memberId: [null, [required]],
      extData: [null],
    });

    if (this.modal?.memberId) {
      setTimeout(() => {
        this.frm.get("memberId")?.setValue(this.modal.memberId);
        this.frm.get("memberId")?.disable();
        this.onMemberChange();
      }, 50);
    }

    this.frm.controls["memberId"]?.valueChanges.subscribe({
      next: () => {
        setTimeout(() => {
          if (!this.modal?.isView) {
            this.frm.get("offerId")?.enable();
            this.frm.get("offerId")?.setValue(null);
          } else {
            this.frm.get("offerId")?.setValue(this.model?.offerId);
          }
          this.onMemberChange();
          this.getCurrentBalance();
          this.remainingBalance();
        }, 50);
      },
    });

    this.frm.controls["qty"]?.valueChanges.subscribe({
      next: () => {
        setTimeout(() => {
          this.setAmountControl();
          this.setExtDataControl();
          this.remainingBalance();
        }, 50);
      },
    });

    this.frm.controls["offerId"]?.valueChanges.subscribe({
      next: () => {
        setTimeout(() => {
          this.selectedAccount =
            this.selectedMember?.accounts?.find(
              (a) => a.accountType == this.selectedOffer?.redeemWith
            ) ?? null;

          this.frm.get("accountId")?.setValue(this.selectedAccount?.accountId);
          this.setAmountControl();
          this.setExtDataControl();
          this.getCurrentBalance();
          this.remainingBalance();
          this.blockQty();
        }, 50);
      },
    });
  }

  blockQty() {
    if (
      this.selectedOffer?.offerType == OfferType.Voucher ||
      this.selectedOffer?.offerType == OfferType.Coupon
    ) {
      this.frm.get("qty")?.disable();
      this.frm.get("qty")?.setValue(1);
    } else if (
      this.selectedOffer?.offerType == OfferType.Gift &&
      !this.modal?.isView
    ) {
      this.frm.get("qty")?.enable();
    }
  }

  setAmountControl() {
    // TODO: CHANGE TO USE ORIGINAL PRICE LATER.
    if (this.modal?.isView) return;
    let qty = this.frm.controls["qty"].value;
    // if (this.modal?.isView) {
    //   let amount =this.currency.roundedDecimal( this.extData.endingBalance - this.extData.startBalance);
    //   this.frm.get("amount")?.setValue(amount * -1);
    // } else {
    let amount = this.currency.roundedDecimal(
      this.selectedOffer?.redeemCost! * qty
    );
    this.frm.get("amount")?.setValue(amount);
    // }
  }

  setExtDataControl() {
    if (this.modal?.isView) return;
    this.extData = {
      cardNumber: "",
      redeemCost: this.selectedOffer?.redeemCost!,
      startBalance: this.selectedAccount?.balance!,
      endingBalance: this.currency.roundedDecimal(
        this.selectedAccount?.balance! - this.frm.get("amount")?.value
      ),
    };
    this.frm.get("extData")?.setValue(
      JSON.stringify({
        cardNumber: "",
        redeemCost: this.selectedOffer?.redeemCost,
        startBalance: this.selectedAccount?.balance,
        endingBalance: this.currency.roundedDecimal(
          this.selectedAccount?.balance! - this.frm.get("amount")?.value
        ),
      })
    );
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
      if (a.accountType === AccountTypes.Wallet) return -1;
      if (b.accountType === AccountTypes.Wallet) return 1;
      return 0;
    });
  }

  getCurrentBalance() {
    if (this.modal?.isView && this.model?.extData) {
      try {
        const parsed: { startBalance: number } = JSON.parse(
          this.model?.extData
        );
        this.extData.startBalance = parsed.startBalance;
      } catch (error) {
        console.error("Failed to parse extData:", error);
      }
    } else {
      this.extData.startBalance = this.selectedAccount?.balance!;
    }
  }

  remainingBalance() {
    if (this.modal?.isView && this.model?.extData) {
      try {
        const parsed: { endingBalance: number } = JSON.parse(
          this.model?.extData
        );
        this.extData.endingBalance = parsed?.endingBalance;
      } catch (error) {
        console.error("Failed to parse extData:", error);
      }
    } else {
      // add
      if (
        this.selectedAccount?.balance != null &&
        this.selectedAccount?.balance != undefined
      ) {
        this.extData.endingBalance =
          this.selectedAccount?.balance! - this.frm.get("amount")?.value;
      } else {
        this.extData.endingBalance! = 0;
      }
    }
  }

  override setFormValue() {
    this.frm.patchValue({
      redeemNo: this.model?.redeemNo,
      refNo: this.model?.refNo,
      offerId: this.model?.offerId,
      qty: this.model?.qty,
      amount: this.model?.amount,
      note: this.model?.note,
      status: this.model?.status,
      locationId: this.model?.locationId,
      memberId: this.model?.memberId,
      accountId: this.model?.accountId,
      redeemedDate: this.model?.redeemedDate,
      extData: this.model?.extData,
    });

    if (this.model.offerId && this.modal?.isView) {
      this.offerService.find(this.model.offerId).subscribe({
        next: (d: any) => {
          this.selectedOffer = d;
          this.frm.get("offerId")?.setValue(this.model?.offerId);
        },
        error: (err: any) => {
          console.error("Failed to fetch offer detail:", err);
        },
      });
    }
    if (this.model.extData) {
      const parsed: { redeemCost: number } = JSON.parse(this.model?.extData);
      if (!parsed.redeemCost) {
        this.extData.redeemCost =
          this.frm.get("amount")?.value / this.frm.get("qty")?.value;
      } else {
        this.extData = JSON.parse(this.model.extData);
      }
    }

    if (this.model.memberId && this.modal?.isView) {
      this.memberService.find(this.model.memberId).subscribe({
        next: (d: any) => {
          this.selectedMember = d;
        },
        error: (err: any) => {
          console.error("Failed to fetch member detail:", err);
        },
      });
    }

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
    this.refreshSub$?.unsubscribe();
  }
  readonly RedeemStatuses = RedeemStatuses;
  readonly AccountTypes = AccountTypes;
  readonly OfferType = OfferType;
}
