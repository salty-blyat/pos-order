import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomTypeDeleteComponent } from "./room-type-delete.component";
import { RoomTypeOperationComponent } from "./room-type-operation.component";

@Injectable({
  providedIn: "root",
})
export class RoomTypeUiService extends BaseUiService {
  constructor(
      modalService: NzModalService,
  ) {
    super(modalService, RoomTypeOperationComponent, RoomTypeDeleteComponent, "600px", "600px", "600px", "450px");
  }
}
