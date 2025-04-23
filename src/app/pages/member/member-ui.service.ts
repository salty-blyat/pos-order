import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { Member } from "./member.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberOperationComponent } from "./member-operation.component";

@Injectable({ providedIn: "root" })
export class MemberUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      MemberOperationComponent,
      "",
      "580px",
      "580px",
      "580px",
      "450px"
    );
  }
}
