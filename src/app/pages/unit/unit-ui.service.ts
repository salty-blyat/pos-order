import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { UnitOperationComponent } from "./unit-operation.component";
import { UnitDeleteComponent } from "./unit-delete.component";

@Injectable({ providedIn: "root" })
export class UnitUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      UnitOperationComponent,
      UnitDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
