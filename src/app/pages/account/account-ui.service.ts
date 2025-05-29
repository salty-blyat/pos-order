import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { AccountTypes, TransactionTypes } from "../lookup/lookup-type.service";
import { AccountOperationComponent } from "./account-operation.component";
import { MemberAccount } from "../member/member.service";

@Injectable({
  providedIn: "root",
})
export class AccountUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      AccountOperationComponent,
      "",
      "480px",
      "480px",
      "480px",
      "450px"
    );
  }

  showTransaction(id: number, accountType: AccountTypes): any {
    this.modalService.create({
      nzContent: AccountOperationComponent,
      nzData: { id, isView: true, accountType: accountType },
      nzClosable: true,
      nzFooter: null,
      nzWidth: "480px",
      nzMaskClosable: false,
    });
  }

  showAdjust(
    componentId: any = "",
    accountId: number,
    type: TransactionTypes,
    accountType: AccountTypes
  ): any {
    this.modalService.create({
      nzContent: AccountOperationComponent,
      nzData: {
        type: type,
        accountId: accountId,
        accountType: accountType,
      },
      nzClosable: true,
      nzFooter: null,
      nzWidth: "480px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }
}
