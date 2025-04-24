import { EventEmitter, Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { LookupItemOperationComponent } from "./lookup-item-operation.component";
import { LookupItemDeleteComponent } from "./lookup-item-delete.component";
import { BaseUiService } from "../../../utils/services/base-ui.service";
import { LookupItem } from "./lookup-item.service";

@Injectable({ providedIn: "root" })
export class LookupItemUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      LookupItemOperationComponent,
      LookupItemDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }

  // showAdd(lookupTypeId: any, componentId: any = ""): void {
  //   this.modal.create({
  //     nzContent: LookupItemOperationComponent,
  //     nzFooter: null,
  //     nzClosable: true,
  //     nzWidth: "720px",
  //     nzBodyStyle: { height: "240px" },
  //     nzData: { lookupTypeId },
  //     nzMaskClosable: false,
  //     nzOnOk: (e) => {
  //       this.refresher.emit({ key: "added", value: e.model, componentId });
  //     },
  //   });
  // }

  // showEdit(id: any, lookupTypeId: any): void {
  //   this.modal.create({
  //     nzContent: LookupItemOperationComponent,
  //     nzData: { id, lookupTypeId },
  //     nzFooter: null,
  //     nzClosable: true,
  //     nzWidth: "720px",
  //     nzBodyStyle: { height: "240px" },
  //     nzMaskClosable: false,
  //     nzOnOk: (e) => {
  //       this.refresher.emit({ key: "edited", value: e.model });
  //     },
  //   });
  // }

  // showDelete(id: number): void {
  //   this.modal.create({
  //     nzContent: LookupItemDeleteComponent,
  //     nzData: { id },
  //     nzClosable: true,
  //     nzWidth: "450px",
  //     nzBodyStyle: { height: "210px" },
  //     nzMaskClosable: false,
  //     nzOnOk: (e) => {
  //       this.refresher.emit({ key: "deleted", value: e.model });
  //     },
  //   });
  // }

  // showView(id: number): void {
  //   this.modal.create({
  //     nzContent: LookupItemOperationComponent,
  //     nzData: { id, isView: true },
  //     nzClosable: true,
  //     nzWidth: "720px",
  //     nzBodyStyle: { height: "240px" },
  //     nzMaskClosable: false,
  //   });
  // }
}
