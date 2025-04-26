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
      "600px",
      "600px",
      "600px",
      "450px"
    );
  }
}
