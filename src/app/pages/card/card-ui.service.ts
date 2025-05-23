import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { CardOperationComponent } from "./card-operation.component";
import { CardDeleteComponent } from "./card-delete.component";

@Injectable({
  providedIn: "root",
})
export class CardUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      CardOperationComponent,
      CardDeleteComponent,
      "480px",
      "480px",
      "480px",
      "450px"
    );
  }

  override showAdd(
    componentId: any = "",
    accountId?: number
  ): void {
    this.modalService.create({
      nzContent: CardOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzData: { isAdd: true, accountId: accountId },
      nzWidth: "480px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }
  override showEdit(id: number, accountId?: number): void {
    this.modalService.create({
      nzContent: CardOperationComponent,
      nzData: { id: id, isEdit: true, accountId: accountId },
      nzFooter: null,
      nzClosable: true,
      nzWidth: "480px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "edited", value: e.model });
      },
    });
  }
}
