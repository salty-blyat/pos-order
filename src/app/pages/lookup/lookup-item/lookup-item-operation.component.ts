import { Component, computed, ViewEncapsulation } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { FormBuilder } from "@angular/forms";
import {
  CommonValidators,
  control,
} from "../../../utils/services/common-validators";
import { Image, LookupItem, LookupItemService } from "./lookup-item.service";
import { LookupItemUiService } from "./lookup-item-ui.service";
import { AuthService } from "../../../helpers/auth.service";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { SettingService } from "../../../app-setting";
import { BaseOperationComponent } from "../../../utils/components/base-operation.component";
import { AuthKeys } from "../../../const";
import { UUID } from "uuid-generator-ts";
import { subscribeOn, Subscription } from "rxjs";

@Component({
  selector: "app-lookup-item-operation",
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
          <div nz-col [nzSpan]="14">
            <nz-form-item>
              <nz-form-label [nzSpan]="7" nzRequired>{{
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
              <nz-form-label [nzSpan]="7" nzRequired>{{
                "NameEn" | translate
              }}</nz-form-label>
              <nz-form-control nzHasFeedback>
                <input nz-input formControlName="nameEn" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSpan]="7">{{
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
          <div nz-col [nzSpan]="8" nzOffset="2">
            <!-- <nz-form-item>
                          <nz-form-label [nzSpan]="7">{{ "Image" | translate }}</nz-form-label>
                          <nz-form-control>
                              <nz-upload
                                      *ngIf="!modal?.isView"
                                      [nzAction]="uploadUrl"
                                      nzListType="picture-card"
                                      [(nzFileList)]="file"
                                      (nzChange)="handleUploadLookupItem($event)"
                                      [nzShowUploadList]="nzShowIconList"
                                      [nzShowButton]="file.length < 1"
                              >
                                  <div>
                                      <span nz-icon nzType="plus"></span>
                                      <div class="upload-text">{{ "Upload" | translate }}</div>
                                  </div>
                              </nz-upload>
                              <nz-upload
                                      *ngIf="modal?.isView"
                                      profile
                                      [nzAction]="uploadUrl"
                                      nzListType="picture-card"
                                      [(nzFileList)]="file"
                                      (nzChange)="handleUploadLookupItem($event)"
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
                      </nz-form-item> -->
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24">{{
                "Image" | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="18" [nzXs]="24" nzErrorTip="">
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
                  [nzAction]="uploadUrl"
                  nzListType="picture-card"
                  [(nzFileList)]="file"
                  (nzChange)="handleUpload($event)"
                  [nzShowButton]="file.length < 1"
                  [nzShowUploadList]="nzShowButtonView"
                  [nzDisabled]="true"
                >
                  <div>
                    <span nz-icon nzType="plus"></span>
                    <div class="upload-text">{{ "Upload" | translate }}</div>
                  </div>
                </nz-upload>
                } @else {
                <nz-upload
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
            <nz-form-item>
              <nz-form-label [nzSpan]="7">{{
                "Color" | translate
              }}</nz-form-label>
              <nz-form-control>
                <div style="display: flex; align-items: center;">
                  <nz-color-picker
                    formControlName="color"
                    nzShowText
                  ></nz-color-picker>
                  <button
                    nz-button
                    nzType="link"
                    [disabled]="modal?.isView"
                    nzDanger=""
                    (click)="
                      !modal?.isView ? frm.get('color')?.setValue(null) : null
                    "
                  >
                    <span nz-icon nzType="close"></span>
                  </button>
                </div>
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
          *ngIf="!isLoading() && isLookupEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isLookupEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isLookupRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isLookupRemove()"
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
        border-color: #rgb(131, 131, 131);
      }
    `,
  ],
  styleUrls: ["../../../../assets/scss/operation.style.scss"],

  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class LookupItemOperationComponent extends BaseOperationComponent<LookupItem> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<LookupItemOperationComponent>,
    override service: LookupItemService,
    override uiService: LookupItemUiService,
    private settingService: SettingService,
    private authService: AuthService
  ) {
    super(fb, ref, service, uiService);
  }

  isLookupEdit = computed(() => true);
  isLookupRemove = computed(() => true);

  file: NzUploadFile[] = [];
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  image!: String;
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
  uploadRefresh$ = new Subscription();
  override ngOnInit(): void {
    console.log(this.modal); 
    if (this.isLoading()) return;
    this.initControl();
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === "edited") {
          this.isLoading.set(true);
          this.service.find(this.modal?.id).subscribe({
            next: (result: LookupItem) => {
              this.model = result;
              this.setFormValue();
              if (this.model.image) {
                this.file = [
                  {
                    uid: "",
                    name: this.model.name!,
                    url: this.model.image,
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
    }
    if (this.modal?.id) {
      this.isLoading.set(true);
      this.service.find(this.modal?.id).subscribe((result: LookupItem) => {
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
  }

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      nameExistValidator,
      required,
      noteMaxLengthValidator,
    } = CommonValidators;
    
    this.frm = this.fb.group({
      lookupTypeId: [this.modal?.lookupTypeId],
      image: [null],
      name: [
        null,
        [required, nameMaxLengthValidator],
        [
          nameExistValidator(
            this.service,
            this.modal?.id,
            control.name,
            this.modal?.lookupTypeId
          ),
        ],
      ],
      nameEn: [
        null,
        [required, nameMaxLengthValidator],
        [
          nameExistValidator(
            this.service,
            this.modal?.id,
            control.nameEn,
            this.modal?.lookupTypeId
          ),
        ],
      ],
      ordering: [0],
      color: [null],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  handleUpload(info: NzUploadChangeParam): void {
    let fileListLookupItems = [...info.fileList];
    // 1. Limit 5 number of uploaded files
    fileListLookupItems = fileListLookupItems.slice(-5);
    // 2. Read from response and show file link
    fileListLookupItems = fileListLookupItems.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    this.file = fileListLookupItems;
  }

  override onSubmit(e: any): void {
    if (this.frm.valid) {
      this.isLoading.set(true);
      if (this.file.length > 0) this.image = this.file[0].url!;

      let operation$ = this.service.add({
        ...this.frm.value,
        image: this.image,
      });

      if (this.model?.id) {
        operation$ = this.service.edit({
          ...this.frm.value,
          id: this.model?.id,
          image: this.image,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        operation$.subscribe({
          next: (result: LookupItem) => {
            this.model = result;
            // this.isLoading.set(false);
            this.ref.triggerOk().then();
          },
          error: (err: any) => {
            this.isLoading.set(false);
            console.log(err);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
      }
    }
  }

  override setFormValue() {
    this.frm.patchValue({
      lookupTypeId: this.model?.lookupTypeId,
      name: this.model.name,
      nameEn: this.model.nameEn,
      ordering: this.model.ordering,
      color: this.model.color,
      note: this.model.note,
    });

    const imageUrl = this.model?.image;

    if (imageUrl) {
      this.file = [
        { url: this.model.image, uid: "", name: "" } as NzUploadFile,
      ];
    }
  }

  override ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
    // this.uploadRefresh$?.unsubscribe();
  }
}
