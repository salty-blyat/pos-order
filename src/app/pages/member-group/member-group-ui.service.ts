import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberGroupOperationComponent } from "./member-group-operation.component";
import { MemberGroupDeleteComponent } from "./member-group-delete.component";

@Injectable({ providedIn: "root" })
export class MemberGroupUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      MemberGroupOperationComponent,
      MemberGroupDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
