import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { CommonValidators } from "../../utils/services/common-validators";
import { Member, MemberService } from "./member.service";
import { MemberUiService } from "./member-ui.service";
import { SettingService } from "../../app-setting";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { SystemSettingService } from "../system-setting/system-setting.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthService } from "../../helpers/auth.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Observable, Observer } from "rxjs";
import { AccountService } from "../account/account.service";
import { TranslateService } from "@ngx-translate/core";
import { Component, computed, signal, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-member-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate
        }}{{
          model?.code + " " + model?.name! || ("Loading" | translate)
        }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.code + " " + model?.name! || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <nz-layout>
        <nz-sider nzTheme="light" class="sider-member" nzWidth="220px">
          <div class="photo">
            <nz-upload
              class="profile"
              [nzAction]="uploadUrl"
              [(nzFileList)]="file"
              [nzBeforeUpload]="beforeUpload"
              (nzChange)="handleUpload($event)"
              nzListType="picture-card"
              [nzShowButton]="file.length < 1"
            >
              <div photo>
                <i nz-icon nzType="plus"></i>
                <img src="./assets/image/man.png" alt="Photo" />
              </div>
            </nz-upload>
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
            @if(!modal.isAdd ) {
            <li 
              
              style="height:auto; padding-bottom:12px"
              nz-menu-item
              [nzSelected]="current == 3"
              (click)="switchCurrent(3)"
            >
              <div>
                {{ "Account" | translate }}
              </div>

              <div *ngFor="let account of sortedAccounts"
                style="display: flex; align-items: center; margin-bottom: 12px; line-height: 1"
              >
                <i
                  nz-icon
                  [nzType]="
                    account.accountTypeNameEn === 'Wallet' ? 'wallet' : 'star'
                  "
                  nzTheme="outline"
                  style="margin-right: 8px;"
                ></i>
                <div>
                  {{
                    account.accountTypeNameEn === "Wallet"
                      ? "$ " +
                        (account.balance != null
                          ? account.balance.toFixed(2)
                          : "0.00")
                      : account.balance != null
                      ? account.balance + " pts"
                      : "0 pts"
                  }}
                </div>
              </div>
            </li>
            }
          </ul>
        </nz-sider>

        <nz-content>
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
                          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired=""
                            >{{ "DateOfBirth" | translate }}
                          </nz-form-label>
                          <nz-form-control
                            [nzSm]="14"
                            [nzXs]="24"
                            nzErrorTip=""
                          >
                            <nz-date-picker
                              formControlName="birthDate"
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
                          <nz-form-control
                            [nzSm]="14"
                            [nzXs]="24"
                            nzHasFeedback
                          >
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
              <app-card-list [memberId]="modal.id" />
            </div>

            <div *ngSwitchCase="3" class="tab-content">
              <nz-tabset
                style="margin: 0 8px;"
                (nzSelectedIndexChange)="selectedAccountIndex.set($event)"
              >
                <nz-tab
                  *ngFor="let account of sortedAccounts"
                  [nzTitle]="
                    translateService.currentLang == 'km'
                      ? account.accountTypeNameKh ?? ''
                      : account.accountTypeNameEn ?? ''
                  "
                >
                  <app-transaction-list
                    [accounts]="model.accounts || []"
                    [tabIndex]="this.selectedAccountIndex()"
                  ></app-transaction-list>
                </nz-tab>
                <nz-tab [nzTitle]="'Redemption' | translate">
                  <app-redemption-history [memberId]="modal.id" />
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
      .ant-tabs-tab {
        margin: 0 0 0 12px !important;
      }
      nz-layout {
        height: calc(100vh - 180px);
        nz-content {
          overflow-y: scroll;
        }
        nz-sider {
          border-right: 1px solid #d9d9d9;
        }
      }
      .image-upload {
        cursor: pointer;
        width: 108px;
        height: auto;
        padding: 1px;
        min-height: 2cm;
        margin: 16px auto 0;
        border: 2px dotted #d9d9d9;
        border-radius: 6px;
        transition: border-color 0.3s ease;

        img {
          width: 100%;
        }
        &:hover {
          border-color: #4976c4;
        }
      }
      .image-upload {
        cursor: pointer;
        width: 108px;
        height: auto;
        padding: 1px;
        min-height: 2cm;
        margin: 16px auto 0;
        border: 2px dotted #d9d9d9;
        border-radius: 6px;
        transition: border-color 0.3s ease;

        img {
          width: 100%;
        }
        &:hover {
          border-color: #4976c4;
        }
      }

      .tab-content {
        loverflow-y: scroll;
        padding: 8px;
        padding: 8px;
      }
      .ant-modal-body {
        height: auto !important;
      }

      .ant-upload {
        margin-bottom: 0 !important;
      }
      .ant-upload-list-picture-card-container {
        margin: 0 !important;
      }

      .ant-upload-list-item {
        padding: 0px !important;
      }
      .photo {
        cursor: pointer;
        width: 108px;
        height: auto;
        padding: 1px;
        min-height: 2cm;
        margin: 16px auto 0;
        border: 1px solid #d0cfcf;
        border-radius: 6px;
        transition: border-color 0.3s ease;
        border-radius: 6px;
        transition: border-color 0.3s ease;

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
        display: flex;
        flex-direction: column;
        background: #fff;
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
    public accountService: AccountService,
    private settingService: SettingService,
    private systemSettingService: SystemSettingService,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
    public translateService: TranslateService
  ) {
    super(fb, ref, service, uiService);
  }
  fileLists: NzUploadFile[] = [];
  memberName = "";
  memberNameEn = "";
  current: number = 1;
  isMemberEdit = computed(() => true);
  isMemberRemove = computed(() => true);
  selectedAccount = signal<number>(0);

  file: NzUploadFile[] = [];
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
  };
  nzShowIconList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };
  selectedAccountIndex = signal<number>(0);

  override ngOnInit(): void {
    super.ngOnInit();

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
  }

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      required,
      codeExistValidator,
      multiplePhoneValidator,
      codeMaxLengthValidator,
      emailValidator,
      nameExistValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      code: [
        { value: null, disabled: false },
        [required, codeMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      latinName: [null, [nameMaxLengthValidator]],
      birthDate: [null, [required]],
      address: [null],
      phone: [null, [required, multiplePhoneValidator]],
      email: [null, [emailValidator]],
      agentId: [null, [required]],
      memberClassId: [null, [required]],
      photo: [null],
    });
    setTimeout(() => {
      if (this.modal.memberClassId !== 0 && this.modal.memberClassId)
        this.frm.patchValue({ memberClassId: this.modal.memberClassId });
      if (this.modal.agentId !== 0 && this.modal.agentId)
        this.frm.patchValue({ agentId: this.modal.agentId });
    }, 50);
  }

  override setFormValue(model?: Member) {
    this.frm.patchValue({
      id: this.model?.id,
      code: this.model?.code,
      name: this.model?.name,
      latinName: this.model?.latinName,
      email: this.model?.email,
      phone: this.model?.phone,
      address: this.model?.address,
      birthDate: this.model?.birthDate,
      agentId: this.model?.agentId,
      memberClassId: this.model?.memberClassId,
      photo: this.model?.photo,
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

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.msg.error("You can only upload JPG file!");
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.msg.error("Image must smaller than 2MB!");
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

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
      if (a.accountTypeNameEn === "Wallet") return -1;
      if (b.accountTypeNameEn === "Wallet") return 1;
      return 0;
    });
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
