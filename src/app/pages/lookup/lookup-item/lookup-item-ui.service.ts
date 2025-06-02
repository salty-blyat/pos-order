import { EventEmitter, Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { LookupItemOperationComponent } from "./lookup-item-operation.component";
import { LookupItemDeleteComponent } from "./lookup-item-delete.component";
import { BaseUiService } from "../../../utils/services/base-ui.service";
import { ItemUploadComponent } from "../../offer-group/item-upload.component";

@Injectable({ providedIn: "root" })
export class LookupItemUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      LookupItemOperationComponent,
      LookupItemDeleteComponent,
      "720px",
      "720px",
      "720px",
      "450px"
    );
  }
  override showAdd(componentId: any = "", parentId?: number): void {
    this.modalService.create({
      nzContent: LookupItemOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: "720px",
      nzMaskClosable: false,
      nzData: { lookupTypeId: parentId },
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }

  
  override showEdit(id: number,parentId?: number): void {
    this.modalService.create({
      nzContent: LookupItemOperationComponent,
      nzData: { id,lookupTypeId: parentId },
      nzFooter: null,
      nzClosable: true,
      nzWidth: "720px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "edited", value: e.model }); 
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
