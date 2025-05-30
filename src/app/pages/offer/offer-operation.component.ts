import { Component, computed, effect, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import { OfferUiService } from "./offer-ui.service";
import { Offer, OfferService } from "./offer.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { SettingService } from "../../app-setting";
import { Observable, Subscriber, Subscription } from "rxjs";
import {
  SETTING_KEY,
  SystemSettingService,
} from "../system-setting/system-setting.service";

@Component({
  selector: "app-offer-operation",
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
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <div nz-row nzJustify="center" nzGutter="12">
          <div nz-col nzSpan="14">
            <nz-form-item>
              <nz-form-label [nzSm]="5" nzRequired
                >{{ "Code" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="19" nzErrorTip nzHasFeedback>
                <input
                  nz-input
                  formControlName="code"
                  [placeholder]="
                    frm.controls['code'].disabled ? ('NewCode' | translate) : ''
                  "
                />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="5" nzRequired
                >{{ "Name" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="19" nzErrorTip nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="5" nzRequired>
                {{ "OfferGroup" | translate }}</nz-form-label
              >
              <nz-form-control [nzSm]="19">
                <app-offer-group-select
                  formControlName="offerGroupId"
                ></app-offer-group-select>
              </nz-form-control>
            </nz-form-item>
          </div>

          <div nz-col nzSpan="4">
            <div nz-flex nzJustify="center" nzAlign="center">
              <nz-form-item>
                <nz-form-control>
                  <div
                    class="image-upload"
                    (click)="uiService.showUpload()"
                    role="button"
                    aria-label="Upload image"
                    *ngIf="!modal?.isView && file.length == 0"
                  >
                    <i nz-icon nzType="plus"></i>
                    <p>{{ "Upload" | translate }}</p>
                  </div>

                  @if(modal?.isView){
                  <nz-upload
                    profile
                    [nzAction]="uploadUrl"
                    nzListType="picture-card"
                    [(nzFileList)]="file"
                    (nzChange)="handleUpload($event)"
                    [nzShowButton]="file.length < 1"
                    [nzShowUploadList]="nzShowUploadList"
                    [nzDisabled]="true"
                  >
                    <div>
                      <span nz-icon nzType="plus"></span>
                      <div class="upload-text">{{ "Upload" | translate }}</div>
                    </div>
                  </nz-upload>
                  } @else {
                  <nz-upload
                    profile
                    *ngIf="file.length != 0"
                    [nzAction]="uploadUrl"
                    nzListType="picture-card"
                    [(nzFileList)]="file"
                    (nzChange)="handleUpload($event)"
                    [nzShowUploadList]="nzShowIconList"
                    [nzShowButton]="file.length < 1"
                  >
                    <div>
                      <span nz-icon nzType="plus"></span>
                      <div class="upload-text">{{ "Upload" | translate }}</div>
                    </div>
                  </nz-upload>
                  }
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
        </div>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>{{
            "MaxQty" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="5" nzErrorTip>
            <input nz-input formControlName="maxQty" />
          </nz-form-control>

          <nz-form-label [nzSm]="5" nzRequired>{{
            "OfferType" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="5">
            <app-lookup-item-select
              formControlName="offerType"
              [lookupType]="LOOKUP_TYPE.OfferType"
            >
            </app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" nzRequired
            >{{ "StartAt" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="5">
            <nz-date-picker formControlName="offerStartAt"></nz-date-picker>
          </nz-form-control>

          <nz-form-label [nzSpan]="5" nzRequired>
            {{ "EndAt" | translate }}</nz-form-label
          >
          <nz-form-control [nzSm]="5" nzErrorTip>
            <nz-date-picker formControlName="offerEndAt"></nz-date-picker>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" nzRequired>{{
            "RedeemCost" | translate
          }}</nz-form-label
          ><nz-form-control [nzSm]="5" nzErrorTip>
            <nz-input-group nz-input [nzAddOnAfter]="nzAddOnAfter">
              <ng-template #nzAddOnAfter>
                <app-lookup-item-select
                  class="redeem-cost"
                  formControlName="redeemWith"
                  [lookupType]="LOOKUP_TYPE.AccountType"
                ></app-lookup-item-select>
              </ng-template>
              <input nz-input formControlName="redeemCost" />
            </nz-input-group>
          </nz-form-control>

          <nz-form-label [nzSm]="5" nzRequired>{{
            "RedeemMinBalance" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="5" nzErrorTip>
            <input nz-input formControlName="redeemMinBalance" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">{{ "Note" | translate }}</nz-form-label>
          <nz-form-control [nzSpan]="15">
            <textarea
              nz-input
              rows="3"
              formControlName="note"
              style="width: 100%;"
            ></textarea>
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
          *ngIf="!isLoading() && isOfferEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isOfferEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isOfferRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isOfferRemove()"
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
// html.cdk-global-scrollblock body div.cdk-overlay-container div.cdk-global-overlay-wrapper div#cdk-overlay-0.cdk-overlay-pane nz-modal-container.ng-tns-c3531571346-5.ng-trigger.ng-trigger-modalContainer.ng-star-inserted.ant-modal-wrap div.cdk-drag.ant-modal.ng-tns-c3531571346-5.cdk-drag-disabled div.ant-modal-content.ng-tns-c3531571346-5 div.ant-modal-body.ng-tns-c3531571346-5 app-offer-operation.ng-star-inserted div.modal-content form.ant-form.ng-untouched.ng-pristine.ant-form-horizontal nz-form-item.ant-form-item.ant-row nz-form-control.ant-form-item-control.ng-tns-c742983017-16.ng-star-inserted.ant-col.ant-col-sm-5 div.ant-form-item-control-input.ng-tns-c742983017-16 div.ant-form-item-control-input-content.ng-tns-c742983017-16 nz-input-group.ng-tns-c742983017-16.ant-input-group-wrapper span.ant-input-wrapper.ant-input-group.ng-star-inserted span.ant-input-group-addon.ng-star-inserted app-lookup-item-select.redeem-cost.ng-untouched.ng-pristine.ng-star-inserted nz-select.ant-select.ng-tns-c2061626568-22.ant-select-in-form-item.ant-select-show-arrow.ant-select-disabled.ant-select-single.ng-untouched.ng-pristine.ng-valid.ng-star-inserted nz-select-top-control.ant-select-selector.ng-tns-c2061626568-22 {  
//   padding: 0 !important; 
// }
.redeem-cost .ant-select .ant-select-selector {
  padding: 0 !important;
}
 
  .ant-input-group-addon {
    width: 90px;
    padding: 0px;
  }
   .image-upload {
        border: 2px dotted #ddd;
        border-radius: 6px;
        cursor: pointer;
        width: 110px;
        height: 110px;
        padding: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: border-color 0.3s ease; /* Smooth transition */
      }

      .image-upload:hover {
        border-color: rgb(131, 131, 131);
      }
      `,
  encapsulation: ViewEncapsulation.None,
})
export class OfferOperationComponent extends BaseOperationComponent<Offer> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<OfferOperationComponent>,
    service: OfferService,
    private authService: AuthService,
    private settingService: SettingService,
    private systemSettingService: SystemSettingService,
    override uiService: OfferUiService
  ) {
    super(fb, ref, service, uiService);
    // effect(() => {
    //   if(this.frm.get('start'))
    // })
  }

  readonly LOOKUP_TYPE = LOOKUP_TYPE;
  isOfferEdit = computed(() => true);
  isOfferRemove = computed(() => true);
  file: NzUploadFile[] = [];
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
  };
  uploadRefresh$ = new Subscription();
  nzShowIconList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };
  override ngOnInit(): void {
    if (this.isLoading()) return;
    this.initControl();
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === "edited") {
          this.isLoading.set(true);
          this.service.find(this.modal?.id).subscribe({
            next: (result: Offer) => {
              this.model = result;

              this.setFormValue();
              if (this.model.photo) {
                this.file = [
                  {
                    uid: "",
                    name: this.model.name!,
                    url: this.model.photo,
                  },
                ];
              } else {
                this.file = [];
              }
              this.isLoading.set(false);
            },
            error: (err: any) => {
              console.log(err);
            },
          });
        }
      });
    }
    if (this.modal?.id) {
      this.isLoading.set(true);
      this.service.find(this.modal?.id).subscribe((result: Offer) => {
        this.model = result;
        this.setFormValue();
        this.isLoading.set(false);
      });
    }
    if (!this.modal?.isView) {
      this.systemSettingService.find(SETTING_KEY.OfferAutoId).subscribe({
        next: (value?: string) => {
          if (Number(value) !== 0) {
            this.frm.get("code")?.disable();
          }
        },
      });
    }

    this.uploadRefresh$ = this.uiService.refresher.subscribe((e) => {
      if (e.key === "upload") {
        this.file = [];
        if (e?.value) {
          this.file.push(e.value);
        }
      }
    });
  }

  handleUpload(info: NzUploadChangeParam): void {
    let fileListOfferGroupItems = [...info.fileList];
    // 1. Limit 5 number of uploaded files
    fileListOfferGroupItems = fileListOfferGroupItems.slice(-5);
    // 2. Read from response and show file link
    fileListOfferGroupItems = fileListOfferGroupItems.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    this.file = fileListOfferGroupItems;
  }
  override onSubmit(e?: any): void {
    if (this.frm.valid) {
      this.isLoading.set(true);
      let photo = this.file[0]?.url;

      let operation$ = this.service.add({
        ...this.frm.getRawValue(),
        photo: photo,
      });
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
          photo: photo,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        operation$.subscribe({
          next: (result: Offer) => {
            this.model = result;
            this.isLoading.set(false);
            this.ref.triggerOk().then();
          },
          error: (err: any) => {
            this.isLoading.set(false);
            console.log(err);
          },
        });
      }
    }
  }

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      noteMaxLengthValidator,
      nameExistValidator,
      required,
      codeMaxLengthValidator,
      codeExistValidator,
      integerValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [nameMaxLengthValidator(), required],
        nameExistValidator(this.service, this.modal?.id),
      ],
      code: [
        { value: null, disabled: false },
        [codeMaxLengthValidator, required],
        codeExistValidator(this.service, this.modal?.id),
      ],
      offerGroupId: [null, [required]],
      offerType: [null, [required]],
      maxQty: [1, [required, integerValidator]],
      redeemWith: [null, [required]],
      redeemCost: [0, [required]],
      redeemMinBalance: [10, [required]],
      offerStartAt: [null, [required]],
      offerEndAt: [null, [required]],
      photo: [null],
      note: [null, [noteMaxLengthValidator()]],
    });
    setTimeout(() => {
      if (this.modal.offerTypeId !== 0 && this.modal.offerTypeId)
        this.frm.patchValue({ offerType: this.modal.offerTypeId });
      if (this.modal.offerGroupId !== 0 && this.modal.offerGroupId)
        this.frm.patchValue({ offerGroupId: this.modal.offerGroupId });
      if (this.modal.accountTypeId !== 0 && this.modal.accountTypeId)
        this.frm.patchValue({ redeemWith: this.modal.accountTypeId });
    }, 50);
  }

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      note: this.model.note,
      code: this.model.code,
      offerGroupId: this.model.offerGroupId,
      offerType: this.model.offerType,
      maxQty: this.model.maxQty,
      redeemWith: this.model.redeemWith,
      redeemCost: this.model.redeemCost,
      redeemMinBalance: this.model.redeemMinBalance,
      offerStartAt: this.model.offerStartAt,
      offerEndAt: this.model.offerEndAt,
      photo: this.model.photo,
    });
    if (this.model.photo) {
      this.file = [];
      this.file.push({
        uid: "",
        name: this.model.name!,
        url: this.model.photo,
      });
    }
  }
  override ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
    this.uploadRefresh$?.unsubscribe();
  }
}
