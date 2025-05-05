import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberLevelOperationComponent } from "./member-level-operation.component";
import { MemberLevelDeleteComponent } from "./member-level-delete.component";
import { MemberLevelPullComponent } from "./member-level-pull.component";

@Injectable({ providedIn: "root" })
export class MemberLevelUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      MemberLevelOperationComponent,
      MemberLevelDeleteComponent,
      "480px",
      "480px",
      "480px",
      "450px"
    );
  }
  showPull(): void {
    this.modalService.create({
      nzContent: MemberLevelPullComponent,
      nzClosable: true,
      nzFooter: null,
      nzWidth: "350px",
      nzMaskClosable: false,
    });
  }
}
