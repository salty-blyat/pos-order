import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { ChargeOperationComponent } from "./charge-operation.component";
import { ChargeDeleteComponent } from "./charge-delete.component";

@Injectable({
  providedIn: "root",
})
export class ChargeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      ChargeOperationComponent,
      ChargeDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }

  override showAdd( componentId: any = "" ): void {
    const { chargeTypeId, unitId } = componentId as {
      chargeTypeId: number;
      unitId: number;
    };
    this.modalService.create({
      nzContent: ChargeOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: "450px",
      nzMaskClosable: false,
      nzData: { chargeTypeId, unitId },
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }
}
