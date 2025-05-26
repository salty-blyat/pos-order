import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { RedemptionDeleteComponent } from "./redemption-delete.component";
import { RedemptionOperationComponent } from "./redemption-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";

@Injectable({
  providedIn: "root",
})
export class RedemptionUiService extends BaseUiService {
  constructor(
    private mainPageService: MainPageService,
    modalService: NzModalService
  ) {
    super(
      modalService,
      RedemptionOperationComponent,
      RedemptionDeleteComponent,
      "700px",
      "700px",
      "700px",
      "450px"
    );
  }

  // override showAdd(componentId: any = ""): void {
  //   this.modalService.create({
  //     nzContent: RedemptionOperationComponent,
  //     nzFooter: null,
  //     nzClosable: true,
  //     nzWidth: "100%",
  //     nzBodyStyle: this.mainPageService.getModalBodyStyle(),
  //     nzStyle: this.mainPageService.getModalFullPageSize(),
  //     nzMaskClosable: false,
  //     nzOnOk: (e: any) => {
  //       this.refresher.emit({ key: "added", value: e.model, componentId });
  //     },
  //   });
  // }

  // override showView(id: number): any {
  //   this.modalService.create({
  //     nzContent: RedemptionOperationComponent,
  //     nzData: { id, isView: true },
  //     nzClosable: true,
  //     nzFooter: null,
  //     nzWidth: "100%",
  //     nzBodyStyle: this.mainPageService.getModalBodyStyle(),
  //     nzStyle: this.mainPageService.getModalFullPageSize(),
  //     nzMaskClosable: false,
  //   });
  // }
}
