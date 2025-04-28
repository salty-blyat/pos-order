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
}
