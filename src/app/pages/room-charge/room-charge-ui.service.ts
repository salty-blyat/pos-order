import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomChargeDeleteComponent } from "./room-charge-delete.component";
import { RoomChargeOperationComponent } from "./room-charge-operation.component";

@Injectable({ providedIn: "root" })
export class RoomChargeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      RoomChargeOperationComponent,
      RoomChargeDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
