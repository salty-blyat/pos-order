import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberLevelOperationComponent } from "./member-level-operation.component";
import { MemberLevelDeleteComponent } from "./member-level-delete.component";

@Injectable({ providedIn: "root" })
export class MemberLevelUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      MemberLevelOperationComponent,
      MemberLevelDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );


    
  }
}
