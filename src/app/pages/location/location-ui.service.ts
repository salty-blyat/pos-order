import { Injectable } from "@angular/core";
import { LocationOperationComponent } from "./location-operation.component";
import { NzModalService } from "ng-zorro-antd/modal";
import { LocationDeleteComponent } from "./location-delete.component";
import { BaseUiService } from "../../utils/services/base-ui.service";

@Injectable({ providedIn: "root" })
export class LocationUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      LocationOperationComponent,
      LocationDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
