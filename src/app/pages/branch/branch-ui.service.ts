import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { BranchOperationComponent } from "./branch-operation.component";
import { UserPopupSelectComponent } from "./user-popup-select.component";
import { User } from "./branch.service";
import { BranchDeleteComponent } from "./branch-delete.component";

@Injectable({
  providedIn: "root",
})
export class BranchUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      BranchOperationComponent,
      BranchDeleteComponent,
      "660px",
      "660px",
      "660px",
      "450px"
    );
  }
  
  showUserPopupSelect(users: User[]): void {
    this.modalService.create({
      nzContent: UserPopupSelectComponent,
      nzData: { users },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '660px', 
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'addUser', value: e.requestData });
      },
    });
  }
}
