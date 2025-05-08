import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { MemberClassDeleteComponent } from "./member-class-delete.component";
import { MemberClassOperationComponent } from "./member-class-operation.component";

@Injectable({ providedIn: "root" })
export class MemberClassUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      MemberClassOperationComponent,
      MemberClassDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
