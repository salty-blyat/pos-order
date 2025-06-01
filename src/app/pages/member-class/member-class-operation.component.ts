import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { AuthService } from "../../helpers/auth.service";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { MemberClass, MemberClassService } from "./member-class.service";
import { MemberClassUiService } from "./member-class-ui.service";
import { Observable } from "rxjs";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { SettingService } from "../../app-setting";

@Component({
  selector: "app-member-class-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.code || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.code || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <div nz-row>
          <div nz-col [nzSpan]="16">
            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                >{{ "Code" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24" nzHasFeedback>
                <input nz-input formControlName="code" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                >{{ "Name" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24" nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24"
                >{{ "Note" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="16" [nzXs]="24">
                <textarea nz-input formControlName="note" rows="3"></textarea>
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
          (click)="uiService.showEdit(model.id || 0)"
          *ngIf="!isLoading() && isMemberClassEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isMemberClassEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isMemberClassRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isMemberClassRemove()"
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
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class MemberClassOperationComponent extends BaseOperationComponent<MemberClass> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<MemberClassOperationComponent>,
    private authService: AuthService,
    service: MemberClassService,
    override uiService: MemberClassUiService,
    private settingService: SettingService
  ) {
    super(fb, ref, service, uiService);
  }
  fileLists: NzUploadFile[] = [];

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
  isMemberClassEdit = signal<boolean>(true);
  isMemberClassRemove = signal<boolean>(true);
  override ngOnInit(): void {
    if (this.isLoading()) return;
    this.initControl();
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === "edited") {
          this.isLoading.set(true);
          this.service.find(this.modal?.id).subscribe({
            next: (result: MemberClass) => {
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
        } else {
          this.ref.triggerCancel().then();
        }
      });
    }
    if (this.modal?.id) {
      this.isLoading.set(true);
      this.service.find(this.modal?.id).subscribe((result: MemberClass) => {
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
          return;
        }
      }
    });
  }

  override initControl() {
    const {
      codeExistValidator,
      noteMaxLengthValidator,
      nameMaxLengthValidator,
      nameExistValidator,
      required,
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
      photo: [null],
      note: [null, [noteMaxLengthValidator]],
    });
  }

  override onSubmit(e: any): void {
    if (this.frm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      let photo = this.file[0]?.url;
      if (this.file.length > 0) {
        this.frm.patchValue({
          photo: photo,
        });
      }
      let operation$: Observable<MemberClass> = this.service.add(
        this.frm.getRawValue()
      );
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
          photo: photo,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        operation$.subscribe({
          next: (result: MemberClass) => {
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

  override setFormValue() {
    this.frm.setValue({
      code: this.model.code,
      name: this.model.name,
      note: this.model.note,
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
    this.refreshSub$.unsubscribe();
  }
}
