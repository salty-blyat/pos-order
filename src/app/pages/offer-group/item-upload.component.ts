import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  signal
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { debounceTime, Observable, Observer, Subscription } from "rxjs";

import { NzMessageService } from "ng-zorro-antd/message";
import { TranslateService } from "@ngx-translate/core";
import { SettingService } from "../../app-setting";
import { CommonValidators } from "../../utils/services/common-validators";
import { UploadFile, UploadService } from "../../utils/services/upload.service";

@Component({
  selector: "app-item-upload",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ "UploadImage" | translate }}</span>
    </div>
    <div
      class="modal-content hover-transition"
      [ngStyle]="{ background: isHover() ? '#e0f0ff' : 'white' }"
    >
      <app-loading *ngIf="loading"></app-loading>
      <div
        (dragover)="isHover.set(true); $event.preventDefault()"
        (dragleave)="isHover.set(false)"
        (drop)="isHover.set(false)"
      >
        <nz-upload
          [nzAction]="uploadUrl"
          [nzMultiple]="false"
          [nzBeforeUpload]="beforeUpload"
          [(nzFileList)]="fileList"
          (nzChange)="handleUpload($event)"
          nzListType="picture"
          [nzDisabled]="fileList.length >= limit"
          style="width: 100%; display:block"
        >
          <div
            style="display:flex; flex-direction:column; align-items:center;gap:4px; padding: 36px;"
          >
            <i
              style="font-size: 32px;"
              nz-icon
              nzType="cloud-upload"
              nzTheme="outline"
            ></i> 
            <p>
              {{ "PleaseClickOrDropImageToUpload" | translate }}
            </p> 
          </div>
        </nz-upload>
      </div>
      <div style="padding: 0 16px 16px 16px ">
        <nz-divider
          [nzText]="'or' | translate"
          nzPlain
          style="margin: 0;"
        ></nz-divider>
        <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
          <nz-form-item>
            <nz-form-control>
              <nz-input-group nzSearch>
                <input
                  type="text"
                  nz-input
                  placeholder="{{
                    'PleasePasteImageUrlOrPasteImage' | translate
                  }}"
                  formControlName="link"
                />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
        </form>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  styles: [
    `
      input {
        border-radius: 6px;
      }
      .hover-transition {
        transition: background 0.3s ease;
      }

      ::ng-deep .ant-upload {
        display: block !important;
      }

      .upload-container {
        width: 100%;
        height: 100%;
        padding: 16px;
        background-color: #f5f5f5;
        text-align: center;
      }
      .modal-content {
        margin: 16px;
        border-radius: 4px;
        border: 1px dashed #d9d9d9;
      }
      .upload-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px 0;
      }
      :host ::ng-deep .ant-upload {
        display: flex;
        justify-content: center;
      }
      :host ::ng-deep .ant-upload-list-item {
        display: block !important;
      }
      :host ::ng-deep .ant-upload-list-picture .ant-upload-list-item,
      .ant-upload-list-picture-card .ant-upload-list-item {
        height: 42px !important;
      }
      :host ::ng-deep .ant-upload-list-item-image {
        width: 32px !important;
      }
      :host
        ::ng-deep
        .ant-upload-list-picture
        .ant-upload-list-item-thumbnail
        img,
      .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
        // width: 100% !important;
        // height: 100% !important;
      }
    `,
  ],
})
export class ItemUploadComponent implements OnInit, OnDestroy {
  constructor(
    private ref: NzModalRef<ItemUploadComponent>,
    private settingService: SettingService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private uploadService: UploadService,
    public translate: TranslateService
  ) {}

  isHover = signal<boolean>(false);
  isValidUrl: boolean = false;
  loading: boolean = false;
  @HostListener("paste", ["$event"])
  async onPaste(event: ClipboardEvent) {
    const items: any = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            const base64String = await this.convertToBase64(file);
            this.uploadImage(base64String, "png");
          }
        }
      }
    }
  }
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  @Input() id: number = 0;
  @Input() multiple: boolean = true;
  @Input() extension: string = "image/*, application/pdf";
  @Input() maxSize: number = 512;
  @Input() limit: number = 10;
  @Input() file: UploadFile = {};
  errMessage: string = "";
  fileList: NzUploadFile[] = [];
  autoTips = CommonValidators.autoTips;
  uploadUrl = `${this.settingService.setting.AUTH_API_URL}/upload/file`;
  frm!: FormGroup;
  isLast = false;
  sub = new Subscription();
  ngOnInit(): void {
    this.initControl();
    this.sub.add(
      this.frm
        .get("link")
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value) {
            if (this.validateImageUrl(value)) {
              this.uploadImageFromUrl(value);
            } else if (this.validateBase64Image(value)) {
              this.uploadImage(value, "png");
            }
          }
        })
    );
  }

  initControl() {
    const { imageValidator } = CommonValidators;
    this.frm = this.fb.group({
      link: ["", [imageValidator]],
    });
  }

  handleUpload(info?: NzUploadChangeParam): void {
    this.isLast = false;
    if (info?.type === "success") {
      this.isLast = true;
      let fileList = [...info.fileList];
      // 1. Limit 5 number of uploaded files
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
      this.fileList = fileList;
      if (this.isLast) {
        this.file = this.fileList[0];
        this.ref.triggerOk().then();
      }
    }
  }
  async uploadImage(image: any, format: any) {
    const fileName: any = Date.now() + "." + format;
    const arr = image.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    let postData: { fileName?: string; mimeType?: string; base64?: string } = {
      fileName: fileName,
      mimeType: mime,
      base64: arr[1],
    };

    this.uploadService.uploadBase64(postData).subscribe({
      next: (item: UploadFile) => {
        this.file = item;

        this.ref.triggerOk().then();
      },
      error: async (err: any) => {
        console.log(err);
      },
    });
  }
  private cors_api_url = "https://cors-anywhere.herokuapp.com/";

  doCORSRequest(options: any, printResult: any) {
    var x = new XMLHttpRequest();
    x.open(options.method, this.cors_api_url + options.url);

    // Set response type to 'blob' to handle binary data (image)
    x.responseType = "blob";

    x.onload = function () {
      if (x.status === 200) {
        const reader = new FileReader();
        reader.onloadend = function () {
          printResult(reader.result);
        };
        reader.readAsDataURL(x.response); // Convert blob to base64
      } else {
        printResult("Failed to fetch image");
      }
    };

    x.onerror = function () {
      printResult("Error in request");
    };

    x.send(options.data);
  }

  // Upload image from URL
  uploadImageFromUrl(imageUrl: string) {
    if (imageUrl) {
      this.loading = true;
      this.doCORSRequest(
        {
          method: "GET",
          url: imageUrl,
        },
        (result: any) => {
          this.frm.disable();
          this.uploadImage(result, "png");
          this.loading = false;
        }
      );
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
        this.msg.error(
          this.translate.instant("You can only upload JPG or PNG files!")
        );
        observer.complete();
        return;
      }
      const isLt500KB = file.size! / 1024 < 512; // Convert size to KB and check
      if (!isLt500KB) {
        this.msg.error(
          this.translate.instant(
            "The uploaded file exceeds the maximum allowed size of 512 KB"
          )
        );
        observer.complete();
        return;
      }
      observer.next(true); // File passes validation
      observer.complete();
    });

  // // Convert Blob to Base64 using FileReader
  // private convertBlobToBase64(blob: Blob): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(blob);
  //   });
  // }

  // Validate Image URL
  validateImageUrl(value: string): boolean {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
    return urlPattern.test(value);
  }

  // Validate Base64 Image
  validateBase64Image(value: string): boolean {
    const base64Pattern =
      /^data:image\/(png|jpg|jpeg|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
    return base64Pattern.test(value);
  }
  cancel() {
    this.ref.triggerCancel().then();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
