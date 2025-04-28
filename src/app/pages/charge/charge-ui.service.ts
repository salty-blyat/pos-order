import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { ChargeOperationComponent } from "./charge-operation.component";

@Injectable({
  providedIn: "root",
})
export class ChargeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      ChargeOperationComponent,
      "",
      "580px",
      "580px",
      "580px",
      "450px"
    );
  }
}
