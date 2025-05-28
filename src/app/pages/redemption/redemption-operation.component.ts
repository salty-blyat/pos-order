import { Component, computed, ViewEncapsulation } from "@angular/core";
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
import { Offer, OfferService } from "../offer/offer.service";
import { SettingService } from "../../app-setting";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { Observable } from "rxjs";
import { getAccountBalance } from "../../utils/components/get-account-balance";
import { Report, ReportService } from "../report/report.service";

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
            <h3 style="line-height: 0.1">
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
                    <input nz-input formControlName="redeemNo" />
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
            <h3 style="line-height: 0.1">
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
                    <app-member-select formControlName="memberId" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
            <!-- member card -->
            <div class="account-card" style="margin-bottom: 12px">
              <div nz-flex nzGap="small">
                <nz-avatar
                  [nzText]="selectedMember?.name?.substring(0, 2)"
                  nzSize="large"
                  [nzSrc]="selectedMember?.photo"
                  style="background-color: #ccc"
                ></nz-avatar>

                <div>
                  <strong>{{ selectedMember?.name || "-" }} </strong><br />
                  <span>
                    <i nz-icon nzType="phone" nzTheme="outline"></i>
                    {{ selectedMember?.phone || "-" }}
                  </span>
                  <br />
                  <span
                    ><i nz-icon nzType="calendar" nzTheme="outline"></i>
                    {{
                      selectedMember?.joinDate
                        ? (selectedMember?.joinDate | customDate)
                        : "-"
                    }}
                  </span>
                  <br />
                </div>

                <div
                  style="margin-left:auto"
                  nz-flex
                  nzVertical
                  *ngIf="sortedAccounts.length > 0"
                >
                  <strong style="text-align:right">{{
                    selectedMember?.memberClassName || "-"
                  }}</strong>
                  <div style="margin-top:auto" nz-flex nzGap="small">
                    <div nz-flex nzVertical *ngFor="let a of sortedAccounts">
                      <div class="card-value">
                        <i
                          nz-icon
                          [nzType]="
                            a.accountType == AccountTypes.Wallet
                              ? 'wallet'
                              : 'star'
                          "
                          nzTheme="outline"
                        ></i>
                        {{ getAccountBalance(a.accountType, a.balance) }}
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
                  <button nz-button [disabled]="modal?.isView">
                    <i nz-icon nzType="upload"></i> Upload
                  </button>
                </nz-upload>
              </nz-form-control>
            </nz-form-item>
          </div>
          <!-- Column 2: Summary -->
          <div
            style="padding: 0 12px 12px 12px"
            nz-row
            nz-col
            [nzSm]="24"
            [nzLg]="10"
          >
            <h3 style="line-height: 0.1">
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
                      getAccountBalance(
                        selectedOffer.redeemWith!,
                        selectedOffer.redeemCost
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

            <div
              class="account-card"
              nzFlex
              nzVertical="true"
              style="margin-top: 16px"
            >
              <h3 style="text-weight: 600">
                <nz-icon nzType="credit-card" nzTheme="outline" />
                {{ "TransactionSummary" | translate }}
              </h3>
              <div nz-flex nzJustify="space-between">
                <span>{{ "CurrentBalance" | translate }}</span>
                <span>{{
                  getAccountBalance(selectedOffer?.redeemWith!, currentB)
                }}</span>
              </div>

              <div nz-flex nzJustify="space-between" *ngIf="selectedOffer">
                <span
                  >{{ "RedeemCost" | translate }} (x{{
                    frm.get("qty")?.value
                  }})</span
                >
                <span style="color: red"
                  >{{
                    getAccountBalance(
                      selectedOffer?.redeemWith!,
                      frm.get("amount")?.value
                    )
                  }}
                </span>
              </div>

              <nz-divider style="margin: 8px 0"></nz-divider>
              <div nz-flex nzJustify="space-between">
                <span>{{ "RemainingBalance" | translate }}</span>
                <span
                  [ngStyle]="{
                    'font-weight': 'bold'
                  }"
                >
                  {{
                    getAccountBalance(selectedOffer?.redeemWith!, remainingB)
                  }}
                </span>
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
          *ngIf="isRedemptionPrint()"
          nz-dropdown (click)="uiService.showPrint(model, RedeemPrint)" 
        >
          <span nz-icon nzType="printer" nzTheme="outline"></span>
          {{ "Print" | translate }} 
        </a> 
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRedemptionPrint()"
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
.offer-card{
  height: 100px;
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
  min-width:165px;
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
    private reportService: ReportService,
    public offerService: OfferService,
    private authService: AuthService,
    private settingService: SettingService,
    private systemSettingService: SystemSettingService,
    override uiService: RedemptionUiService
  ) {
    super(fb, ref, service, uiService);
  }

  selectedMember: Member | null = null;
  selectedOffer: Offer | null = null;
  extData: string | null = null;
  currentB: number | null = null;
  remainingB: number | null = null;
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

  onMemberChange() {
    const memberId = this.frm.get("memberId")?.value;
    if (memberId != null) {
      this.memberService.find(memberId).subscribe({
        next: (m: any) => {
          this.selectedMember = m;
          if (!this.modal?.isView) this.selectedOffer = null; // prevent reset selected offer because this block run on init
        },
        error: (err) => {
          console.error("Failed to fetch member detail:", err);
        },
      });
    }
  }

  fileList: NzUploadFile[] = [];
  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  isRedemptionPrint = computed(() => true);
  isRedemptionRemove = computed(() => true);
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
            this.frm.get("offerId")?.setValue(this.model.offerId);
          }
          this.onMemberChange();
        }, 50);
      },
    });

    this.frm.controls["qty"]?.valueChanges.subscribe({
      next: () => {
        setTimeout(() => {
          this.setAmountControl();
          this.setExtDataControl();
        }, 50);
      },
    });

    this.frm.controls["offerId"]?.valueChanges.subscribe({
      next: (v) => {
        setTimeout(() => {
          this.selectedAccount =
            this.selectedMember?.accounts?.find(
              (a) => a.accountType == this.selectedOffer?.redeemWith
            ) ?? null;

          this.frm.get("accountId")?.setValue(this.selectedAccount?.accountId);
          this.setAmountControl();
          this.setExtDataControl();

          this.getCurrectBalance();
          this.remainingBalance();
        }, 50);
      },
    });
  }

  setAmountControl() {
    let qty = this.frm.controls["qty"].value;
    let amount = this.selectedOffer?.redeemCost! * qty;
    this.frm.get("amount")?.setValue(amount);
  }

  setExtDataControl() {
    this.extData = JSON.stringify({
      cardNumber: "",
      startBalance: this.selectedAccount?.balance,
      endingBalance:
        this.selectedAccount?.balance! - this.frm.get("amount")?.value,
    });
    this.frm.get("extData")?.setValue(this.extData);
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

  // itemPrice(): number {
  //   const balance = Number(this.selectedOffer?.redeemCost);
  //   const amount = Number(this.frm.get("amount")?.value);
  //   return balance - amount;
  // }

  getCurrectBalance() {
    if (this.modal?.isView && this.model?.extData) {
      try {
        const parsed: { startBalance: number } = JSON.parse(
          this.model?.extData
        );
        this.currentB = parsed.startBalance;
      } catch (error) {
        console.error("Failed to parse extData:", error);
      }
    } else {
      this.currentB = this.selectedAccount?.balance!;
    }
  }
  remainingBalance() {
    if (this.modal?.isView && this.model?.extData) {
      try {
        const parsed: { endingBalance: number } = JSON.parse(
          this.model?.extData
        );
        this.remainingB = parsed?.endingBalance;
      } catch (error) {
        console.error("Failed to parse extData:", error);
      }
    } else {
      if (
        this.selectedAccount?.balance != null &&
        this.selectedAccount?.balance != undefined
      ) {
        this.remainingB =
          this.selectedAccount?.balance! - this.frm.get("amount")?.value;
      } else {
        this.remainingB = 0;
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
    if (this.model.extData) {
      this.extData = this.model.extData;
    }

    if (this.model.offerId && this.modal?.isView) {
      this.offerService.find(this.model.offerId).subscribe({
        next: (d: any) => {
          this.selectedOffer = d;
        },
        error: (err: any) => {
          console.error("Failed to fetch offer detail:", err);
        },
      });
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

  readonly getAccountBalance = getAccountBalance;
  readonly AccountTypes = AccountTypes;
}
