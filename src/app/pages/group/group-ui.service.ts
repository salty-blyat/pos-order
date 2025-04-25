import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { GroupOperationComponent } from "./group-operation.component";
import { GroupDeleteComponent } from "./group-delete.component";

@Injectable({ providedIn: "root" })
export class GroupUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      GroupOperationComponent,
      GroupDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
