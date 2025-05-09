import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberOperationComponent } from "./member-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";
import { MemberDeleteComponent } from "./member-delete.component";
import { MemberPullComponent } from "./member-pull.component";
import { ItemUploadComponent } from "../offer-group/item-upload.component";

@Injectable({ providedIn: "root" })
export class MemberUiService extends BaseUiService {
  constructor(
    modalService: NzModalService,
    private mainPageService: MainPageService
  ) {
    super(
      modalService,
      MemberOperationComponent,
      MemberDeleteComponent,
      "740px",
      "740px",
      "740px",
      "450px"
    );
  }
  override showAdd(
    memberClassId: number = 0,
    agentId: number = 0,
    componentId: any = ""
  ): void {
    this.modalService.create({
      nzContent: MemberOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: "970px",
      nzCentered: true,
      nzData: { memberClassId, agentId },
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
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
