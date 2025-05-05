import { EventEmitter, Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { LookupItemOperationComponent } from "./lookup-item-operation.component";
import { LookupItemDeleteComponent } from "./lookup-item-delete.component";
import { BaseUiService } from "../../../utils/services/base-ui.service"; 

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
  override showAdd(componentId: any = "", parentId?:number): void {
    this.modalService.create({
      nzContent: LookupItemOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: "720px",
      nzMaskClosable: false,
      nzData:{lookupTypeId:parentId},
      nzOnOk: (e: any) => { 
        this.refresher.emit({ key: "added", value: e.model, componentId }); 
      },
    });
  }
}
