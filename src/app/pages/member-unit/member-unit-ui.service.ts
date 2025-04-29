import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberUnitDeleteComponent } from "./member-unit-delete.component";
import { MemberUnitOperationComponent } from "./member-unit-operation.component";

@Injectable({ providedIn: "root" })
export class MemberUnitUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      MemberUnitOperationComponent,
      MemberUnitDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
