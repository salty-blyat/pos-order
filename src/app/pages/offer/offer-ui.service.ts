import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { OfferOperationComponent } from "./offer-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";
import { ItemUploadComponent } from "../offer-group/item-upload.component";
import { OfferDeleteComponent } from "./offer-delete.component";
import { OfferListComponent } from "./offer-list.component";

@Injectable({
  providedIn: "root",
})
export class OfferUiService extends BaseUiService {
  constructor(
    modalService: NzModalService,
    private mainPageService: MainPageService
  ) {
    super(
      modalService,
      OfferOperationComponent,
      OfferDeleteComponent,
      "840px",
      "840px",
      "840px",
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
  override showAdd(
    offerGroupId: number = 0,
    offerTypeId: number = 0,
    accountTypeId: number = 0,
    componentId: any = ""
  ): void {
    this.modalService.create({
      nzContent: OfferOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: "840px",
      nzData: { offerGroupId, offerTypeId, accountTypeId },
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }
}
