import { Component, computed, ViewEncapsulation } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { FormBuilder } from "@angular/forms";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { OfferGroup, OfferGroupService } from "./offer-group.service";
import { OfferGroupUiService } from "./offer-group-ui.service";
import { SettingService } from "../../app-setting";
import { AuthService } from "../../helpers/auth.service";
import { CommonValidators } from "../../utils/services/common-validators";
import { Observable } from "rxjs";

@Component({
  selector: "app-offer-group-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.name || ("loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.name || ("loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <div nz-row>
          <div nz-col [nzSpan]="16">
            <nz-form-item>
              <nz-form-label [nzSpan]="8" nzRequired>{{
                "Name" | translate
              }}</nz-form-label>
              <nz-form-control nzHasFeedback>
                <input *ngIf="modal?.id" nz-input formControlName="name" />
                <input
                  *ngIf="!modal?.id"
                  [autofocus]="true"
                  nz-input
                  formControlName="name"
                />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="8">{{
                "Note" | translate
              }}</nz-form-label>
              <nz-form-control>
                <textarea
                  nz-input
                  rows="3"
                  formControlName="note"
                  style="width: 100%;"
                ></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzSpan]="4" nzOffset="1">
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
                  (nzChange)="handleUploadOfferGroupItem($event)"
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
                  (nzChange)="handleUploadOfferGroupItem($event)"
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
      </form>
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
          *ngIf="!isLoading() && isOfferGroupEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isOfferGroupEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isOfferGroupRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isOfferGroupRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
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
        border-color: #1890ff;
      }
    `,
  ],
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class OfferGroupOperationComponent extends BaseOperationComponent<OfferGroup> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<OfferGroupOperationComponent>,
    service: OfferGroupService,
    public override uiService: OfferGroupUiService,
    private settingService: SettingService,
    private authService: AuthService
  ) {
    super(fb, ref, service, uiService);
  }

  isOfferGroupEdit = computed(() => true);
  isOfferGroupRemove = computed(() => true);

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
  }

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      nameExistValidator,
      required,
      noteMaxLengthValidator,
    } = CommonValidators;

    this.frm = this.fb.group({
      image: [null],
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  handleUploadOfferGroupItem(info: NzUploadChangeParam): void {
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
  override onSubmit(e: any): void {
    if (this.frm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      if (this.file.length > 0) {
        this.frm.patchValue({
          image: this.file[0].url,
        });
      }
      let operation$: Observable<OfferGroup> = this.service.add(
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
          next: (result: OfferGroup) => {
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

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      image: this.model.image,
      note: this.model.note,
    });

    if (this.model.image) {
      this.file = [];
      this.file.push({
        uid: "",
        name: this.model.name!,
        url: this.model.image,
      });
    }
  }
}
