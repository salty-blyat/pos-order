import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { RedemptionDeleteComponent } from "./redemption-delete.component";

@Injectable({
  providedIn: "root",
})
export class RedemptionUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      "RedeemptionOperationComponent",
      RedemptionDeleteComponent,
      "480px",
      "480px",
      "480px",
      "450px"
    );
  }
}
