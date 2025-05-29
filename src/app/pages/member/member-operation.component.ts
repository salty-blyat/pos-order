import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { CommonValidators } from "../../utils/services/common-validators";
import { Member, MemberService } from "./member.service";
import { MemberUiService } from "./member-ui.service";
import { SettingService } from "../../app-setting";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { AccountTypes, LOOKUP_TYPE } from "../lookup/lookup-type.service";
import {
  SETTING_KEY,
  SystemSettingService,
} from "../system-setting/system-setting.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthService } from "../../helpers/auth.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable, Observer } from "rxjs";
import { AccountService } from "../account/account.service";
import { TranslateService } from "@ngx-translate/core";
import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { AccountUiService } from "../account/account-ui.service";
import { getAccountBalance } from "../../utils/components/get-account-balance";

@Component({
  selector: "app-member-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate
        }}{{
          model?.code && model?.name
            ? model?.code + " " + model?.name
            : ("Loading" | translate)
        }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.code && model?.name
          ? model?.code + " " + model?.name
          : ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <nz-layout>
        <nz-sider nzTheme="light" class="sider-member" nzWidth="220px">
          <div class="photo">
            @if(modal.isView){
            <!-- view -->
            @if(file.length == 0){
            <div class="image-no-profile" *ngIf="file.length == 0">
              <img src="./assets/image/man.png" alt="Photo" />
            </div>

            }@else {
            <nz-upload
              class="profile"
              [nzAction]="uploadUrl"
              [(nzFileList)]="file"
              [nzShowButton]="false"
              [nzDisabled]="true"
              (nzChange)="handleUpload($event)"
              [nzShowUploadList]="nzShowButtonView"
              nzListType="picture-card"
              [nzShowButton]="file.length < 1"
            >
              <div photo>
                <i nz-icon nzType="plus"></i>
                <img src="./assets/image/man.png" alt="Photo" />
              </div>
            </nz-upload>
            } } @else {
            <!-- add & edit -->
            @if(file.length == 0){
            <div
              class="image-upload"
              (click)="uiService.showUpload()"
              role="button"
              aria-label="Upload image"
            >
              <i nz-icon nzType="plus"></i>
              <img src="./assets/image/man.png" alt="Photo" />
            </div>
            } @else {
            <nz-upload
              [nzAction]="uploadUrl"
              nzListType="picture-card"
              [(nzFileList)]="file"
              (nzChange)="handleUpload($event)"
              [nzShowUploadList]="nzShowIconList"
              [nzShowButton]="file.length < 1"
            >
            </nz-upload
            >} }
          </div>
          <div class="member-name">
            <p *ngIf="memberName === ''">
              {{ memberNameEn || "NewMember" | translate }}
            </p>
            <p *ngIf="memberName !== ''">{{ memberName }}</p>
          </div>

          <ul class="menu-item" nz-menu nzTheme="light" nzMode="inline">
            <!-- info -->
            <li
              nz-menu-item
              [nzSelected]="current == 1"
              (click)="switchCurrent(1)"
            >
              <i nz-icon nzType="user"></i>
              <span>{{ "Information" | translate }}</span>
            </li>

            <!-- card -->
            @if(modal.isView){
            <li
              nz-menu-item
              [nzSelected]="current == 2"
              (click)="switchCurrent(2)"
            >
              <i nz-icon nzType="credit-card"></i>
              <span>{{ "Card" | translate }}</span>
            </li>
            }

            <!-- account -->
            @if(modal.isView) {
            <li
              style="height:auto; padding-bottom:12px"
              nz-menu-item
              [nzSelected]="current == 3"
              (click)="switchCurrent(3)"
            >
              <div>
                {{ "Account" | translate }}
              </div>

              <div
                *ngFor="let account of sortedAccounts"
                style="display: flex; align-items: center; margin-bottom: 12px; line-height: 1"
              >
                <i
                  nz-icon
                  [nzType]="
                    account.accountType == AccountTypes.Wallet
                      ? 'wallet'
                      : 'star'
                  "
                  nzTheme="outline"
                  style="margin-right: 8px;"
                ></i>
                <div>
                  {{ getAccountBalance(account.accountType, account.balance) }}
                </div>
              </div>
            </li>
            }
          </ul>
        </nz-sider>

        <nz-content [ngStyle]="{ padding: current == 3 ? '0' : '' }">
          <app-loading *ngIf="isLoading()"></app-loading>
          <div [ngSwitch]="current" [style.height.%]="100">
            <div *ngSwitchCase="1" ngCase>
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
                            >{{ "Code" | translate }}
                          </nz-form-label>
                          <nz-form-control
                            [nzSm]="14"
                            [nzXs]="24"
                            nzHasFeedback
                          >
                            <input
                              [autofocus]="true"
                              nz-input
                              formControlName="code"
                              [placeholder]="
                                frm.controls['code'].disabled
                                  ? ('NewCode' | translate)
                                  : ''
                              "
                            />
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                            >{{ "JoinDate" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24">
                            <nz-date-picker
                              [nzAllowClear]="false"
                              formControlName="joinDate"
                            ></nz-date-picker>
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                    </div>

                    <div nz-row>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                            >{{ "Name" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24">
                            <input nz-input formControlName="name" />
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24"
                            >{{ "LatinName" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24">
                            <input nz-input formControlName="latinName" />
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                    </div>

                    <div nz-row>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                            >{{ "Phone" | translate }}
                          </nz-form-label>
                          <nz-form-control
                            [nzSm]="14"
                            [nzXs]="24"
                            nzErrorTip=""
                          >
                            <input nz-input formControlName="phone" />
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24"
                            >{{ "Email" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip>
                            <input nz-input formControlName="email" />
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                    </div>

                    <div nz-row>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired=""
                            >{{ "MemberClass" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24">
                            <app-member-class-select
                              formControlName="memberClassId"
                            ></app-member-class-select>
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired=""
                            >{{ "Agent" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24">
                            <app-agent-select
                              formControlName="agentId"
                            ></app-agent-select>
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                    </div>

                    <div nz-row>
                      <div nz-col [nzXs]="12">
                        <nz-form-item>
                          <nz-form-label [nzSm]="8" [nzXs]="24"
                            >{{ "DateOfBirth" | translate }}
                          </nz-form-label>
                          <nz-form-control
                            [nzSm]="14"
                            [nzXs]="24"
                            nzErrorTip=""
                          >
                            <nz-date-picker
                              [nzAllowClear]="false"
                              formControlName="birthDate"
                            ></nz-date-picker>
                          </nz-form-control>
                        </nz-form-item>
                      </div>
                    </div>

                    <div nz-row>
                      <div nz-col [nzSpan]="24">
                        <nz-form-item>
                          <nz-form-label [nzSpan]="4"
                            >{{ "Address" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzXs]="19">
                            <textarea
                              nz-input
                              type="text"
                              formControlName="address"
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

            <div style="margin: 0 8px;" *ngSwitchCase="2" ngCase>
              <app-card-list
                [accountId]="model.defaultAccountId!"
                [memberId]="modal.id"
              />
            </div>

            <div *ngSwitchCase="3" class="tab-content">
              <nz-tabset style="margin: 0 8px;" [(nzSelectedIndex)]="tabIndex">
                <nz-tab
                  *ngFor="let account of sortedAccounts"
                  [nzTitle]="
                    translateService.currentLang == 'km'
                      ? account.accountTypeNameKh ?? ''
                      : account.accountTypeNameEn ?? ''
                  "
                >
                  <app-account-list
                    [accounts]="model.accounts || []"
                    [tabIndex]="tabIndex"
                  ></app-account-list>
                </nz-tab>
                <nz-tab [nzTitle]="'Redemption' | translate">
                  <app-redemption-list
                    [memberId]="modal.id"
                    [isFromMember]="true"
                  />
                </nz-tab>
              </nz-tabset>
            </div>

            <div *ngSwitchCase="3" ngCase></div>
          </div>
        </nz-content>
      </nz-layout>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!modal?.isView">
        <button
          nz-button
          nzType="primary"
          [disabled]="!frm.valid || isLoading()"
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
          *ngIf="!isLoading() && isMemberEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isMemberEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isMemberRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isMemberRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [
    `
      .ant-tabs-tab + .ant-tabs-tab {
        margin: 0 0 0 18px !important;
      }
      nz-tabs-nav {
        margin: 0 !important;
      }
      .image-no-profile {
        border: 2px dotted #ddd;
        border-radius: 6px;
        width: 110px;
        height: 110px;
        padding: 4px;
      }
      .image-upload {
        border: 2px dotted #ddd;
        color: #ddd; //for plus icon clor
        border-radius: 6px;
        cursor: pointer;
        width: 110px;
        height: 110px;
        padding: 4px;
        text-align: center;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        justify-content: center;
        display: inline-block;
        align-items: center;
        position: relative;
        transition: border-color 0.3s ease; /* Smooth transition */
      }

      .image-upload::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(128, 128, 128, 0.2); /* semi-transparent gray */
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1;
      }

      .image-upload:hover::before {
        opacity: 1;
      }

      .image-upload img {
        position: relative;
        z-index: 2;
      }
      .image-upload i {
        color: white;
        top: 50%;
        position: absolute;
        left: 50%;
        z-index: 3;
        transform: translate(-50%, -50%);
      }
      .image-upload:hover {
        border-color: rgb(131, 131, 131);
      }
      .ant-upload-list-picture-card-container {
        margin: 0 !important;
      }

      .photo {
        width: 108px;
        height: auto;
        padding: 1px;
        min-height: 2cm;
        margin: 16px auto 0;
        border-radius: 4px;

        img {
          width: 100%;
        }
      }

      .member-name {
        text-align: center;

        p {
          margin-top: 5px;
          font-weight: bold;
        }
      }

      .menu-item {
        background: #fff;
      }

      .sider-member {
        height: calc(100vh - 160px);
        border-right: 1px solid #d9d9d9;
      }

      [profile] {
        .ant-upload-list-picture-card .ant-upload-list-item-actions {
          display: none;
        }

        .ant-upload-list-picture-card .ant-upload-list-item-info::before {
          display: none;
        }
      }

      .profile {
        .ant-upload.ant-upload-select-picture-card {
          margin: 0;
          padding: 2px;
        }
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class MemberOperationComponent extends BaseOperationComponent<Member> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<MemberOperationComponent>,
    service: MemberService,
    private msg: NzMessageService,
    override uiService: MemberUiService,
    public accountUiService: AccountUiService,
    public accountService: AccountService,
    private settingService: SettingService,
    private systemSettingService: SystemSettingService,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
    public translateService: TranslateService
  ) {
    super(fb, ref, service, uiService);
  }
  memberName = "";
  memberNameEn = "";
  current: number = 1;
  isMemberEdit = computed(() => true);
  isMemberRemove = computed(() => true);
  selectedAccount = signal<number>(0);

  file: NzUploadFile[] = [];
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  //  view
  nzShowButtonView = {
    showPreviewIcon: true,
    showDownloadIcon: false,
    showRemoveIcon: false,
  };
  // add | edit
  nzShowIconList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };
  tabIndex = 0;
  override ngOnInit(): void {
    if (this.isLoading()) return;
    this.initControl();
    if (!this.modal?.isView) {
      this.systemSettingService.find(SETTING_KEY.MemberAutoId).subscribe({
        next: (value?: string) => {
          if (Number(value) !== 0) {
            this.frm.get("code")?.disable();
          }
        },
      });
    }

    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === "edited") {
          this.isLoading.set(true);
          this.service.find(this.modal?.id).subscribe({
            next: (result: Member) => {
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
      this.service.find(this.modal?.id).subscribe((result: Member) => {
        this.model = result;
        this.setFormValue();
        this.isLoading.set(false);
      });
    }
    this.uiService.refresher.subscribe((e) => {
      if (e.key === "upload") {
        this.file = [];
        if (e?.value) {
          this.file.push(e.value);
        }
      }
    });
    this.frm.get("name")?.valueChanges.subscribe({
      next: (event: any) => {
        this.memberName = event;
      },
    });
    this.frm.get("latinName")?.valueChanges.subscribe({
      next: (event: any) => {
        this.memberNameEn = event;
      },
    });
    this.accountUiService.refresher.subscribe(() => {
      // refresh the total balance after adjust/topup from account-operation
      this.service.find(this.modal?.id).subscribe({
        next: (result: Member) => {
          this.model = result;
          this.setFormValue();
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    });
  }

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      required,
      codeExistValidator,
      multiplePhoneValidator,
      codeMaxLengthValidator,
      emailValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      code: [
        { value: null, disabled: false },
        [required, codeMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [null, [required, nameMaxLengthValidator]],
      latinName: [null, [nameMaxLengthValidator]],
      birthDate: [null],
      address: [null],
      phone: [null, [required, multiplePhoneValidator]],
      email: [null, [emailValidator]],
      agentId: [null, [required]],
      memberClassId: [null, [required]],
      joinDate: [new Date(), [required]],
      photo: [null],
      defaultAccountId: [null],
    });
    setTimeout(() => {
      if (this.modal.memberClassId !== 0 && this.modal.memberClassId)
        this.frm.patchValue({ memberClassId: this.modal.memberClassId });
      if (this.modal.agentId !== 0 && this.modal.agentId)
        this.frm.patchValue({ agentId: this.modal.agentId });
    }, 50);
  }

  override setFormValue() {
    this.frm.patchValue({
      id: this.model.id,
      code: this.model.code,
      name: this.model.name,
      latinName: this.model.latinName,
      email: this.model.email,
      phone: this.model.phone,
      address: this.model.address,
      birthDate: this.model.birthDate,
      agentId: this.model.agentId,
      memberClassId: this.model.memberClassId,
      photo: this.model.photo,
      joinDate: this.model.joinDate,
      defaultAccountId: this.model.defaultAccountId,
    });

    if (this.model.photo && this.model.photo !== "") {
      this.file = [];
      this.file.push({
        uid: "",
        name: this.model.name!,
        url: this.model.photo,
      });
    }
  }
  override onSubmit(e: any): void {
    if (this.frm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      if (this.file.length > 0) {
        this.frm.patchValue({
          photo: this.file[0].url,
        });
      }
      let operation$: Observable<Member> = this.service.add(
        this.frm.getRawValue()
      );
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        operation$.subscribe({
          next: (result: Member) => {
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

  switchCurrent(index: number) {
    switch (index) {
      case 1:
        this.current = 1;
        break;
      case 2:
        this.current = 2;
        break;
      case 3:
        this.current = 3;
        break;
    }
  }

  handleUpload(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    // 1. Limit 5 number of uploaded files
    fileList = fileList.slice(-5);
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
    this.file = fileList;
  }

  get sortedAccounts() {
    return (this.model?.accounts ?? []).slice().sort((a, b) => {
      if (a.accountId === AccountTypes.Wallet) return -1;
      if (b.accountId === AccountTypes.Wallet) return 1;
      return 0;
    });
  }

  override ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }

  protected readonly AccountTypes = AccountTypes;
  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
  readonly getAccountBalance = getAccountBalance;
}
