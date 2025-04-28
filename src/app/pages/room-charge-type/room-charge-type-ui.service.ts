import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomChargeTypeDeleteComponent } from "./room-charge-type-delete.component";
import { RoomChargeTypeOperationComponent } from "./room-charge-type-operation.component";

@Injectable({ providedIn: "root" })
export class RoomChargeTypeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      RoomChargeTypeOperationComponent,
      RoomChargeTypeDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
