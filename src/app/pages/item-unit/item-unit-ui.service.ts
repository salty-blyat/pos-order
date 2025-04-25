import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { ItemUnitOperationComponent } from "./item-unit-operation.component";
import { ItemUnitDeleteComponent } from "./item-unit-delete.component";

@Injectable({ providedIn: "root" })
export class ItemUnitUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      ItemUnitOperationComponent,
      ItemUnitDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }
}
