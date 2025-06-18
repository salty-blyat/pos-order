import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { CommonValidators } from "../../utils/services/common-validators";
import { AccountTabs, Member, MemberService } from "./member.service";
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
import { Observable, Subscription } from "rxjs";
import { AccountService } from "../account/account.service";
import { TranslateService } from "@ngx-translate/core";
import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { AccountUiService } from "../account/account-ui.service";
import { RedemptionUiService } from "../redemption/redemption-ui.service";
import { NzImageService } from "ng-zorro-antd/image";
import { AuthKeys } from "../../const";

@Component({
  selector: "app-member-view",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.code && model?.name
          ? model?.code + " " + model?.name
          : ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <nz-layout>
        <nz-sider nzTheme="light" class="sider-mem" nzWidth="250px">
          <div class="photo">
            <!-- view -->
            @if(file.length == 0){
            <div class="image-no-profile" *ngIf="file.length == 0">
              <img src="./assets/image/man.png" alt="Photo" />
            </div>

            }@else {
            <nz-upload
              class="profile"
              [(nzFileList)]="file"
              (click)="onPreviewImage()"
              [nzShowButton]="false"
              [nzDisabled]="true"
              [nzShowUploadList]="nzShowButtonView"
              nzListType="picture-card"
              [nzShowButton]="false"
            >
              <div photo>
                <i nz-icon nzType="plus"></i>
                <img src="./assets/image/man.png" alt="Photo" />
              </div>
            </nz-upload>

            }
          </div>
          <div class="member-name">
            <p>{{ model?.name }}</p>
            <app-member-class-badge
              [photo]="model?.memberClassPhoto"
              [name]="model?.memberClassName"
            />

            <!-- <div class="member-class">
              <img
                *ngIf="model?.memberClassPhoto"
                class="member-class-img"
                [src]="model.memberClassPhoto"
                [alt]="model?.memberClassName"
              />
              <span class="member-class-badge" *ngIf="model?.memberClassName">
                {{ model?.memberClassName }}
              </span>
            </div> -->
          </div>
          <nz-divider class="divider"></nz-divider>
          <div class="info-section">
            <h3>{{ "Information" | translate }}</h3>
            <div class="info">
              <nz-icon
                class="label"
                nzType="borderless-table"
                nzTheme="outline"
              />
              <div class="info-peice">
                <span class="label"> {{ ("Code" | translate) + ": " }} </span>
                <span class="value"> {{ model?.code }} </span>
              </div>
            </div>

            <div class="info">
              <nz-icon class="label" nzType="phone" nzTheme="outline" />
              <div class="info-peice">
                <span class="label"> {{ ("Phone" | translate) + ": " }} </span>
                <span class="value"> {{ model?.phone }} </span>
              </div>
            </div>

            <div class="info">
              <nz-icon nzType="calendar" nzTheme="outline" class="label" />
              <div class="info-peice">
                <span class="label">
                  {{ ("JoinDate" | translate) + ": " }}
                </span>
                <span class="value">
                  {{ model?.joinDate | customDate }}
                </span>
              </div>
            </div>
            <div class="info">
              <app-agent-icon class="label" />
              <div class="info-peice">
                <span class="label"> {{ ("Agent" | translate) + ": " }} </span>
                <span class="value"> {{ model?.agentName }} </span>
              </div>
            </div>
          </div>
          <nz-divider class="divider"></nz-divider>

          <ul class="menu-item" nz-menu nzTheme="light" nzMode="inline">
            <!-- account -->
            <ng-container *ngFor="let a of sortedAccounts; let i = index">
              <li
                *ngIf="
                  (a.accountType == AccountTypes.Wallet && isWalletList()) ||
                  (a.accountType == AccountTypes.Point && isPointList())
                "
                class="side-select"
                (click)="switchCurrent(i)"
                [nzSelected]="current == i"
                nz-menu-item
              >
                <div class="account-container">
                  <div class="account-left">
                    <div class="account-icon-mem">
                      <img
                        *ngIf="a?.accountTypeImage"
                        [src]="a?.accountTypeImage"
                        class="account-img"
                      />
                    </div>

                    <div class="account-info">
                      <span>{{
                        translateService.currentLang == "km"
                          ? a.accountTypeNameKh
                          : a.accountTypeNameEn
                      }}</span>
                      <div class="account-points">
                        {{ a.balance | accountBalance : a.accountType : true }}
                      </div>
                    </div>
                  </div>
                </div>
              </li></ng-container
            >
            @if( isCardList()){
            <li
              [nzSelected]="current == 2"
              (click)="switchCurrent(2)"
              class="side-select"
              nz-menu-item
            >
              <div class="account-container">
                <!-- Left Side: Icon + Text -->
                <div class="account-left">
                  <div class="account-icon-mem">
                    <i nz-icon nzType="credit-card" class="credit-icon"></i>
                  </div>

                  <div class="account-info">
                    <span>{{ "Card" | translate }}</span>
                  </div>
                </div>
              </div>
            </li>
            }
          </ul>
        </nz-sider>

        <nz-content>
          <app-loading *ngIf="isLoading()"></app-loading>
          <div [ngSwitch]="current" [style.height.%]="100">
            <ng-container *ngFor="let account of sortedAccounts; let i = index">
              <div *ngSwitchCase="i" class="tab-content">
                <nz-tabset class="tab" [(nzSelectedIndex)]="tranTab">
                  <ng-container
                    *ngIf="
                      (account.accountType == AccountTypes.Wallet &&
                        isWalletList()) ||
                      (account.accountType == AccountTypes.Point &&
                        isPointList())
                    "
                  >
                    <nz-tab [nzTitle]="'Transaction' | translate">
                      <app-account-list
                        [accountId]="account.accountId!"
                        [accountType]="account.accountType!"
                      ></app-account-list>
                    </nz-tab>
                  </ng-container>

                  <nz-tab
                    *ngIf="isRedemptionList()"
                    [nzTitle]="'Redemption' | translate"
                  >
                    <app-redemption-list
                      [memberId]="modal.id"
                      [isFromMember]="true"
                      [accountTypeInput]="account.accountType!"
                    />
                  </nz-tab>
                </nz-tabset>
              </div>
            </ng-container>
            <div class="tab" *ngSwitchCase="2" ngCase>
              <app-card-list
                *ngIf="isCardList() && model"
                [accountId]="model.defaultAccountId!"
                [memberId]="modal.id"
              />
            </div>
          </div>
        </nz-content>
      </nz-layout>
    </div>
    <div *nzModalFooter>
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
      <a nz-typography (click)="cancel()" class="grey-color">
        <i nz-icon nzType="close" nzTheme="outline"></i>
        <span class="action-text"> {{ "Close" | translate }}</span>
      </a>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [
    `
      .grey-color {
        color: gray !important;
      }
      .tab {
        margin: 0 8px;
      }
      .credit-icon {
        font-size: 18px !important;
      }

      .account-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
      }
      .ant-menu-item-selected {
        .ant-menu-title-content {
          .account-container {
            .account-left {
              .account-icon-mem {
                border: 1px solid #4470c240;
              }
            }
          }
        }
      }
      .info-peice {
        display: grid;
        grid-template-columns: 95px 1fr;
        .value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .account-left {
        display: flex;
        align-items: center;
      }

      .account-icon-mem {
        width: 45px;
        height: 45px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
      }
      .divider {
        margin: 16px 0;
      }

      .account-img {
        height: 22px;
      }

      .account-info {
        line-height: 20px;
      }

      .account-points {
        font-size: 18px;
        font-weight: bold;
        margin-top: 4px;
      }
      ////

      .side-select {
        padding: 0 !important;
        height: auto !important;
        border-radius: 8px !important;
      }
      .info-section {
        h3 {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .info {
          display: flex;
          gap: 4px;
          text-wrap: balance;
        }
      }
      .label {
        color: gray;
      }

      .member-name {
        text-align: center;

        p {
          margin-top: 5px;
          font-weight: bold;
          margin-bottom: 4px;
        }
      }

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
      .menu-item {
        background: #fff;
      }

      .sider-mem {
        height: calc(100vh - 160px);
        border-right: 1px solid #d9d9d9;
        overflow: auto;
        padding: 16px;
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
export class MemberViewComponent extends BaseOperationComponent<Member> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<MemberViewComponent>,
    service: MemberService,
    override uiService: MemberUiService,
    private redemptionUiService: RedemptionUiService,
    public accountUiService: AccountUiService,
    public accountService: AccountService,
    private settingService: SettingService,
    private authService: AuthService,
    public translateService: TranslateService,
    public nzImageService: NzImageService
  ) {
    super(fb, ref, service, uiService);
  }
  memberName = "";
  memberNameEn = "";
  photoSetted: boolean = false;
  current: number = 0;
  tranTab: number = 0;
  isMemberEdit = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__EDIT)
  );
  isMemberRemove = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__REMOVE)
  );
  isCardList = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__CARD__LIST)
  );
  isRedemptionList = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__REDEMPTION__LIST)
  );
  isWalletList = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__WALLET__LIST)
  );
  isPointList = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__POINT__LIST)
  );
  accountRefreshSub = new Subscription();
  redemptionRefreshSub = new Subscription();
  systemRefresh = new Subscription();
  uploadRefresh$ = new Subscription();
  file: NzUploadFile[] = [];
  submitRefresh = new Subscription();
  //  view
  nzShowButtonView = {
    showPreviewIcon: false,
    showDownloadIcon: false,
    showRemoveIcon: false,
  };

  onPreviewImage(): void {
    this.nzImageService.preview([{ src: this.file[0].url! }]);
  }

  override ngOnInit(): void {
    if (this.isLoading()) return;
    // this.initControl();
    // this.frm.disable();
    this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
      if (e.key === "edited") {
        this.photoSetted = false;
        this.isLoading.set(true);
        this.service.find(this.modal?.id).subscribe({
          next: (result: Member) => {
            this.model = result;
            // this.setFormValue();
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
      } else {
        this.ref.triggerCancel().then();
      }
    });

    const refreshBalance = () => {
      this.service.find(this.modal?.id).subscribe({
        next: (result: Member) => {
          this.model = result;
          if (
            this.model.photo &&
            this.model.photo !== "" &&
            !this.photoSetted
          ) {
            this.photoSetted = true;
            this.file = [];
            this.file.push({
              uid: "",
              name: this.model.name!,
              url: this.model.photo,
            });
          }
          // this.setFormValue();
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    };

    if (this.modal?.id) {
      this.isLoading.set(true);
      refreshBalance();
    }

    this.uploadRefresh$ = this.uiService.refresher.subscribe((e) => {
      if (e.key === "upload") {
        this.file = [];
        if (e?.value) {
          this.file.push(e.value);
        }
      }
    });
    if (!this.isWalletList() && !this.isPointList()) {
      this.current = AccountTabs.Card;
    } else if (!this.isWalletList()) {
      this.current = AccountTabs.Point;
    } else if (!this.isPointList()) {
      this.current = AccountTabs.Wallet;
    }

    this.accountRefreshSub =
      this.accountUiService.refresher.subscribe(refreshBalance);
    this.redemptionRefreshSub =
      this.redemptionUiService.refresher.subscribe(refreshBalance);
  }

  switchCurrent(index: AccountTabs) {
    switch (index) {
      case AccountTabs.Wallet:
        this.current = AccountTabs.Wallet;
        break;
      case AccountTabs.Point:
        this.current = AccountTabs.Point;
        break;
      case AccountTabs.Card:
        this.current = AccountTabs.Card;
        break;
    }
  }

  get sortedAccounts() {
    return (this.model?.accounts ?? []).slice().sort((a, b) => {
      if (a.accountType === AccountTypes.Wallet) return -1;
      if (b.accountType === AccountTypes.Wallet) return 1;
      return 0;
    });
  }

  override ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
    this.accountRefreshSub?.unsubscribe();
    this.redemptionRefreshSub?.unsubscribe();
    this.systemRefresh?.unsubscribe();
    this.submitRefresh?.unsubscribe();
    this.uploadRefresh$?.unsubscribe();
  }
  protected readonly AccountTypes = AccountTypes;
  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
