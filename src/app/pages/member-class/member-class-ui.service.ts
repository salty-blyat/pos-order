import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { MemberClassDeleteComponent } from "./member-class-delete.component";
import { MemberClassOperationComponent } from "./member-class-operation.component";
import { ItemUploadComponent } from "../offer-group/item-upload.component";

@Injectable({ providedIn: "root" })
export class MemberClassUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      MemberClassOperationComponent,
      MemberClassDeleteComponent,
      "500px",
      "500px",
      "500px",
      "450px"
    );
  }
  showUpload(
    multiple: boolean = false,
    limit: number = 1,
    extension: string = "image/*, application/pdf",
    maxSize: number = 1024
  ) {
    this.modalService.create({
      nzContent: ItemUploadComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: "450px",
      nzMaskClosable: false,
      nzData: {
        multiple,
        limit,
        extension,
        maxSize,
      },
      nzOnOk: (e) => {
        this.refresher.emit({ key: "upload", value: e.file });
      },
    });
  }
}
