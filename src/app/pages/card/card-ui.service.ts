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

  override showAdd(memberId: number, componentId: any = ""): void {
    this.modalService.create({
      nzContent: CardOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzData: { memberId: memberId, isAdd: true },
      nzWidth: "450px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }
  override showEdit(id: number): void {
    this.modalService.create({
      nzContent: CardOperationComponent,
      nzData: { id: id, isEdit: true },
      nzFooter: null,
      nzClosable: true,
      nzWidth: "450px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "edited", value: e.model });
      },
    });
  }
}
