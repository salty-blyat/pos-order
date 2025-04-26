import {Component, inject, Input, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonValidators, control } from "../../../utils/services/common-validators";
import { Image, LookupItem, LookupItemService } from "./lookup-item.service";
import { LookupItemUiService } from "./lookup-item-ui.service";
import { AuthService } from "../../../helpers/auth.service";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { SettingService } from "../../../app-setting";

@Component({
  selector: "app-lookup-item-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal.id && !modal.isView"
        >{{ "Edit" | translate }} {{ model.name || ("loading" | translate) }}</span
      >
      <span *ngIf="modal.id && modal.isView">{{ model.name || ("loading" | translate) }}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="loading" style="position: absolute; top: 50%; left: 50%"></nz-spin>
      <form nz-form [formGroup]="frm"  [nzAutoTips]="autoTips">
        <div nz-row>
          <div nz-col [nzSpan]="14">
            <nz-form-item>
              <nz-form-label [nzSpan]="7" nzRequired>{{ "Name" | translate }}</nz-form-label>
              <nz-form-control nzHasFeedback>
                <input *ngIf="modal.id" nz-input formControlName="name" />
                <input *ngIf="!modal.id" [autofocus]="true" nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="7" nzRequired>{{ "NameEn" | translate }}</nz-form-label>
              <nz-form-control nzHasFeedback>
                <input nz-input formControlName="nameEn" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSpan]="7">{{ "Note" | translate }}</nz-form-label>
              <nz-form-control>
                <textarea nz-input rows="3" formControlName="note" style="width: 100%;"></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzSpan]="8" nzOffset="2">
            <nz-form-item>
              <nz-form-label [nzSpan]="7" >{{ "Image" | translate }}</nz-form-label>
              <nz-form-control>
                <nz-upload
                  *ngIf="!modal?.isView"
                  [nzAction]="uploadUrl"
                  nzListType="picture-card"
                  [(nzFileList)]="file"
                  (nzChange)="handleUploadProfile($event)"
                  [nzShowUploadList]="nzShowIconList"
                  [nzShowButton]="file.length < 1"
                >
                  <div>
                    <span nz-icon nzType="plus"></span>
                    <div class="upload-text">{{ "Upload" | translate }}</div>
                  </div>
                </nz-upload>
<!-- 
                <div *ngIf="modal?.isView" class="image-container">
                  <img 
                    [src]="file.length ? file[0].url : './assets/image/img-not-found.jpg'" 
                    alt="Profile Image" 
                    class="view-image"
                  />
                </div> -->

                <nz-upload
                  *ngIf="modal?.isView"
                  profile
                  [nzAction]="uploadUrl"
                  nzListType="picture-card"
                  [(nzFileList)]="file"
                  (nzChange)="handleUploadProfile($event)"
                  [nzShowButton]="file.length < 1"
                  [nzShowUploadList]="nzShowUploadList"
                  [nzDisabled]="true"
                >
                  <div>
                    <span nz-icon nzType="plus"></span>
                    <div class="upload-text">{{ "Upload" | translate }}</div>
                  </div>
                </nz-upload>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSpan]="7">{{ "Color" | translate }}</nz-form-label>
              <nz-form-control>
                <nz-color-picker formControlName="color" nzShowText></nz-color-picker>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!modal.isView">
        <button nz-button nzType="primary" [disabled]="!frm.valid || loading" (click)="onSubmit()">
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
      <div *ngIf="modal.isView">
        <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!loading && isLookupEdit">
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading && isLookupEdit"></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading && isLookupRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading && isLookupRemove"></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep .ant-modal {
        top: 116px;
      }
      a i {
        padding-right: 6px;
      }
      :host ::ng-deep .ant-upload.ant-upload-select-picture-card {
        width: 104px;
        height: 104px;
        margin: 0;
      }

      :host ::ng-deep .ant-upload-list-picture-card-container {
        width: 104px;
        height: 104px;
        margin: 0;
      }

      :host ::ng-deep .ant-upload-list-picture-card .ant-upload-list-item-actions {
        display: flex;
      }
      :host ::ng-deep .ant-upload-list-picture-card .ant-upload-list-item-actions a {
        display: flex;
        align-items: center;
      }

      :host ::ng-deep .ant-upload-list-picture-card .ant-upload-list-item {
        padding: 0;
      }
      .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 104px;
        height: 104px;
        border: 1px solid #d9d9d9;
        overflow: hidden;
      }

      .view-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

    `,
  ],
  styleUrls: ["../../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class LookupItemOperationComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private ref: NzModalRef<LookupItemOperationComponent>,
    private service: LookupItemService,
    public uiService: LookupItemUiService,
    private settingService: SettingService,
    private authService: AuthService
  ) { }

  readonly modal: any = inject(NZ_MODAL_DATA);
  loading = false;
  frm!: FormGroup;
  model: LookupItem = {};
  autoTips = CommonValidators.autoTips;
  refreshSub$: any;
  isLookupEdit: boolean = true;
  isLookupRemove: boolean = true;

  file: NzUploadFile[] = [];
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  image!: Image;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
  };
  nzShowIconList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  ngOnInit(): void {
    // this.isLookupEdit = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__LOOKUP__EDIT
    // );
    // this.isLookupRemove = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__LOOKUP__REMOVE
    // );
    this.onInitControl();
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === "edited") {
          this.loading = true;
          this.service.find(this.modal.id).subscribe(
            (result: any) => {
              this.loading = false;
              this.model = result;
              this.setFormValue();
            },
            (err: any) => {
              console.log(err);
            }
          );
        } else {
          this.ref.triggerCancel();
        }
      });
    }
    if (this.modal.id) {
      this.loading = true;
      this.service.find(this.modal.id).subscribe((result: any) => {
        this.loading = false;
        this.model = result;
        this.setFormValue();
      });
    }
  }

  onInitControl(): void {
    const { nameMaxLengthValidator, nameExistValidator, required, noteMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      lookupTypeId: [this.modal.lookupTypeId],
      image: [null],
      name: [
        "",
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal.id, control.name, this.modal.lookupTypeId)],
      ],
      nameEn: [
        "",
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal.id, control.nameEn, this.modal.lookupTypeId)],
      ],
      ordering: [0],
      color: [null],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  handleUploadProfile(info: NzUploadChangeParam): void {
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
      console.log(file);
      return file;
    });
    this.file = fileList;
  }

  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;
      this.file.map((item) => {
        this.image = { uid: item.uid, url: item.url!, name: item.name!, type: item.type! };
      });
      let operation$ = this.service.add({ ...this.frm.value, image: this.image });
      if (this.modal.id) {
        operation$ = this.service.edit({ ...this.frm.value, id: this.modal.id, image: this.image });
      }
      operation$.subscribe(
        (result: LookupItem) => {
          this.model = result;
          this.loading = false;
          this.ref.triggerOk();
          // console.log(this.model)
        },
        (err: any) => {
          this.loading = false;
          console.log(err);
        }
      );
    }
  }

  cancel(): void {
    this.ref.triggerCancel();
  }

  setFormValue() {
    this.frm.patchValue({
      lookupTypeId: this.model.lookupTypeId,
      name: this.model.name,
      nameEn: this.model.nameEn,
      ordering: this.model.ordering,
      color: this.model.color,
      note: this.model.note,
    });

    const imageUrl = this.model.image?.url;

    if (imageUrl) {
      this.file = [this.model.image as NzUploadFile];
    }
    // if (!imageUrl) {
    //   const url: string = './assets/image/img-not-found.jpg';
    //   this.file = [{ url } as NzUploadFile];
    // }
  }
  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
