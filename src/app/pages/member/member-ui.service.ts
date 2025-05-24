import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberOperationComponent } from "./member-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";
import { MemberDeleteComponent } from "./member-delete.component";
import { ItemUploadComponent } from "../offer-group/item-upload.component";
import { TransactionListComponent } from "../transaction/transaction-list.component";

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
      nzWidth: "100%",
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzData: { memberClassId, agentId, isAdd: true },
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }

  override showEdit(id: number): void {
    this.modalService.create({
      nzContent: MemberOperationComponent,
      nzFooter: null,
      nzData: { id, isEdit: true },
      nzClosable: true,
      nzWidth: "100%",
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "edited", value: e.model });
      },
    });
  }

  override showView(id: number): any {
    this.modalService.create({
      nzContent: MemberOperationComponent,
      nzFooter: null,
      nzData: { id, isView: true },
      nzClosable: true,
      nzWidth: "100%",
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzMaskClosable: false,
    });
  }

  showTransaction(id: number): any {
    this.modalService.create({
      nzContent: TransactionListComponent,
      nzFooter: null,
      nzData: { id },
      nzClosable: true,
      nzWidth: "100%",
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzMaskClosable: false,
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
