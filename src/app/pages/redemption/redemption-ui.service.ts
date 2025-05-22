import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { RedemptionDeleteComponent } from "./redemption-delete.component";
import { RedemptionOperationComponent } from "./redemption-operation.component";

@Injectable({
  providedIn: "root",
})
export class RedemptionUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
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
}
