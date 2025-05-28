import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { RedemptionDeleteComponent } from "./redemption-delete.component";
import { RedemptionOperationComponent } from "./redemption-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";
import { Redemption } from "./redemption.service";

@Injectable({
  providedIn: "root",
})
export class RedemptionUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      RedemptionOperationComponent,
      RedemptionDeleteComponent,
      "900px",
      "900px",
      "900px",
      "450px"
    );
  }

  override showAdd(componentId: any = "", memberId?: number): void {
    this.modalService.create({
      nzContent: RedemptionOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzData: { memberId },
      nzWidth: "900px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }
}
