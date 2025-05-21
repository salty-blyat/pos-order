import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { AccountDeleteComponent } from "./account-delete.component";
import { AccountOperationComponent } from "./account-operation.component";
import { TransactionViewComponent } from "../transaction/transaction-view.component";

@Injectable({
  providedIn: "root",
})
export class AccountUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      AccountOperationComponent,
      AccountDeleteComponent,
      "480px",
      "480px",
      "480px",
      "450px"
    );
  }

  showDeleteTransaction(id: number): void {
    this.modalService.create({
      nzContent: "TransactionDeleteComponent",
      nzData: { id },
      nzClosable: true,
      nzFooter: null,
      nzWidth: "450px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "deleted", value: e.model });
      },
    });
  }

  showTransaction(id: number): any {
    this.modalService.create({
      nzContent: TransactionViewComponent,
      nzData: { id, isView: true },
      nzClosable: true,
      nzFooter: null,
      nzWidth: "480px",
      nzMaskClosable: false,
    });
  }
}
