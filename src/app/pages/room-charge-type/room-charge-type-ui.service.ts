import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomChargeTypeDeleteComponent } from "./room-charge-type-delete.component";

@Injectable({ providedIn: "root" })
export class RoomChargeTypeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      '',
      RoomChargeTypeDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
