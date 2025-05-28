import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { RedemptionDeleteComponent } from "./redemption-delete.component";
import { RedemptionOperationComponent } from "./redemption-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";
import { Redemption } from "./redemption.service";
import { RedemptionPrintComponent } from "./redemption-print.component";

@Injectable({
  providedIn: "root",
})
export class RedemptionUiService extends BaseUiService {
  constructor(
    modalService: NzModalService,
    private mainPageService: MainPageService
  ) {
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

  showPrint(model: Redemption, id: number): any {
    this.modalService.create({
      nzContent: RedemptionPrintComponent,
      nzFooter: null,
      nzData: { model, reportId:id },
      nzClosable: true,
      nzWidth: "100%",
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzMaskClosable: false,
    });
  }
}
