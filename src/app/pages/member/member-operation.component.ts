import {Component, ViewEncapsulation} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {BaseOperationComponent} from "../../utils/components/base-operation.component";
import {CommonValidators} from "../../utils/services/common-validators";
import {Attachment, Member, MemberService} from "./member.service";
import {MemberUiService} from "./member-ui.service";
import {SettingService} from "../../app-setting";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import {LOOKUP_TYPE} from "../lookup/lookup-type.service";
import {SETTING_KEY, SystemSetting, SystemSettingService} from "../system-setting/system-setting.service";
import {Observable, Observer} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthService} from "../../helpers/auth.service";

@Component({
  selector: "app-member-operation",
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ 'Add' | translate }}</span>
          <span *ngIf="modal?.id && !modal?.isView">{{ 'Edit' | translate }}{{ model?.code + ' ' + model?.name! || ('Loading' | translate) }}</span>
          <span *ngIf="modal?.id && modal?.isView">{{ model?.code + ' ' + model?.name! || ('Loading' | translate) }}</span>
      </div>
      <div class="modal-content">
          <nz-layout>
              <nz-sider nzTheme="light" class="sider-member" nzWidth="220px">
                  <div class="photo">
                      <nz-upload
                              class="profile"
                              [nzAction]="uploadUrl"
                              [(nzFileList)]="fileProfile"
                              [nzBeforeUpload]="beforeUpload"
                              (nzChange)="handleUploadMember($event)"
                              nzListType="picture-card"
                              [nzShowButton]="fileProfile.length < 1"
                      >
                          <div photo>
                              <i nz-icon nzType="plus"></i>
                              <img [src]="frm.controls['sexId'].value == 2
                                          ? './assets/image/female.jpg'
                                          : './assets/image/man.png'
                                      " alt="Photo"
                              />
                          </div>
                      </nz-upload>
                  </div>
                  <div class="member-name">
                      <p *ngIf="customerName === ''">
                          {{ customerNameEn || 'NewMember' | translate }}
                      </p>
                      <p *ngIf="customerName !== ''">{{ customerName }}</p>
                  </div>

                  <ul class="menu-item" nz-menu nzTheme="light" nzMode="inline">
                      <li
                              nz-menu-item
                              [nzSelected]="current == 1"
                              (click)="switchCurrent(1)"
                      >
                          <i nz-icon nzType="user"></i>
                          <span>{{ 'Information' | translate }}</span>
                      </li>
                      <li
                              *ngIf="modal?.isView"
                              nz-menu-item
                              [nzSelected]="current == 2"
                              (click)="switchCurrent(2)"
                      >
                          <i nz-icon nzType="upload"></i>
                          <span>{{ 'Attachment' | translate }}</span>
                      </li>
                  </ul>
              </nz-sider>
              <nz-content [ngStyle]="{ padding: current == 3 ? '0' : '' }">
                  <app-loading *ngIf="isLoading()"></app-loading>
                  <div [ngSwitch]="current" [style.height.%]="100">
                      <form
                              nz-form
                              [formGroup]="frm"
                              [style.height.%]="100"
                              [nzAutoTips]="autoTips"
                              [ngStyle]="{ padding: current == 3 ? '0' : '' }"
                      >
                          <div *ngSwitchCase="1" nz-row ngCase>
                              <div nz-col [nzXs]="23">
                                  <div nz-row>
                                      <div nz-col [nzXs]="24">
                                          <div nz-row>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>{{
                                                              'Code' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
                                                          <input [autofocus]="true" nz-input formControlName="code"
                                                                 placeholder="{{ 'NewCode' | translate }}"/>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">{{
                                                              'DateOfBirth' | translate
                                                          }}
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
                                                      <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>{{
                                                              'Name' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24">
                                                          <input nz-input formControlName="name"/>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">{{
                                                              'NameEn' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24">
                                                          <input nz-input formControlName="nameEn"/>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                          <div nz-row>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>{{
                                                              'Gender' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control
                                                              [nzSm]="14"
                                                              [nzXs]="24"
                                                              nzErrorTip=""
                                                      >
                                                          <app-lookup-item-select
                                                                  formControlName="sexId"
                                                                  [lookupType]="LOOKUP_TYPE.SexId"
                                                          ></app-lookup-item-select>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>{{
                                                              'Nationality' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control
                                                              [nzSm]="14"
                                                              [nzXs]="24"
                                                              nzErrorTip=""
                                                      >
                                                          <app-lookup-item-select
                                                                  formControlName="nationalityId"
                                                                  [lookupType]="LOOKUP_TYPE.Nationality"
                                                          ></app-lookup-item-select>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                          <div nz-row>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>{{
                                                              'Phone' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control
                                                              [nzSm]="14"
                                                              [nzXs]="24"
                                                              nzErrorTip=""
                                                      >
                                                          <input nz-input formControlName="phone"/>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">{{
                                                              'Email' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control
                                                              [nzSm]="14"
                                                              [nzXs]="24"
                                                              nzErrorTip=""
                                                      >
                                                          <input nz-input formControlName="email"/>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                          <div nz-row>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">
                                                          <span style="font-size: 12px;">
                                                            {{ 'NationalId' | translate }} / <br/>
                                                              {{ 'Passport' | translate }}&nbsp;&nbsp;
                                                          </span>
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24">
                                                          <input nz-input formControlName="idNo"/>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">{{
                                                              'NssfId' | translate
                                                          }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24">
                                                          <input nz-input formControlName="nssfId"/>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                          <div nz-row>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">{{ 'MemberUnit' | translate }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24">
                                                          <app-member-unit-select formControlName="memberUnitId"></app-member-unit-select>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">{{ 'MemberGroup' | translate }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24">
                                                          <app-member-group-select
                                                                  formControlName="memberGroupId"></app-member-group-select>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                          <div>
                                              <div nz-col [nzXs]="12">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="8" [nzXs]="24">{{ 'MemberLevel' | translate }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="14" [nzXs]="24">
                                                          <app-member-level-select
                                                                  formControlName="memberLevelId"></app-member-level-select>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                          <div nz-row>
                                              <div nz-col [nzXs]="24">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="4" nzRequired>{{ 'Address' | translate }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="19">
                                                          <textarea nz-input formControlName="address"
                                                                    rows="3"></textarea>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                          <div nz-row>
                                              <div nz-col [nzXs]="24">
                                                  <nz-form-item>
                                                      <nz-form-label [nzSm]="4">{{ 'Note' | translate }}
                                                      </nz-form-label>
                                                      <nz-form-control [nzSm]="19">
                                                          <textarea nz-input formControlName="note" rows="3"></textarea>
                                                      </nz-form-control>
                                                  </nz-form-item>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div *ngSwitchCase="2" nz-row ngCase>
                              <div nz-col [nzXs]="24">
                                  <nz-form-item>
                                      <nz-form-control style="padding: 0 16px;" [nzXs]="24" nzErrorTip="">
                                          <nz-table
                                                  nzSize="small"
                                                  #fixedTable
                                                  nzTableLayout="fixed"
                                                  [nzData]="attachments"
                                                  [nzShowPagination]="false"
                                                  [nzFrontPagination]="false"
                                                  [nzNoResult]="noResult"
                                                  [nzFooter]="addNewChildren"
                                          >
                                              <ng-template #noResult></ng-template>
                                              <ng-template #addNewChildren>
                                                  <a nz-button nzBlock nzType="link">
                                                      <nz-upload
                                                              [nzAction]="uploadUrl"
                                                              [(nzFileList)]="fileLists"
                                                              (nzChange)="handleChange($event)"
                                                              [nzShowUploadList]="false"
                                                      >
                                                          <button nz-button nzType="link">
                                                              <span nz-icon nzType="plus"></span>
                                                              {{ 'New upload' | translate }}
                                                          </button>
                                                      </nz-upload>
                                                  </a>
                                              </ng-template>
                                              <thead>
                                              <tr>
                                                  <th class="col-header" nzWidth="25px">#</th>
                                                  <th class="col-header" nzWidth="35%">
                                                      {{ 'Filename' | translate }}
                                                  </th>
                                                  <th nzWidth="16%">{{ 'Type' | translate }}</th>
                                                  <th class="col-header" nzWidth="25%">
                                                      {{ 'Upload date' | translate }}
                                                  </th>
                                                  <th class="col-header" nzWidth="20%">
                                                      {{ 'Upload by' | translate }}
                                                  </th>
                                                  <th nzWidth="50px"></th>
                                              </tr>
                                              </thead>
                                              <tbody>
                                              <ng-container
                                                      *ngFor="let item of attachments; let i = index"
                                              >
                                                  <tr>
                                                      <td>
                                                          <strong>{{ i + 1 }}</strong>
                                                      </td>
                                                      <td nzEllipsis>
                                                          <a [href]="item.url" target="_blank">{{
                                                                  item.name
                                                              }}</a>
                                                      </td>
                                                      <td nzEllipsis>{{ item.type }}</td>
                                                      <td nzEllipsis>
                                                          {{ item.date | date : 'yyyy-MM-dd hh:mm a' }}
                                                      </td>
                                                      <td nzEllipsis>{{ item.by }}</td>
                                                      <td>
                                                          <a
                                                                  nz-button
                                                                  nzType="link"
                                                                  nzDanger
                                                                  (click)="removeAttachment(i)"
                                                          >
                                                              <i
                                                                      nz-icon
                                                                      nzType="delete"
                                                                      nzTheme="outline"
                                                              ></i>
                                                          </a>
                                                      </td>
                                                  </tr>
                                              </ng-container>
                                              <tr *ngIf="uploadLoading">
                                                  <td>
                                                      <strong>{{ attachments.length + 1 }}</strong>
                                                  </td>
                                                  <td colspan="6">
                                                      <nz-skeleton
                                                              [nzActive]="true"
                                                              [nzParagraph]="{ rows: 0 }"
                                                      ></nz-skeleton>
                                                  </td>
                                              </tr>
                                              </tbody>
                                          </nz-table>
                                      </nz-form-control>
                                  </nz-form-item>
                              </div>
                          </div>
                      </form>
                  </div>
              </nz-content>
          </nz-layout>
      </div>
      <div *nzModalFooter>
          <div *ngIf="!modal?.isView">
              <button nz-button nzType="primary" [disabled]="!frm.valid || isLoading()" (click)="onSubmit($event)">
                  <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
                  {{ 'Save' | translate }}
              </button>
              <button nz-button nzType="default" (click)="cancel()">
                  {{ 'Cancel' | translate }}
              </button>
          </div>
          <div *ngIf="modal?.isView">
              <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!isLoading() && isCustomerEdit">
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ 'Edit' | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isCustomerEdit"></nz-divider>
              <a nz-typography nzType="danger" (click)="uiService.showDelete(model.id || 0)"
                 *ngIf="!isLoading() && isCustomerRemove">
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ 'Delete' | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isCustomerRemove"></nz-divider>
              <a nz-typography (click)="cancel()" style="color: gray;">
                  <i nz-icon nzType="close" nzTheme="outline"></i>
                  <span class="action-text"> {{ 'Close' | translate }}</span>
              </a>
          </div>
      </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [`
    .photo {
      width: 108px;
      height: auto;
      padding: 1px;
      min-height: 2cm;
      margin: 16px auto 0;
      border: 1px solid #d0cfcf;
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
      height: calc(100vh - 180px);
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
      }
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class MemberOperationComponent extends BaseOperationComponent<Member> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<MemberOperationComponent>,
    service: MemberService,
    uiService: MemberUiService,
    private settingService: SettingService,
    private systemSettingService: SystemSettingService,
    private msg: NzMessageService,
    private authService: AuthService,
  ) {
    super(fb, ref, service, uiService);
  }

  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  uploadLoading: boolean = false;
  fileProfile: NzUploadFile[] = [];
  attachments: Attachment[] = [];
  fileLists: NzUploadFile[] = [];
  current = 1;
  customerName = '';
  customerNameEn = '';
  isCustomerEdit: boolean = true;
  isCustomerRemove: boolean = true;

  override ngOnInit(): void {
    super.ngOnInit();
    this.initControl();
    this.systemSettingService.find(SETTING_KEY.MemberAutoId).subscribe({
      next: (value?:string) => {
        if (value){
          this.frm.get("code")?.disable();
        }
      }
    })
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === 'edited') {
          this.find(this.modal?.id);
        } else {
          this.ref.triggerCancel().then();
        }
      });
    }
    if (this.modal?.id) {
      this.find(this.modal?.id);
    }

    this.frm.get('name')?.valueChanges.subscribe({
      next: (event: any) => {
        this.customerName = event;
      },
    });
    this.frm.get('nameEn')?.valueChanges.subscribe({
      next: (event: any) => {
        this.customerNameEn = event;
      },
    });
  }

  find(id: number) {
    this.isLoading.set(true);
    this.service.find(id).subscribe({
      next: (result: any) => {
        this.model = result;
        this.setFormValue(result);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    // 1. Limit 10 number of uploaded files
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
    this.fileLists = fileList;
    let attachment: Attachment = {};
    let username = this.authService.clientInfo.name;
    this.fileLists.map((file) => {
      return (attachment = {
        uid: file.uid,
        name: file.name,
        url: file.url,
        type: file.type,
        date: new Date(),
        by: username,
      });
    });
    this.uploadLoading = true;
    if (attachment.url) {
      this.uploadLoading = false;
      this.attachments.push(attachment);
      this.autoUpload();
    }
  }

  getTime(date: any) {
    return new Date(date).getTime();
  }

  removeAttachment(i: number) {
    this.attachments.splice(i, 1);
    this.autoUpload();
  }

  handleUploadMember(info: NzUploadChangeParam): void {
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
    this.fileProfile = fileList;
  }

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      noteMaxLengthValidator,
      required,
      codeExistValidator,
      multiplePhoneValidator,
      codeMaxLengthValidator,
      integerValidator
    } = CommonValidators;
    this.frm = this.fb.group({
      code: [{ value: null, disabled: true }, [required, codeMaxLengthValidator], [codeExistValidator(this.service, this.modal?.id)]],
      name: [null, [required, nameMaxLengthValidator]],
      nameEn: [null],
      birthDate: [null],
      sexId: [null, [required]],
      nationalityId: [0, [required]],
      memberUnitId: [0],
      memberGroupId: [0],
      memberLevelId: [0],
      idNo: [null, [integerValidator]],
      nssfId: [null],
      phone: [null, [required, multiplePhoneValidator]],
      email: [null],
      address: [null, [required]],
      note: [null, [noteMaxLengthValidator]],
    });
  }

  autoUpload() {
    if (this.frm.getRawValue() && this.modal?.isView) {
      let photo = this.fileProfile[0]?.url;
      this.service
        .edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
          photo: photo,
          attachments: this.attachments,
        })
        .subscribe({
          next: (result: Member) => {
            this.model = result;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  override onSubmit(e?:any): void {
    if (this.frm.valid) {
      this.isLoading.set(true);
      let photo = this.fileProfile[0]?.url;
      let operation$ = this.service.add({
        ...this.frm.getRawValue(),
        photo: photo,
        attachments: this.attachments,
      });
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
          photo: photo,
          attachments: this.attachments,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        operation$.subscribe({
          next: (result: Member) => {
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


  override setFormValue(model?: Member) {
    if (model) {
      this.frm.patchValue({
        code: model?.code,
        name: model?.name,
        nameEn: model?.nameEn,
        birthDate: model?.birthDate,
        sexId: model?.sexId,
        nationalityId: model?.nationalityId,
        memberUnitId: model?.memberUnitId,
        memberGroupId: model?.memberGroupId,
        memberLevelId: model?.memberLevelId,
        idNo: model?.idNo,
        nssfId: model?.nssfId,
        phone: model?.phone,
        email: model?.email,
        address: model?.address,
        note: model?.note,
      });

      if (model?.photo) {
        this.fileProfile = [];
        this.fileProfile.push(<NzUploadFile>{url: model?.photo, uid: model?.photo});
      }
      if (model?.attachments) {
        this.attachments = model?.attachments;
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
      case 4:
        this.current = 4;
        break;
    }
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
