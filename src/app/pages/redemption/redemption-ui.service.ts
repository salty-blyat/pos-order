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
      "900px",
      "900px",
      "900px",
      "450px"
    );
  }
}
