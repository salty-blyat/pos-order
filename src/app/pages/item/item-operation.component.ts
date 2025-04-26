import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Item } from "./item.service";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { ItemService } from "./item.service";
import { ItemUiService } from "./item-ui.service";
import { CommonValidators } from "../../utils/services/common-validators";
import { SettingService } from "../../app-setting";
import { Image } from "../lookup/lookup-item/lookup-item.service";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { Observable } from "rxjs";

@Component({
  selector: "app-item-operation",
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
    <div class="modal-content" style="padding: 0 24px;">
      <app-loading *ngIf="isLoading()" />
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <div nz-row>
          <div nz-col [nzSpan]="16">
            <nz-form-item>
              <nz-form-label [nzSpan]="7" nzRequired>{{
                "Code" | translate
              }}</nz-form-label>
              <nz-form-control [nzSpan]="14" nzHasFeedback>
                <input nz-input formControlName="code" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="7" nzRequired>{{
                "Name" | translate
              }}</nz-form-label>
              <nz-form-control [nzSpan]="14" nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="7" nzRequired>{{
                "ItemType" | translate
              }}</nz-form-label>
              <nz-form-control [nzSpan]="14">
                <app-item-type-select
                  [storageKey]="'item-type-filter'"
                  formControlName="itemTypeId"
                  [addOption]="true"
                ></app-item-type-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="7">{{
                "Note" | translate
              }}</nz-form-label>
              <nz-form-control [nzSpan]="14">
                <textarea nz-input formControlName="note" rows="3"></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>

          <div nz-col [nzSpan]="8">
            <nz-form-item>
              <nz-form-label>{{ "Image" | translate }}</nz-form-label>
              <nz-form-control>
                <nz-upload
                  [nzAction]="uploadUrl"
                  [(nzFileList)]="file"
                  nzListType="picture-card"
                  (nzChange)="handleUploadProfile($event)"
                  [nzShowUploadList]="nzShowIconList"
                  [nzShowButton]="file.length < 1"
                  [nzDisabled]="modal?.isView"
                >
                  <div>
                    <span nz-icon nzType="plus"></span>
                    <div class="upload-text">{{ "Upload" | translate }}</div>
                  </div>
                </nz-upload>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label>{{ "IsTrackSerial" | translate }}</nz-form-label>
              <nz-form-control>
                <label nz-checkbox formControlName="isTrackSerial"></label>
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
        <a *ngIf="!isLoading()">
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!isLoading()"></nz-divider>
        <a nz-typography nzType="danger" *ngIf="!isLoading()">
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!isLoading()"></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ItemOperationComponent extends BaseOperationComponent<Item> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<ItemOperationComponent>,
    override service: ItemService,
    override uiService: ItemUiService,
    private settingService: SettingService
  ) {
    super(fb, ref, service, uiService);
  }
  file: NzUploadFile[] = [];
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  image!: Image;
  nzShowIconList = false;
  override initControl(): void {
    const {
      required,
      nameMaxLengthValidator,
      nameExistValidator,
      noteMaxLengthValidator,
      codeExistValidator,
    } = CommonValidators;

    this.frm = this.fb.group({
      code: [
        null,
        [required, nameMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      image: [null],
      itemTypeId: [null],
      isTrackSerial: [false],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  override setFormValue(): void {
    this.frm.setValue({
      code: this.model.code,
      name: this.model.name,
      image: this.model.image,
      itemTypeId: this.model.itemTypeId,
      isTrackSerial: this.model.isTrackSerial,
      note: this.model.note,
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
      return file;
    });
    this.file = fileList;
  }

  override onSubmit(e?: any) {
    if (this.frm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      if (this.file.length > 0) {
        this.frm.patchValue({
          image: this.file[0].url,
        });
      }
      let operation$: Observable<Item> = this.service.add(
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
          next: (result: Item) => {
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
}
